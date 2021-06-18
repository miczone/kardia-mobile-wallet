/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import numeral from 'numeral';
import {Alert, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ThemeContext} from '../../ThemeContext';

import {weiToKAI} from '../../services/transaction/amount';
import {
  getAllValidator,
  getValidatorCommissionRate,
} from '../../services/staking';
import {useRecoilValue} from 'recoil';
import {getLanguageString, parseError} from '../../utils/lang';
import {languageAtom} from '../../atoms/language';
import TextAvatar from '../../components/TextAvatar';
import DelegateDetailModal from '../common/DelegateDetailModal';
import CustomText from '../../components/Text';
import { getLatestBlock } from '../../services/blockchain';
import { formatNumberString, getDigit, parseDecimals } from '../../utils/number';
import { BLOCK_TIME } from '../../config';
import { useNavigation } from '@react-navigation/native';
import UndelegateModal from '../common/UndelegateModal';
import Divider from '../../components/Divider';
import { Text } from 'react-native';
import { theme } from '../../theme/light';
import { claimFadoReward } from '../../services/fadostaking';
import { getSelectedWallet, getWallets } from '../../utils/local';
import { FADO_TOKEN_AVATAR } from '../../fado.config';

interface Prop {
stakerInfo : StakerInfo
}

const FadoStakingItem = ({stakerInfo}: Prop) => {
  const theme = useContext(ThemeContext);
  const navigation = useNavigation();
  const language = useRecoilValue(languageAtom);

  const [showFull, setShowFull] = useState(false);
  const [commissionRate, setCommissionRate] = useState(0);
  const [showUndelegateModal, setShowUndelegateModal] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [totalStakedAmount, setTotalStakedAmount] = useState(0);
  const [reward, setReward] = useState(0);
  
  const showButton = (value: any) => {
    return numeral(value).format('0,0.00') !== '0.00'
  }

  useEffect(() => {
    (async () => {
      try {
        setTotalStakedAmount(stakerInfo.stakedAmount);
        setReward(stakerInfo.reward);
        // const {totalStaked} = await getAllValidator();
        // setTotalStakedAmount(totalStaked);
        // setValidatorList(validators);
        // setLoading(false);
      } catch (error) {
        console.error(error);
        // setLoading(false);
      }
    })();
  }, []);

  const getSelectedStakedAmount = () => {
    const formatted = numeral(weiToKAI(stakerInfo.stakedAmount)).format(
      '0,0.00',
    );
    return formatted === 'NaN' ? '0 KAI' : `${formatted} KAI`;
  };

  if (showUndelegateModal) {
    return (
      <UndelegateModal
        visible={showUndelegateModal}
        onClose={() => {
          setShowUndelegateModal(false);
        }}
        onSuccess={() => {
          // setShowUndelegateModal(false);
        }}
        stakerInfo={stakerInfo}
      />
    );
  }

  const claimHandler = async () => {
    try {
      setClaiming(true);

      const wallets = await getWallets();
      const selectedWallet = await getSelectedWallet();

      const rs = await claimFadoReward(wallets[selectedWallet]);

      setClaiming(false);
      navigation.navigate('Transaction', {
        screen: 'SuccessTx',
        params: {
          type: 'claim',
          txHash: rs,
         
          claimAmount: weiToKAI(stakerInfo.reward),
        },
      });
     
    } catch (err) {
      console.error(err);
      setClaiming(false);
      if (err.message) {
        Alert.alert(parseError(err.message, language));
      } else {
        Alert.alert(getLanguageString(language, 'GENERAL_ERROR'));
      }
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 30,
        marginVertical: 2,
        backgroundColor: theme.primary,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

      {/* <DelegateDetailModal
        validatorItem={{...item, ...{commissionRate}}}
        visible={showFull}
        onClose={() => setShowFull(false)}
      /> */}

      <View       
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}>
          <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {/* <TextAvatar
            text={'FADO'}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              marginRight: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            textStyle={{fontSize: 16}}
          /> */}
          <View style={{
            width: 40,
            height: 40,

            borderRadius: 20,
            backgroundColor: 'white',

            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',

            borderWidth: 1,
            borderColor: theme.red700,
            marginRight: 10
          }}> 
            <Image source={{uri: FADO_TOKEN_AVATAR}} style={styles.tokenLogo} />
          </View>
         

          <View>
            <CustomText style={[styles.validatorName, {color: theme.white}]}>
            {stakerInfo?.name ? stakerInfo.name : 'Fado'}
            </CustomText>
          </View>
          </View>

        <View style={{alignItems: 'flex-end', justifyContent: 'space-between'}}>
          <View style={{justifyContent: 'center'}}>
            <CustomText
              allowFontScaling={false}
              style={{
                fontWeight: 'bold',
                color: theme.white,
                fontSize: theme.defaultFontSize + 4,
              
              }}>
                <CustomText style={{
                
                color: theme.white,
                fontSize: theme.defaultFontSize + 2 ,
              
              }}> {getLanguageString(language, 'INTEREST')}:</CustomText> {Number(parseDecimals(reward, 18)).toFixed(4)}
            </CustomText>
          </View>

          <View style={{justifyContent: 'center'}}>
            <CustomText
              allowFontScaling={false}
              style={{
                color: theme.white,
                fontSize: theme.defaultFontSize + 4,
                fontWeight: 'bold',
              }}>
                <CustomText style={{
              
                color: theme.white,
                fontSize: theme.defaultFontSize + 2,
              
              }}>{getLanguageString(language, 'FADOSTAKED')}:</CustomText> {parseDecimals(totalStakedAmount, 18)}
            </CustomText>
          </View>


        </View>
      </View>

      <Divider style={{width: '100%', backgroundColor: theme.white , opacity: 0.3}} />
      
      <View style= {{flexDirection: 'row' , width: '100%', justifyContent:'flex-end'}}>
        
      {showButton(totalStakedAmount) && (
                <View style={[styles.dataContainer, {justifyContent: 'center'}]}>
                  <TouchableOpacity onPress={() => setShowUndelegateModal(true)}>
                    <CustomText style={[{color: theme.black}]}>
                  {getLanguageString(language, 'WITHDRAW')}
                    </CustomText>
                  </TouchableOpacity>
                </View>
              )}      
              
       {showButton(totalStakedAmount) && (
                <View style={[styles.dataContainer, {justifyContent: 'center'}]}>
                  <TouchableOpacity onPress={claimHandler}>
                    <CustomText style={[{color: theme.black}]}>
                  {getLanguageString(language, 'CLAIM')}
                    </CustomText>
                  </TouchableOpacity>
                </View>
              )}    
      </View>
        
    </View>
  );
};

export default FadoStakingItem;

const styles = StyleSheet.create({
  dataContainer:{
  marginStart: 20,
  borderRadius: 6,
  backgroundColor: theme.yellow500,
  padding: 6,
  paddingHorizontal: 18
  },
  validatorName:{
    fontSize: 16,
    fontWeight: '600',
    // marginBottom: 18,
  },
  tokenLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
})
