/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {Text, View} from 'react-native';
import OtpInputs from 'react-native-otp-inputs';
import {useRecoilValue} from 'recoil';
import {languageAtom} from '../../atoms/language';
import Button from '../../components/Button';
import ENIcon from 'react-native-vector-icons/Entypo';
import {ThemeContext} from '../../ThemeContext';
import {getLanguageString} from '../../utils/lang';
import {styles} from './style';
import {useNavigation} from '@react-navigation/core';
import CustomText from '../../components/Text';

const Step1 = ({onSubmit}: {onSubmit: (passcode: string) => void}) => {
  const navigation = useNavigation();
  const language = useRecoilValue(languageAtom);
  const theme = useContext(ThemeContext);
  const [passcode, setPasscode] = useState('');
  return (
    <>
      <View
        style={{
          // flexDirection: 'row',
          width: '100%',
          // justifyContent: 'flex-start',
          marginBottom: 114,
        }}>
        <ENIcon.Button
          name="chevron-left"
          onPress={() => navigation.goBack()}
          backgroundColor="transparent"
          color={theme.backBtnTextColor}
          underlayColor={theme.backBtnUnderlayColor}
          style={{padding: 0, marginBottom: 18}}
        />
        <CustomText style={{color: theme.textColor, fontSize: 36}}>
          {getLanguageString(language, 'SET_NEW_PIN')}
        </CustomText>
      </View>
      <View style={{flex: 1, width: '100%'}}>
        <CustomText style={[styles.title, {color: theme.textColor}]}>
          {getLanguageString(language, 'NEW_PASSCODE')}
        </CustomText>
        <View style={{marginBottom: 40, width: '100%'}}>
          <OtpInputs
            // TODO: remove ts-ignore after issue fixed
            // @ts-ignore
            keyboardType="decimal-pad"
            handleChange={setPasscode}
            numberOfInputs={4}
            autofillFromClipboard={false}
            style={styles.otpContainer}
            inputStyles={{
              ...styles.otpInput,
              ...{
                backgroundColor: theme.backgroundFocusColor,
                color: theme.textColor,
              },
            }}
            secureTextEntry={true}
          />
        </View>
      </View>
      <Button
        title={getLanguageString(language, 'SAVE')}
        style={{marginHorizontal: 20, marginBottom: 24}}
        onPress={() => onSubmit && onSubmit(passcode)}
      />
    </>
  );
};

export default Step1;
