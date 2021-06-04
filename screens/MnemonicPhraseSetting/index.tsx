/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { ThemeContext } from '../../ThemeContext';
import List from '../../components/List';
import ENIcon from 'react-native-vector-icons/Entypo';
import Button from '../../components/Button';
import { getMnemonic } from '../../utils/local';
import { styles } from './style';
import { copyToClipboard } from '../../utils/string';
import { getLanguageString } from '../../utils/lang';
import { useRecoilValue } from 'recoil';
import { languageAtom } from '../../atoms/language';
import { selectedWalletAtom, walletsAtom } from '../../atoms/wallets';
import { useNavigation, useRoute } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomText from '../../components/Text';
import Toast from 'react-native-toast-message';

const MnemonicPhraseSetting = () => {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  const [mnemonic, setMnemonic] = useState('');
  const language = useRecoilValue(languageAtom);
  // const wallets = useRecoilValue(walletsAtom);
  // const selectedWallet = useRecoilValue(selectedWalletAtom);

  const {params} = useRoute();
  const wallet: Wallet = params ? (params as any).wallet : undefined

  const privateKey = wallet && wallet.privateKey ? wallet.privateKey : '';

  useEffect(() => {
    (async () => {
      if (!wallet || !wallet.address) {
        return;
      }
      const mn = await getMnemonic(wallet.address);
      if (mn !== 'FROM_PK') {
        setMnemonic(mn);
      }
    })();
  }, [wallet]);

  let mnemonicArr: { label: string; value: string }[] = [];

  if (mnemonic) {
    mnemonicArr = mnemonic.split(' ').map((item) => ({
      label: item,
      value: item,
    }));
  } else {
    mnemonicArr = [
      {
        label: privateKey as any,
        value: privateKey as any,
      },
    ];
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View
        style={{
          width: '100%',
          marginBottom: 19,
        }}>
        <ENIcon.Button
          name="chevron-left"
          onPress={() => navigation.goBack()}
          backgroundColor="transparent"
          color={theme.backBtnTextColor}
          underlayColor={theme.backBtnUnderlayColor}
          style={{ padding: 0, marginBottom: 18 }}
        />
      </View>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <CustomText style={{ fontSize: 24, textAlign: 'center', fontWeight: 'bold', color: theme.textColor }} allowFontScaling={false}>{getLanguageString(language, 'SEED_PHRASE_TITLE')}</CustomText>
          <CustomText style={{ color: theme.mutedTextColor, marginTop: 4, textAlign: 'center' }} allowFontScaling={false}>{getLanguageString(language, 'SEED_PHRASE_DESC')}</CustomText>
          <List
            items={mnemonicArr}
            numColumns={4}
            containerStyle={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingVertical: 20,
            }}
            listStyle={{
              maxHeight: mnemonic ? 200 : 100,
            }}
            render={(item, index) => {
              return (
                <View
                  key={index}
                  style={[
                    styles.phraseItemContainer,
                    { backgroundColor: theme.backgroundFocusColor },
                  ]}>
                  <CustomText
                    style={[styles.phraseItemText, { color: theme.textColor }]}>
                    {item.label}
                  </CustomText>
                </View>
              );
            }}
          />
          <QRCode
            size={200}
            value={mnemonic || privateKey}
            color={theme.textColor}
            backgroundColor={theme.backgroundColor}
          />
        </View>
        <Button
          title={getLanguageString(language, 'COPY_TO_CLIPBOARD')}
          type="primary"
          block
          onPress={() => {
            copyToClipboard(mnemonic ? mnemonic : privateKey)
            Toast.show({
              type: 'success',
              topOffset: 70,
              text1: getLanguageString(language, 'COPIED'),
              props: {
                backgroundColor: theme.backgroundFocusColor,
                textColor: theme.textColor
              }
            });
          }}
          style={{marginBottom: 52}}
          textStyle={{
            fontWeight: '500',
            fontSize: theme.defaultFontSize + 3,
            fontFamily: Platform.OS === 'android' ? 'WorkSans-SemiBold' : undefined
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default MnemonicPhraseSetting;
