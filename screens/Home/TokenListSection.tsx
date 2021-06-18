/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Image, Platform, TouchableOpacity, View} from 'react-native';
import {ThemeContext} from '../../ThemeContext';
// import List from '../../components/List';
import {styles} from './style';
import {formatNumberString, parseDecimals} from '../../utils/number';
import Button from '../../components/Button';
import {useRecoilValue} from 'recoil';
import numeral from 'numeral';
import {getLanguageString} from '../../utils/lang';
import {languageAtom} from '../../atoms/language';
import {filterByOwnerSelector, krc20ListAtom} from '../../atoms/krc20';
import {getBalance} from '../../services/krc20';
import {getSelectedWallet, getWallets} from '../../utils/local';
import {selectedWalletAtom, walletsAtom} from '../../atoms/wallets';
import CustomText from '../../components/Text';

const TokenListSection = ({refreshTime}: {
  refreshTime: number
}) => {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  
  const selectedWallet = useRecoilValue(selectedWalletAtom);
  const wallets = useRecoilValue(walletsAtom)

  const language = useRecoilValue(languageAtom);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<number[]>([]);
  // const tokenList = useRecoilValue(krc20ListAtom);

  // Lấy ví địa chỉ ví hiện tại để lấy ra danh sách TOKEN
  const tokenList = useRecoilValue(filterByOwnerSelector(wallets[selectedWallet].address))

  const updateBalanceAll = async () => {
    setLoading(true);
    const _wallets = await getWallets();
    const _selectedWallet = await getSelectedWallet();
    const promiseArr = tokenList.map((i) => {
      return getBalance(i.address, _wallets[_selectedWallet].address);
    });
    const balanceArr = await Promise.all(promiseArr);
    setBalance(balanceArr);
    setLoading(false);
  }

  useEffect(() => {
    updateBalanceAll();
  }, [tokenList, selectedWallet, refreshTime]);

  const renderIcon = (avatar: string) => {
    return (
      <View style={{ marginRight: 8 }}>
        <View
          style={{
            width: 40,
            height: 40,

            borderRadius: 20,
            backgroundColor: 'white',

            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',

            borderWidth: 1,
            borderColor: theme.red700,
          }}>
          {avatar ? (
            <Image source={{uri: avatar}} style={styles.tokenLogo} />
          ) : (
            <Image
              source={require('../../assets/logo.png')}
              style={styles.kaiLogo}
            />
          )}
        </View>
      </View>
    );
  };


  //PHAN TOKEN LIST O DUOI, CU THE LA FADO COIN
  const renderTokenList = () => {
    
    
    return tokenList.slice(0, 7).map((item, index) => {
      return <View
        key={item.name}
        style={{
          padding: 14,
          paddingLeft:12,
          marginHorizontal: 20,
          borderRadius: 12,
          marginVertical: 6,
          backgroundColor: theme.red600,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1
          }}
          >
          {renderIcon(item.avatar || '')}
            <View
              style={{
              flex:1,
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              height: '100%',
                }}>
                      <CustomText allowFontScaling={false}  
                                  style={{ 
                                    color: 'rgba(255, 255, 255, 0.8)', 
                                    fontSize: 14,
                                    marginBottom: 4}}>
                            {getLanguageString(language, 'BALANCE').toUpperCase()}
                      </CustomText>
                      <View
                          style={{
                            width:'100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems:'center',
                          }}>
                          <View>
                            <CustomText style={{color: theme.white, fontSize: 18,  fontWeight: 'bold' ,marginRight: 5, marginBottom: 4,}}>
                              {formatNumberString(parseDecimals(balance[index], item.decimals), 2)}{' '} 
                              <CustomText style={{color: 'rgba(255,255,255,0.8)', fontWeight: '500' , fontSize: 18}}>
                                {item.symbol}
                              </CustomText>
                            </CustomText>

                            <CustomText style={{color: theme.white, fontWeight: '500' , fontSize: 14}}>
                              <CustomText style={{color: theme.white, fontWeight: '500' , fontSize: 14}}>
                              $
                              </CustomText>
                              {formatNumberString(parseDecimals(balance[index] * 0.023, item.decimals), 2)} 
                            </CustomText>
                          </View>
                      </View>
            </View>
            <Button
              title={getLanguageString(language, 'BUY_FADO')}
              onPress={() => Alert.alert('Coming soon')}
              // onPress={() => Linking.openURL(SIMPLEX_URL)}
              type="ghost"
              size="small"
              textStyle={Platform.OS === 'android' ? {color: '#000000', fontFamily: 'WorkSans-SemiBold'} : {color: '#000000', fontWeight: '500'}}
              style={{
                paddingHorizontal: 16, 
                paddingVertical: 8,
                backgroundColor: theme.yellow500,
              }}
            />
        </View>
      </View>
    })
  }

  return (
    <View style={styles.tokenListContainer}>
      {/* <NewTokenModal visible={showModal} onClose={() => setShowModal(false)} /> */}
      {tokenList.length === 0 && !loading && (
        <View style={{alignItems: 'center', marginTop: 45, marginBottom: 30}}>
          <Image
            style={{width: 111, height: 52}}
            source={require('../../assets/no_tokens_dark.png')}
          />
          <CustomText style={[styles.noTXText, {color: theme.textColor}]}>
            {getLanguageString(language, 'NO_TOKENS')}
          </CustomText>
          <CustomText style={{color: theme.mutedTextColor, fontSize: 12, marginBottom: 16}}>
            {getLanguageString(language, 'NO_TOKENS_SUB_TEXT')}
          </CustomText>
          <Button
            type="outline"
            textStyle={{fontWeight: 'bold', fontSize: 12}}
            style={{paddingVertical: 8, paddingHorizontal: 16}}
            onPress={() => navigation.navigate('NewKRC20Tokens')}
            title={`+ ${getLanguageString(language, 'ADD_TOKEN')}`}
          />
        </View>
      )}
      {loading ? <ActivityIndicator color={theme.textColor} size="large" /> : (
        renderTokenList()
      )}
    </View>
  );
};

export default TokenListSection;
