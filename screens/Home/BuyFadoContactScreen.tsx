import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';

import {Button, Input, Text} from 'react-native-elements';
import {useRecoilValue} from 'recoil';
import {languageAtom} from '../../atoms/language';
import {getLanguageString} from '../../utils/lang';
import {formatNumberString, getDigit, isNumber} from '../../utils/number';

import {theme} from '../../theme/light';

import {useNavigation} from '@react-navigation/native';

var EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const BuyFadoContactScreen = () => {
  interface FormData {
    fullname: string;
    phone: string;
    email: string;
    tokenAmount: string;
  }

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>();
  const navigation = useNavigation();
  const language = useRecoilValue(languageAtom);

  const [amount, setAmount] = useState('0');

  const onSubmit = (data: any) => {
    console.log(data);
    navigation.navigate('SubmitSucess');
  };
  return (
    <View style={styles.container}>
      <View style={styles.alertContainer}>
        <Text style={styles.supportMessage}>
          {getLanguageString(language, 'SUPPORT_MESSAGE')}
        </Text>
      </View>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            label={getLanguageString(language, 'FULL_NAME')}
            placeholder={getLanguageString(language, 'FULL_NAME')}
            errorMessage={errors.fullname?.message}
            style={styles.input}
            labelStyle={styles.inputLabel}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="fullname"
        defaultValue=""
        rules={{
          required: {
            value: true,
            message: 'Fullname is required',
          },
        }}
      />

      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            label={getLanguageString(language, 'PHONE')}
            placeholder={getLanguageString(language, 'PHONE')}
            errorMessage={errors.phone?.message}
            style={styles.input}
            labelStyle={styles.inputLabel}
            keyboardType="number-pad"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="phone"
        defaultValue=""
        rules={{
          required: {
            value: true,
            message: 'Phone is required',
          },
          minLength: {
            value: 10,
            message: 'Phone is 10 number digit',
          },
          maxLength: {
            value: 10,
            message: 'Phone is 10 number digit',
          },
        }}
      />

      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            label={getLanguageString(language, 'EMAIL')}
            placeholder={getLanguageString(language, 'EMAIL')}
            errorMessage={errors.email?.message}
            style={styles.input}
            labelStyle={styles.inputLabel}
            keyboardType="email-address"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="email"
        defaultValue=""
        rules={{
          required: {
            value: true,
            message: 'Email is required',
          },
          pattern: {
            value: EMAIL_REGEX,
            message: 'Invalid email',
          },
        }}
      />

      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            label={getLanguageString(language, 'TRANSACTION_AMOUNT')}
            placeholder={getLanguageString(language, 'TRANSACTION_AMOUNT')}
            style={styles.input}
            labelStyle={styles.inputLabel}
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

                const [numParts, decimalParts] = digitOnly.split('.');
                if (!decimalParts && decimalParts !== '') {
                  setAmount(formatedValue);
                  onChange(formatedValue);
                  return;
                }

                formatedValue =
                  formatNumberString(numParts) + '.' + decimalParts;

                setAmount(formatedValue);
                onChange(formatedValue);
              }
            }}
            onBlur={() => setAmount(formatNumberString(getDigit(amount)))}
          />
        )}
        name="tokenAmount"
        defaultValue={amount}
      />

      <Button
        title={getLanguageString(language, 'SUBMIT')}
        buttonStyle={styles.submitBtn}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: theme.white,
  },
  alertContainer: {
    backgroundColor: theme.yellow200,
    marginVertical: 16,
    padding: 4
  },
  supportMessage: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 6,
    color: theme.yellow800,
  },
  submitBtn: {
    backgroundColor: theme.primary,
    borderRadius: 8,
  },
  input: {
    fontSize: 14,
  },
  inputLabel: {
    fontSize: 14,
  },
});

export default BuyFadoContactScreen;
