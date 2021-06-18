/* eslint-disable react-native/no-inline-styles */
import React, {FC, useContext, useEffect, useState} from 'react';
import {Keyboard, Platform, StyleSheet, Text, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import numeral from 'numeral';
import {useRecoilValue} from 'recoil';
import {languageAtom} from '../../../atoms/language';
import Divider from '../../../components/Divider';
import Modal from '../../../components/Modal';
import TextAvatar from '../../../components/TextAvatar';
import TextInput from '../../../components/TextInput';
import {ThemeContext} from '../../../ThemeContext';
import {getLanguageString, parseError} from '../../../utils/lang';
import {getDigit, isNumber, format, parseKaiBalance, parseDecimals, formatNumberString} from '../../../utils/number';

import {cellValue, weiToKAI} from '../../../services/transaction/amount';
import Button from '../../../components/Button';
import {BLOCK_TIME, MIN_DELEGATE} from '../../../config';
import { getSelectedWallet, getWallets, getTokenList } from '../../../utils/local';
import {delegateAction, getAllValidator} from '../../../services/staking';
import {getLatestBlock} from '../../../services/blockchain';
import AuthModal from '../AuthModal';
import {useNavigation} from '@react-navigation/native';
import { getBalance } from '../../../services/account';
import { selectedWalletAtom, walletsAtom } from '../../../atoms/wallets';
import CustomText from '../../../components/Text';
import { theme } from '../../../theme/light';
import { getFadoBalance, getFadoTokenTotalStakedAmount, stakeFadoToken } from '../../../services/fadostaking';
import BigNumber from 'bignumber.js';



interface thisModalProp {
visible : boolean ,
onClose : () => void,
validatorItem? : Validator,
}

const FadoNewStakingModal = ({visible , onClose ,validatorItem} : thisModalProp) => {
  const language = useRecoilValue(languageAtom);
  const navigation = useNavigation();

  const [delegating, setDelegating] = useState(false);
  const [fadoBalance, setFadoBalance] = useState(0);
  const [amount, setAmount] = useState('0');
  const [amountError, setAmountError] = useState('');
  const[showAuthModal, setShowAuthModal] = useState(false);
  const [totalStakedAmount, setTotalStakedAmount] = useState();

  //Reset Func, clear all current stake 
  const resetState = () => {
    setAmount('0');
    setAmountError('');
    setShowAuthModal(false);
    setDelegating(false);
  }
  // end **resetState** 

  const validateInputAmout = async () => {
    setAmountError('');

    if (Number(getDigit(amount)) < MIN_DELEGATE) {
      setAmountError(
        getLanguageString(language, 'AT_LEAST_MIN_DELEGATE').replace(
          '{{MIN_FADO}}',
          numeral(MIN_DELEGATE).format('0,0'),
        ),
      );
      return false;
    }

    const wallets = await getWallets();
    const selectedWallet = await getSelectedWallet();
    const balance = await getBalance(wallets[selectedWallet].address)
    if (
      Number(getDigit(amount)) >
      Number(weiToKAI(balance))
    ) {
      setAmountError(getLanguageString(language, 'STAKING_AMOUNT_NOT_ENOUGHT'));
      return false;
    }
    console.log("ABC");
    
    return true;
  }

  const _getBalance = async () => {
    const wallets = await getWallets();
    const selectedWallet = await getSelectedWallet();

    var fadoBalance = await getFadoBalance(wallets[selectedWallet].address);
    
    var totalStakedAmount = await getFadoTokenTotalStakedAmount();
    if(totalStakedAmount > 0){
      setTotalStakedAmount(totalStakedAmount);
    }

    setFadoBalance( Number(weiToKAI(fadoBalance)) );

    return cellValue((weiToKAI(fadoBalance)));
  }

  // FADO JSC COMMISSION RATE
  const getSelectedCommission = () => {
    const formatted = numeral(validatorItem?.commissionRate).format('0,0.00');
    return formatted === 'NaN' ? '0 %' : `${formatted} %`;
  };

  useEffect(() => {
    _getBalance();
  }, [])

  const [keyboardShown, setKeyboardShown] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Keyboard.addListener('keyboardWillShow', _keyboardDidShow);
      Keyboard.addListener('keyboardWillHide', _keyboardDidHide);
    } else {
      Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    }

    // cleanup function
    return () => {
      if (Platform.OS === 'ios') {
        Keyboard.removeListener('keyboardWillShow', _keyboardDidShow);
        Keyboard.removeListener('keyboardWillHide', _keyboardDidHide);
      } else {
        Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
      }
    };
  }, []);

  const _keyboardDidShow = (e: any) => {
    setKeyboardOffset(e.endCoordinates.height);
    setKeyboardShown(true);
  };

  const _keyboardDidHide = () => {
    setKeyboardOffset(0);
    setKeyboardShown(false);
  };

  const getModalStyle = () => {
    if (Platform.OS === 'android') {
      return {
        backgroundColor: theme.modalBgColor,
        justifyContent: 'flex-start',
        height: 590,
        marginBottom: keyboardShown ? -180 : 0,
        marginTop: keyboardShown ? 180 : 0,
      };
    } else {
      return {
        backgroundColor: theme.modalBgColor,
        justifyContent: 'flex-start',
        height: 560,
        marginBottom: keyboardOffset,
        marginTop: -keyboardOffset,
      };
    }
  };

  const stakeHanlder = async () => {
    setAmountError('');
    try{
      setDelegating(true);
      const wallets = await getWallets();
      const selectedWallet = await getSelectedWallet();

      const rs = await stakeFadoToken(Number(getDigit(amount)), wallets[selectedWallet]);

      if (rs.status === 0) {
        setDelegating(false);
      } else {
        setDelegating(false);
        navigation.navigate('Transaction', {
          screen: 'SuccessTx',
          params: {
            txHash: rs,
            type: 'delegate',
            validatorItem: validatorItem,
          },
        });
        resetState();
        onClose();
      }
    } catch (err) {
      console.error(err);
      setDelegating(false);
      if (err.message) {
        setAmountError(parseError(err.message, language));
      } else {
        setAmountError(getLanguageString(language, 'GENERAL_ERROR'));
      }
    }
  };

  if (showAuthModal) {
    return (
      <AuthModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={stakeHanlder}
      />
    );
  }

  return (
    <Modal
      visible={visible}
      showCloseButton={false}
      onClose={() => {
        resetState();
        onClose();
      }}
      contentStyle={getModalStyle()}
      >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1, width: '100%'}}>
          <View style={styles.header}>
            <CustomText style={styles.headline}>Transaction</CustomText>
          </View>

          <View style={{marginBottom: 4, flexDirection: 'row', justifyContent: 'space-between'}}>
              <CustomText style={{color: theme.textColor}}>
                {getLanguageString(language, 'STAKING_AMOUNT')}
              </CustomText>
            
              <TouchableOpacity onPress={async () => setAmount(parseDecimals(3600434764032778000000, 18).toString())}>
                <CustomText style={{color: theme.urlColor}}>
                 { fadoBalance.toFixed(4) } FADO
                </CustomText>
              </TouchableOpacity>
          </View>

          <TextInput
              message={amountError}
              inputStyle={{
                backgroundColor: theme.inputBgColor,
                borderColor: theme.inputBorderColor,
                color: theme.textColor,
              }}
              // headline={getLanguageString(language, 'STAKING_AMOUNT')}
              headlineStyle={{fontWeight: 'normal'}}
              keyboardType="numeric"
              value={amount}
              onChangeText={(newAmount) => {
                const digitOnly = getDigit(newAmount, true);

                if (digitOnly === '') {
                  setAmount('0');
                  return;
                }
                if (isNumber(digitOnly)) {                                            
                  let formatedValue = formatNumberString(digitOnly);

                  const [numParts, decimalParts] = digitOnly.split('.')
                  if (!decimalParts && decimalParts !== "") {
                    setAmount(formatedValue);
                    return
                  }

                  formatedValue = formatNumberString(numParts) + '.' + decimalParts
                                  
                  setAmount(formatedValue);
                }
                // isNumber(digitOnly) && setAmount(digitOnly);
              }}
              onBlur={() => setAmount(formatNumberString(getDigit(amount)))}
           />

          <View style={{width: '100%', marginTop: 12}}>
            <CustomText style={{color: theme.textColor}}>Validator</CustomText>

            <View
              style={[
                styles.validatorItemContainer,
                {
                  backgroundColor: theme.backgroundColor,
                },
              ]}>

            <TextAvatar
                text={validatorItem ? validatorItem.name : 'FADO'}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 12,
                  marginRight: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                textStyle={{fontSize: 16}}
              />

            <View style={{justifyContent: 'space-between'}}>
                <CustomText
                  style={{
                    color: theme.textColor,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  {validatorItem ? validatorItem.name : 'FADO'}
                </CustomText>

                <CustomText
                  style={{
                    color: theme.gray600,
                    fontSize: theme.defaultFontSize,
                  }}>
                  {validatorItem ? validatorItem.commissionRate : 10} %
                </CustomText>

            </View>
          </View>

          <Divider style={{width: '100%', backgroundColor: theme.gray400}} />

          <View style={{width: '100%'}}>           
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6}}>
              <CustomText style={{color: theme.textColor, fontStyle: 'italic'}}>
                {getLanguageString(language, 'COMMISSION_RATE')}
              </CustomText>
              <CustomText style={[{color: theme.textColor}]}>
                {getSelectedCommission()}
              </CustomText>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6}}>
              <CustomText style={{color: theme.textColor, fontStyle: 'italic'}}>
                {getLanguageString(language, 'TOTAL_STAKED_AMOUNT')}
              </CustomText>
              <CustomText style={[{color: theme.textColor}]}>
                {totalStakedAmount && totalStakedAmount != 0 && totalStakedAmount}
              </CustomText>
            </View>
          
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6}}>
              <CustomText style={{color: theme.textColor, fontStyle: 'italic'}}>
                {getLanguageString(language, 'ESTIMATED_EARNING')}
              </CustomText>
            </View>
          </View>

          <Divider style={{width: '100%', backgroundColor: theme.gray400}} />

          <View style={{width: '100%'}}>
            <Button
              type="outline"
              title={getLanguageString(language, 'CANCEL')}
              onPress={() => {
                resetState();
                onClose();
              }}
              disabled={delegating}
              style={{marginBottom: 12, marginTop: 12}}
            />
            <Button
              loading={delegating}
              disabled={delegating}
              type="primary"
              title={getLanguageString(language, 'DELEGATE')}
              onPress={async () => {
                
                if (await validateInputAmout()) {
                  
                  
                  setShowAuthModal(true);
                
                }
              }}
              textStyle={Platform.OS === 'android' ? {fontFamily: 'WorkSans-SemiBold', fontSize: theme.defaultFontSize + 3} : {fontWeight: '500', fontSize: theme.defaultFontSize + 3}}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
  );
};

export default FadoNewStakingModal;

const styles = StyleSheet.create({
  header:{
    justifyContent: 'center',
    alignItems:'center',
    textAlign: 'center',
    marginBottom:10,
  },
  headline:{
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.primary,
  },
  validatorItemContainer:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 12,
    marginTop: 4,
    borderRadius: 8,
    width: '100%',
  },

});