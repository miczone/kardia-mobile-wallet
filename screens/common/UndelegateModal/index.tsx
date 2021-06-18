import { useNavigation } from '@react-navigation/core';
import React, { useContext, useEffect, useState } from 'react';
import { Keyboard, Platform, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useRecoilValue } from 'recoil';
import { languageAtom } from '../../../atoms/language';
import Button from '../../../components/Button';
import Divider from '../../../components/Divider';
import Modal from '../../../components/Modal';
import CustomTextInput from '../../../components/TextInput';
import numeral from 'numeral';
import { MIN_DELEGATE } from '../../../config';
import { undelegateAll, undelegateWithAmount } from '../../../services/staking';
import { weiToKAI } from '../../../services/transaction/amount';
import { ThemeContext } from '../../../ThemeContext';
import { getLanguageString } from '../../../utils/lang';
import { getSelectedWallet, getWallets } from '../../../utils/local';
import { format, formatNumberString, getDigit, isNumber, parseDecimals } from '../../../utils/number';
import CustomText from '../../../components/Text';
import { withDrawAll } from '../../../services/fadostaking';

export default ({visible, onClose, stakerInfo, onSuccess}: {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  stakerInfo?: StakerInfo
}) => {
  const navigation = useNavigation();
  // const stakedAmountInKAI = weiToKAI(validatorItem.stakedAmount);

  const theme = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);
  const [undelegateAmount, setUndelegateAmount] = useState(0);
  const [undelegateError, setUndelegateError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [keyboardShown, setKeyboardShown] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {  
    (async () => {
      const wallets = await getWallets();
      const selectedWallet = await getSelectedWallet();
      try {
        if(wallets !== undefined && wallets[selectedWallet].address !== ''){
          if(stakerInfo !== undefined){
            const _undelegateAmount = parseDecimals(stakerInfo.reward + stakerInfo.stakedAmount , 18);

            const convertAmountToNumb = Number(Number(_undelegateAmount).toFixed(4));
            
            setUndelegateAmount(convertAmountToNumb);
          }
          

        }
        
        // setValidatorList(validators);
        // setLoading(false);
      } catch (error) {
        console.error(error);
        // setLoading(false);
      }
    })();
  }, []);

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

  const handleClose = () => {
    if (submitting) {
      return;
    }
    onClose();
  }
   
  const handleUndelegate = async () => {
    try {
      setSubmitting(true);
      // const _undelegateValue = Number(getDigit(undelegateAmount));

      // console.log({_undelegateValue});
      
      // if (Number(stakedAmountInKAI) < _undelegateValue) {
      //   setUndelegateError(
      //     getLanguageString(language, 'UNDELEGATE_AMOUNT_TOO_MUCH'),
      //   );
      //   setSubmitting(false);
      //   return;
      // }
      // if (
      //   Number(stakedAmountInKAI) - _undelegateValue < MIN_DELEGATE &&
      //   Number(stakedAmountInKAI) - _undelegateValue > 0
      // ) {
      //   setUndelegateError(
      //     getLanguageString(language, 'UNDELEGATE_AMOUNT_REMAIN_1000'),
      //   );
      //   setSubmitting(false);
      //   return;
      // }

      const localWallets = await getWallets();
      const localSelectedWallet = await getSelectedWallet();
      const _wallet = localWallets[localSelectedWallet];

      let rs

      rs = await withDrawAll(localWallets[localSelectedWallet], 50);
      // if (Number(stakedAmountInKAI) - _undelegateValue > MIN_DELEGATE) {
      //   rs = await undelegateWithAmount(validatorItem.value, _undelegateValue, _wallet);
      // } else {
      //   rs = await undelegateAll(validatorItem.value, _wallet);
      // }
      setSubmitting(false);
      // setUndelegateAmount('');
      navigation.navigate('Transaction', {
        screen: 'SuccessTx',
        params: {
          type: 'undelegate',
          txHash: rs,
          
          undelegateAmount: undelegateAmount,
        },
      });
      onSuccess();
    } catch (err) {
      setSubmitting(false);
      console.error(err);
      setUndelegateError(getLanguageString(language, 'GENERAL_ERROR'));
    }
  }

  const getModalStyle = () => {
    if (Platform.OS === 'android') {
      return {
        height: 340,
        backgroundColor: theme.modalBgColor,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 0,
      };
    } else {
      return {
        height: 320,
        justifyContent: 'flex-start',
        backgroundColor: theme.modalBgColor,
        alignItems: 'center',
        marginBottom: keyboardOffset,
        marginTop: -keyboardOffset,
        padding: 0,
      };
    }
  };

  return (
    <Modal showCloseButton={false} visible={visible} onClose={handleClose} contentStyle={getModalStyle()}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1, width: '100%', padding: 35}}>
          <View style={{width: '100%'}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
              <CustomText style={{fontSize: theme.defaultFontSize + 1, color: theme.textColor}} allowFontScaling={false}>
                {getLanguageString(
                  language,
                  'UNDELEGATE_AMOUNT_PLACEHOLDER',
                )}
              </CustomText>

              <View >
                <CustomText style={{fontSize: theme.defaultFontSize + 1, color: theme.urlColor}} allowFontScaling={false}>
                  {/* {formatNumberString(stakedAmountInKAI, 6)} KAI */}
                  {undelegateAmount} FADO
                </CustomText>
              </View>
            </View>

            {/* <CustomTextInput
              keyboardType="numeric"
              message={undelegateError}
              inputStyle={{
                backgroundColor: theme.inputBgColor,
                borderColor: theme.inputBorderColor,
                color: theme.textColor,
              }}
              onChangeText={(newAmount) => {
                const digitOnly = getDigit(newAmount);
                if (Number(digitOnly) > Number(0)) {
                  return;
                }
                if (digitOnly === '') {
                  setUndelegateAmount('0');
                  return;
                }
                if (isNumber(digitOnly)) {
                  let formatedValue = format((Number(digitOnly)));
                  if (newAmount[newAmount.length - 1] === '.') formatedValue += '.'
                  setUndelegateAmount(formatedValue);
                }
                // isNumber(digitOnly) && setUndelegateAmount(digitOnly);
              }}
              onBlur={() => {
                setUndelegateAmount(format(Number(getDigit(undelegateAmount))));
              }}
              value={undelegateAmount}
              autoFocus={true}
              // headline={getLanguageString(
              //   language,
              //   'UNDELEGATE_AMOUNT_PLACEHOLDER',
              // )}
            /> */}
          </View>

          <Divider style={{width: '100%', backgroundColor: theme.gray400}} />

          <Button
            disabled={submitting}
            title={getLanguageString(language, 'CANCEL')}
            onPress={handleClose}
            type="outline"
            style={{width: '100%', marginTop: 14}}
          />

          <Button
            loading={submitting}
            disabled={submitting}
            title={getLanguageString(language, 'UNDELEGATE')}
            onPress={handleUndelegate}
            style={{marginTop: 8}}
            textStyle={{
              fontWeight: '500',
              fontSize: theme.defaultFontSize + 3,
              fontFamily: Platform.OS === 'android' ? 'WorkSans-SemiBold' : undefined
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};