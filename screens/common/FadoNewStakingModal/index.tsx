/* eslint-disable react-native/no-inline-styles */
import React, {FC, useContext, useEffect, useState} from 'react';
import {Keyboard, Platform, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
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

import {weiToKAI} from '../../../services/transaction/amount';
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

interface thisModalProp {
visible : boolean ,
onClose : () => void,
}

const FadoNewStakingModal = ({visible , onClose} : thisModalProp) => {

    //Reset Func, clear all current stake 
    const resetState = () => {
        return ;
    }
    // end **resetState** 


  return (
    <Modal
      visible={visible}
      showCloseButton={false}
      onClose={() => {
        resetState();
        onClose();
      }}
      >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1, width: '100%'}}>
         <Text>Fado Stake Modal</Text>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default FadoNewStakingModal;
