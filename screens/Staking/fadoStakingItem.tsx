/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import numeral from 'numeral';
import {TouchableOpacity, View} from 'react-native';
import {ThemeContext} from '../../ThemeContext';
import {styles} from './style';
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
import { formatNumberString, getDigit } from '../../utils/number';
import { BLOCK_TIME } from '../../config';

const FadoStakingItem = ({
  stakerInfo,
 
}: {
  stakerInfo?: any,
}) => {
  const theme = useContext(ThemeContext);

  const [showFull, setShowFull] = useState(false);
  const [commissionRate, setCommissionRate] = useState(0);

  const [totalStakedAmount, setTotalStakedAmount] = useState(0);
  const [reward, setReward] = useState(0);

  const language = useRecoilValue(languageAtom);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       // const {totalStaked} = await getAllValidator();
  //       // setTotalStakedAmount(totalStaked);
  //       // setValidatorList(validators);
  //       // setLoading(false);
  //     } catch (error) {
  //       console.error(error);
  //       // setLoading(false);
  //     }
  //   })();
  // }, []);

  // const getSelectedStakedAmount = () => {
  //   const formatted = numeral(weiToKAI(stakerInfo.stakedAmount)).format(
  //     '0,0.00',
  //   );
  //   return formatted === 'NaN' ? '0 KAI' : `${formatted} KAI`;
  // };

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
            {stakerInfo.name}
            </CustomText>
          </View>
          </View>

        <View style={{alignItems: 'flex-end', justifyContent: 'space-between'}}>
          {/* <View style={{justifyContent: 'center'}}>
            <CustomText
              allowFontScaling={false}
              style={{
                fontWeight: 'bold',
                color: theme.textColor,
                fontSize: theme.defaultFontSize + 1,
              }}>

            {reward}
            </CustomText>
          </View>

          <View style={{justifyContent: 'center'}}>
            <CustomText
              allowFontScaling={false}
              style={{
                color: theme.gray500,
                fontSize: theme.defaultFontSize,
              }}>
            {totalStakedAmount}
            </CustomText>
          </View> */}
        </View>
      </View>
    </View>
  );
};

export default FadoStakingItem;
