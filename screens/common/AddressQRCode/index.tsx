/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {Dimensions, Image, ImageBackground, Platform, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-toast-message';
import QRCode from 'react-native-qrcode-svg';
import {useRecoilValue} from 'recoil';
import {languageAtom} from '../../../atoms/language';
import { tokenInfoAtom } from '../../../atoms/token';
import {selectedWalletAtom, walletsAtom} from '../../../atoms/wallets';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import { weiToKAI } from '../../../services/transaction/amount';
import {ThemeContext} from '../../../ThemeContext';
import {getLanguageString} from '../../../utils/lang';
import {copyToClipboard, truncate} from '../../../utils/string';
import numeral from 'numeral'
import CustomText from '../../../components/Text';

const {width: viewportWidth} = Dimensions.get('window');

const QRModal = ({
  onClose,
  visible,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const wallets = useRecoilValue(walletsAtom);
  const selectedWallet = useRecoilValue(selectedWalletAtom);
  const language = useRecoilValue(languageAtom);
  const tokenInfo = useRecoilValue(tokenInfoAtom);

  const theme = useContext(ThemeContext);

  const wallet = wallets[selectedWallet];

  return (
    <Modal
      visible={visible}
      showCloseButton={false}
      contentStyle={{
        paddingHorizontal: 20,
        backgroundColor: theme.gray400,
        height: 730,
      }}
      onClose={onClose}>
      <View
        style={{
          padding: 32,
          backgroundColor: theme.backgroundColor,
          borderRadius: 12,
        }}>
        <QRCode
          size={viewportWidth - 104}
          value={wallets[selectedWallet] ? wallets[selectedWallet].address : ''}
          color={theme.textColor}
          backgroundColor={theme.backgroundColor}
        />
      </View>
      <View style={{flexDirection: 'row', paddingVertical: 0, paddingHorizontal: 20, alignItems: 'center'}}>
        <Image source={require('../../../assets/icon/warning.png')} style={{width: 20, height: 20, marginRight: 8}} />
        <CustomText
          style={{
            fontWeight: '500',
            fontSize: 13,            
            color: theme.yellow700,
            textAlign: 'left',
            width: '100%',
          }}>
          {getLanguageString(language, 'ERC20_WARNING')}
        </CustomText>
      </View>
      <ImageBackground
        source={require('../../../assets/address_qr_balance_background.png')}
        imageStyle={{
          resizeMode: 'cover',
          // width: '100%',
          height: 139,
          borderRadius: 12,
          // marginHorizontal: 18,
        }}
        style={{
          width: '100%',
          height: 139,
          borderRadius: 12,
          alignItems: 'flex-start',
          justifyContent: 'center',
          // paddingHorizontal: 18,
        }}
      >
        <CustomText style={{color: 'rgba(252, 252, 252, 0.54)', fontSize: 10, marginBottom: 4, textAlign: 'left', paddingHorizontal: 20}}>
          {getLanguageString(language, 'BALANCE').toUpperCase()}
        </CustomText>
        <CustomText style={{fontSize: 24, color: theme.black, paddingHorizontal: 20}}>
          $
          {numeral(
            tokenInfo.price *
              (Number(weiToKAI(wallet.balance)) + wallet.staked),
          ).format('0,0.00')}
        </CustomText>
        <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20}}>
          <CustomText style={{
              color: theme.black,
              fontSize: 16,
              marginRight: 8,
            }}>
            {truncate(
              wallet.address,
              viewportWidth >= 432 ? 14 : 10,
              viewportWidth >= 432 ? 14 : 12,
            )}
          </CustomText>
          <TouchableOpacity
            onPress={() => {
              copyToClipboard(
                wallets[selectedWallet] ? wallets[selectedWallet].address : '',
              )
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
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image source={require('../../../assets/icon/copy_dark.png')} style={{width: 20, height: 20}} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <Button
        title={getLanguageString(language, 'DONE')}
        onPress={onClose}
        block
        style={{marginTop: 32}}
        textStyle={{
          fontWeight: '500',
          fontSize: theme.defaultFontSize + 3,
          fontFamily: Platform.OS === 'android' ? 'WorkSans-SemiBold' : undefined
        }}
      />
    </Modal>
  );
};

export default QRModal;
