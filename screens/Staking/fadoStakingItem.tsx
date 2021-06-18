/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import numeral from 'numeral';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {ThemeContext} from '../../ThemeContext';

import {weiToKAI} from '../../services/transaction/amount';
import {
  getAllValidator,
  getValidatorCommissionRate,
} from '../../services/staking';
import {useRecoilValue} from 'recoil';
import {getLanguageString} from '../../utils/lang';
import {languageAtom} from '../../atoms/language';
import TextAvatar from '../../components/TextAvatar';
import DelegateDetailModal from '../common/DelegateDetailModal';
import CustomText from '../../components/Text';
import { getLatestBlock } from '../../services/blockchain';
import { formatNumberString, getDigit, parseDecimals } from '../../utils/number';
import { BLOCK_TIME } from '../../config';
import { useNavigation } from '@react-navigation/native';
import UndelegateModal from '../common/UndelegateModal';

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

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginVertical: 2,
        backgroundColor: theme.gray100,
        borderRadius: 7,
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
          <TextAvatar
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
          />

          <View>
            <CustomText style={[styles.validatorName, {color: theme.textColor}]}>
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
                color: theme.textColor,
                fontSize: theme.defaultFontSize + 1,
              }}>

            {parseDecimals(reward, 18)}
            </CustomText>
          </View>

          <View style={{justifyContent: 'center'}}>
            <CustomText
              allowFontScaling={false}
              style={{
                color: theme.gray500,
                fontSize: theme.defaultFontSize,
              }}>
            {parseDecimals(totalStakedAmount, 18)}
            </CustomText>
          </View>

          {showButton(totalStakedAmount) && (
              <View style={[styles.dataContainer, {justifyContent: 'center'}]}>
                <TouchableOpacity onPress={() => setShowUndelegateModal(true)}>
                  <CustomText style={[{color: theme.urlColor}]}>
                {getLanguageString(language, 'UNDELEGATE')}
                  </CustomText>
                </TouchableOpacity>
              </View>
        )}
        
        </View>
      </View>
    </View>
  );
};

export default FadoStakingItem;

const styles = StyleSheet.create({
  dataContainer:{
  
  },

  validatorName:{
    fontSize: 15,
    fontWeight: 'bold',
    // marginBottom: 18,
  }
})
