import BigNumber from 'bignumber.js';
import React, { useContext, useEffect, useState } from 'react';
import { Image, Platform, TouchableOpacity, View } from 'react-native';
import { useRecoilValue } from 'recoil';
import { languageAtom } from '../../atoms/language';
import { selectedWalletAtom, walletsAtom } from '../../atoms/wallets';
import TxSettingModal from './TxSettingModal'
import Button from '../../components/Button';
import Divider from '../../components/Divider';
import CustomText from '../../components/Text';
import CustomTextInput from '../../components/TextInput';
import { approveToken, calculateDexAmountOut, calculateDexExchangeRate, calculateTransactionDeadline, formatDexToken } from '../../services/dex';
import { getBalance } from '../../services/krc20';
import { ThemeContext } from '../../ThemeContext';
import { getLanguageString } from '../../utils/lang';
import { getSelectedWallet, getWallets } from '../../utils/local';
import { formatNumberString, getDigit, isNumber, parseDecimals } from '../../utils/number';
import { swapTokens } from '../../services/dex';
import { useNavigation } from '@react-navigation/core';

export default ({triggerSelectPair, tokenFrom: _tokenFrom, tokenTo: _tokenTo, tokenFromLiquidity: _tokenFromLiquidity, tokenToLiquidity: _tokenToLiquidity}: {
  triggerSelectPair: () => void;
  tokenFrom?: PairToken;
  tokenTo?: PairToken;
  tokenFromLiquidity?: string;
  tokenToLiquidity?: string;
}) => {
  const navigation = useNavigation()
  const wallets = useRecoilValue(walletsAtom)
  const selectedWallet = useRecoilValue(selectedWalletAtom)
  const theme = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom)

  const [tokenFrom, setTokenFrom] = useState<PairToken | undefined>(_tokenFrom)
  const [tokenFromLiquidity, setTokenFromLiquidity] = useState(_tokenFromLiquidity)
  const [amountFrom, setAmountFrom] = useState('0')
  const [balanceFrom, setBalanceFrom] = useState('0');

  const [tokenTo, setTokenTo] = useState<PairToken | undefined>(_tokenTo)
  const [tokenToLiquidity, setTokenToLiquidity] = useState(_tokenToLiquidity)
  const [amountTo, setAmountTo] = useState('0')
  const [balanceTo, setBalanceTo] = useState('0');

  const [editting, setEditting] = useState('');
  const [processing, setProcessing] = useState(false)
  const [mode, setMode] = useState('BUY')

  const [rate, setRate] = useState<BigNumber | number>();
  const [txDeadline, setTxDeadline] = useState('2')
  const [slippageTolerance, setSlippageTolerance] = useState('1')

  const [showTxSettingModal, setShowTxSettingModal] = useState(false)

  useEffect(() => {
    if (!_tokenFrom) return
    setTokenFrom(formatDexToken(_tokenFrom, wallets[selectedWallet]))
  }, [_tokenFrom])

  useEffect(() => {
    if (!_tokenTo) return
    setTokenTo(formatDexToken(_tokenTo, wallets[selectedWallet]))
  }, [_tokenTo])

  useEffect(() => {
    (async () => {
      if (!tokenFrom) return;
      const wallets = await getWallets();
      const selectedWallet = await getSelectedWallet();
      if (tokenFrom.symbol === 'KAI') {
        setBalanceFrom(wallets[selectedWallet].balance)
      } else if (tokenFrom.symbol !== 'WKAI') {
        const balance = await getBalance(tokenFrom.hash, wallets[selectedWallet].address)
        setBalanceFrom(balance)
      }
    })()
  }, [tokenFrom])

  useEffect(() => {
    (async () => {
      if (!tokenTo) return;

      const wallets = await getWallets();
      const selectedWallet = await getSelectedWallet();

      if (tokenTo.symbol === 'KAI') {
        setBalanceTo(wallets[selectedWallet].balance)
      } else if (tokenTo.symbol !== 'WKAI') {
        const balance = await getBalance(tokenTo.hash, wallets[selectedWallet].address)
        setBalanceTo(balance)
      }
    })()
  }, [tokenTo])

  useEffect(() => {
    (async () => {
      if (!tokenFrom || !tokenTo) return;
      const wallets = await getWallets();
      const selectedWallet = await getSelectedWallet();
      const _rate = await calculateDexExchangeRate(tokenFrom, tokenTo, wallets[selectedWallet])
      setRate(new BigNumber(_rate.rateAB))
    })()
  }, [])

  useEffect(() => {
    (async () => {
      if (editting === 'from' && rate && tokenFrom && tokenTo) {
        if (amountFrom === '0' || amountFrom === '') {
          setAmountTo('0');
          return;
        }
        const _wallets = await getWallets();
        const _selectedWallet = await getSelectedWallet();
        const _newTo = await calculateDexAmountOut(amountFrom, "AMOUNT", tokenFrom, tokenTo, _wallets[_selectedWallet])
        setAmountTo(formatNumberString(_newTo))
        // const newTo = (new BigNumber(getDigit(amountFrom))).multipliedBy(rate)
        // setAmountTo(formatNumberString(newTo.toFixed()))
      }
    })()
  }, [amountFrom, rate])

  useEffect(() => {
    (async () => {
      if (editting === 'to' && rate && tokenFrom && tokenTo) {
        if (amountTo === '0' || amountTo === '') {
          setAmountFrom('0');
          return;
        }
        const _wallets = await getWallets();
        const _selectedWallet = await getSelectedWallet();
        const _newFrom = await calculateDexAmountOut(amountTo, "TOTAL", tokenFrom, tokenTo, _wallets[_selectedWallet])
        setAmountFrom(formatNumberString(_newFrom))
      }
    })()
  }, [amountTo, rate])

  const handleSwitchToken = async () => {
    const _from = JSON.parse(JSON.stringify(tokenFrom))
    const _to = JSON.parse(JSON.stringify(tokenTo))

    const _fromLiquidity = JSON.parse(JSON.stringify(tokenFromLiquidity))
    const _toLiquidity = JSON.parse(JSON.stringify(tokenToLiquidity))

    setAmountFrom('0')
    setAmountTo('0')
    setTokenTo(_from)
    setTokenFrom(_to)
    setTokenFromLiquidity(_toLiquidity)
    setTokenToLiquidity(_fromLiquidity)

    const _rate = await calculateDexExchangeRate(_from, _to, wallets[selectedWallet])
    setRate(new BigNumber(_rate.rateBA))

    if (mode === 'BUY') {
      setMode('SELL')
    } else {
      setMode('BUY')
    }
  }

  const handleSubmitMarket = async () => {
    if (!tokenFrom || !tokenTo) return;
    setProcessing(true)

    try {
      const _wallets = await getWallets();
      const _selectedWalelt = await getSelectedWallet();
      // Approve token before swap
      await approveToken(tokenFrom, getDigit(amountFrom), _wallets[_selectedWalelt])

      // Swap token
      const swapParams = {
        amountIn: getDigit(amountFrom),
        amountOut: getDigit(amountTo),
        tokenIn: {
          tokenAddress: tokenFrom.hash,
          decimals: tokenFrom.decimals
        },
        tokenOut: {
          tokenAddress: tokenTo.hash,
          decimals: tokenTo.decimals
        },
        addressTo: _wallets[_selectedWalelt].address,
        inputType: editting === 'to' ? 1 : 0,
        slippageTolerance,
        txDeadline: await calculateTransactionDeadline(txDeadline),
      }

      const txResult = await swapTokens(swapParams, _wallets[_selectedWalelt])
      setProcessing(false)

      if (txResult.status === 1) {
        // Handling success tx
        navigation.navigate('Transaction', {
          screen: 'SuccessTx',
          params: {
            type: 'dex',
            dexAmount: mode === 'SELL' ? getDigit(amountFrom) : getDigit(amountTo),
            tokenSymbol: mode === 'SELL' ? tokenFrom.symbol : tokenTo.symbol,
            dexMode: `DEX_MODE_${mode}`,
            txHash: txResult.transactionHash
          },
        });
      } else {
        // Handling fail tx
      }

    } catch (error) {
      console.log(error)
      setProcessing(false);
    }
  }

  const renderRate = () => {
    if (tokenFrom && tokenTo && tokenFromLiquidity && tokenToLiquidity && rate) {
      return (
        <View style={{marginTop: 12}}>
          <CustomText style={{color: theme.textColor}}>
            1{' '}
            <CustomText style={{color: theme.mutedTextColor}}>{tokenFrom.symbol}</CustomText>{' '}={' '}
            <CustomText style={{color: theme.textColor}}>~ {formatNumberString(rate.toFixed())}</CustomText>
            <CustomText style={{color: theme.mutedTextColor}}> {tokenTo.symbol}</CustomText>
          </CustomText>
        </View>
      )
    }
  }

  const renderSetting = () => {
    if (tokenFrom && tokenTo && tokenFromLiquidity && tokenToLiquidity && rate) {
      return (
        <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 16}}>
          <TxSettingModal
            visible={showTxSettingModal}
            slippageTolerance={slippageTolerance}
            deadline={txDeadline}
            onClose={() => {
              setShowTxSettingModal(false);
            }}
            onSubmit={(newDeadline, newSlippageTolerance) => {
              setTxDeadline(newDeadline);
              setSlippageTolerance(newSlippageTolerance);
              setShowTxSettingModal(false);
            }}
          />
          <Divider height={0.5} style={{width: '100%', backgroundColor: 'rgba(96, 99, 108, 1)', height: 2}} />
          <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%'}} onPress={() => setShowTxSettingModal(true)}>
            <Image style={{width: 16, height: 16, marginRight: 4}} source={require('../../assets/icon/setting_dark.png')} />
            <CustomText style={{color: theme.textColor}}>{getLanguageString(language, 'TX_SETTING')}</CustomText>
          </TouchableOpacity>
        </View>
      )
    }
  }

  return (
    <View 
      style={{
        width: '100%',
        alignItems: 'center',
        backgroundColor: theme.backgroundFocusColor,
        paddingHorizontal: 16,
        paddingVertical: 24,
        borderRadius: 12,
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 12,
        shadowRadius: 8,
        elevation: 11,
      }}>
      <TouchableOpacity 
        style={{
          backgroundColor: theme.backgroundColor,
          padding: 16, 
          width: '100%',
          borderRadius: 12,
          marginBottom: tokenFrom && tokenTo ? 12 : 0,
          flexDirection: 'row',
          alignItems: 'center'
        }}
        onPress={triggerSelectPair}
      >
        <View style={{flexDirection: 'row', marginRight: 12}}>
          {
            tokenFrom && (
              <View style={{width: 32, height: 32, backgroundColor: '#FFFFFF', borderRadius: 16}}>
                <Image
                  source={{uri: tokenFrom.logo}}
                  style={{width: 32, height: 32}}
                />
              </View>
            )
          }
          {
            tokenTo && (
              <View 
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  marginLeft: -8,
                  shadowColor: 'rgba(0, 0, 0, 0.3)',
                  shadowOffset: {
                    width: -6,
                    height: 0,
                  },
                  shadowOpacity: 12,
                  shadowRadius: 8,
                  elevation: 11,
                }}
              >
                <Image
                  source={{uri: tokenTo.logo}}
                  style={{width: 32, height: 32}}
                />
              </View>
            )
          }
        </View>
        <View style={{flex: 1}}>
          {tokenFrom && tokenTo && <CustomText style={{color: theme.textColor, fontWeight: 'bold', fontSize: theme.defaultFontSize + 4}}>{tokenFrom.symbol} / {tokenTo.symbol}</CustomText>}
          <CustomText style={{color: theme.mutedTextColor, fontSize: theme.defaultFontSize}}>
            {getLanguageString(language, 'CLICK_TO_SELECT_PAIR')}
          </CustomText>
        </View>
        <Image
          source={require('../../assets/icon/chevron-right.png')}
          style={{width: 20, height: 20}}
        />
      </TouchableOpacity>
      {tokenFrom && (
        <View style={{width: '100%'}}>
          <CustomText 
            style={{
              color: theme.textColor,
              fontSize: theme.defaultFontSize + 1,
              fontFamily: Platform.OS === 'android' ? 'WorkSans-SemiBold' : undefined,
              fontWeight: '500',
              marginBottom: 6
            }}
          >
            {getLanguageString(language, 'FROM')}
          </CustomText>
          <View style={{flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between'}}>
            <CustomTextInput
              value={amountFrom}
              onChangeText={(newValue) => {
                // setAmountFrom(formatNumberString(getDigit(newValue)))
                const digitOnly = getDigit(newValue);
                if (digitOnly === '') {
                  setAmountFrom('0')
                }
                if (new BigNumber(digitOnly).isGreaterThan(new BigNumber(parseDecimals(tokenFromLiquidity!, tokenFrom.decimals)))) {
                  return;
                }
              
                if (isNumber(digitOnly)) {
                  let formatedValue = formatNumberString(digitOnly);
                  if (newValue[newValue.length - 1] === '.') formatedValue += '.'
                  setAmountFrom(formatedValue)
                }
              }}
              containerStyle={{width: '100%'}}
              inputStyle={{
                backgroundColor: 'rgba(96, 99, 108, 1)',
                color: theme.textColor,
                paddingRight: 90
              }}
              onFocus={() => {
                setEditting('from')
              }}
              onBlur={() => {
                setEditting('')
                setAmountFrom(formatNumberString(getDigit(amountFrom)))
              }}
            />
            <View style={{position: 'absolute', right: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: 60}}>
              {
                tokenFrom && (
                  <>
                    <View style={{width: 20, height: 20, backgroundColor: '#FFFFFF', borderRadius: 10, marginRight: 8}}>
                      <Image
                        source={{uri: tokenFrom.logo}}
                        style={{width: 20, height: 20}}
                      />
                    </View>
                    <CustomText style={{color: theme.textColor}}>{tokenFrom.symbol}</CustomText>
                  </>
                )
              }
            </View>
          </View>
          <CustomText style={{marginTop: 4, color: theme.mutedTextColor, lineHeight: 20}}>
            {getLanguageString(language, 'BALANCE')}:{' '}
            <CustomText style={{color: theme.textColor}}>{formatNumberString(parseDecimals(balanceFrom, tokenFrom.decimals), 6)}</CustomText>
          </CustomText>
        </View>
      )}
      {
        tokenFrom && tokenTo && (
          <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 16}}>
            <Divider height={0.5} style={{width: '100%', backgroundColor: '#F0F1F2'}} />
            <TouchableOpacity 
              style={{
                backgroundColor: 'rgba(96, 99, 108, 1)',
                width: 24,
                height: 24,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 2,
                shadowRadius: 4,
                elevation: 9,
              }}
              onPress={handleSwitchToken}
            >
              <Image 
                source={require('../../assets/icon/swap_dark.png')}
                style={{width: 16, height: 16}}
              />
            </TouchableOpacity>
          </View>
        )
      }
      {tokenTo && (
        <View style={{width: '100%', marginTop: 12}}>
          <CustomText 
            style={{
              color: theme.textColor,
              fontSize: theme.defaultFontSize + 1,
              fontFamily: Platform.OS === 'android' ? 'WorkSans-SemiBold' : undefined,
              fontWeight: '500',
              marginBottom: 6
            }}
          >
            {getLanguageString(language, 'TO')}
          </CustomText>
          <View style={{flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between'}}>
            <CustomTextInput
              value={amountTo}
              // editable={false}
              onChangeText={(newValue) => {
                const digitOnly = getDigit(newValue);
                if (digitOnly === '') {
                  setAmountTo('0')
                }
                if (new BigNumber(digitOnly).isGreaterThan(new BigNumber(parseDecimals(tokenToLiquidity!, tokenTo.decimals)))) {
                  return;
                }
              
                if (isNumber(digitOnly)) {
                  let formatedValue = formatNumberString(digitOnly);
                  if (newValue[newValue.length - 1] === '.') formatedValue += '.'
                  setAmountTo(formatedValue)
                }
              }}
              containerStyle={{width: '100%'}}
              inputStyle={{
                // backgroundColor: 'rgba(184, 184, 184, 1)',
                // color: 'rgba(28, 28, 40, 0.36)',
                backgroundColor: 'rgba(96, 99, 108, 1)',
                color: theme.textColor,
                paddingRight: 90
              }}
              onFocus={() => {
                setEditting('to')
              }}
              onBlur={() => {
                setEditting('')
                setAmountTo(formatNumberString(getDigit(amountTo)))
              }}
            />
            <View style={{position: 'absolute', right: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: 60}}>
              {
                tokenTo && (
                  <>
                    <View style={{width: 20, height: 20, backgroundColor: '#FFFFFF', borderRadius: 10, marginRight: 8}}>
                      <Image
                        source={{uri: tokenTo.logo}}
                        style={{width: 20, height: 20}}
                      />
                    </View>
                    <CustomText style={{color: theme.textColor}}>{tokenTo.symbol}</CustomText>
                  </>
                )
              }
            </View>
          </View>
          {tokenTo && (
            <CustomText style={{marginTop: 4, color: theme.mutedTextColor, lineHeight: 20}}>
              {getLanguageString(language, 'BALANCE')}:{' '}
              <CustomText style={{color: theme.textColor}}>{formatNumberString(parseDecimals(balanceTo, tokenTo.decimals), 6)}</CustomText>
            </CustomText>
          )}
        </View>
      )}
      {renderRate()}
      {renderSetting()}
      {
        tokenFrom && tokenTo && (
          <Button
            loadingColor={mode === 'BUY' ? '#000000' : '#FFFFFF'}
            loading={processing}
            disabled={processing}
            title={
              mode === 'BUY' ? 
              `${getLanguageString(language, 'BUY')} ${tokenTo.symbol}` : 
              `${getLanguageString(language, 'SELL')} ${tokenFrom.symbol}`
            }
            type="secondary"
            onPress={handleSubmitMarket}
            style={{
              marginTop: 32,
              width: '100%',
              backgroundColor: mode === 'BUY' ? 'rgba(105, 235, 102, 1)' : 'rgba(255, 66, 67, 1)'
            }}
            textStyle={{
              fontSize: theme.defaultFontSize + 3,
              fontWeight: '500',
              fontFamily: Platform.OS === 'android' ? 'WorkSans-SemiBold' : undefined,
              color: mode === 'BUY' ? '#000000' : '#FFFFFF'
            }}
          />
        )
      }
    </View>
  )
}