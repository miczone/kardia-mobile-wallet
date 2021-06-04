/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Dimensions, Image, ImageBackground, Linking, Platform, RefreshControl, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './style';
import HomeHeader from './Header';
import QRModal from '../common/AddressQRCode';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {selectedWalletAtom, walletsAtom} from '../../atoms/wallets';
import {
  getAppPasscodeSetting,
  getSelectedWallet,
  getWallets,
} from '../../utils/local';
import {ThemeContext} from '../../ThemeContext';
import {getBalance} from '../../services/account';
import CardSliderSection from './CardSliderSection';
import {languageAtom} from '../../atoms/language';
import numeral from 'numeral';
import {getLanguageString} from '../../utils/lang';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
// import RemindPasscodeModal from '../common/RemindPasscodeModal';
import {getStakingAmount, getUndelegatingAmount} from '../../services/staking';
import TokenListSection from './TokenListSection';
import {showTabBarAtom} from '../../atoms/showTabBar';
import {tokenInfoAtom} from '../../atoms/token';
import {weiToKAI} from '../../services/transaction/amount';
import Button from '../../components/Button';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { HEADER_HEIGHT } from '../../theme';
import CustomText from '../../components/Text';
import { SIMPLEX_URL } from '../../services/config';
import { TouchableOpacity } from 'react-native-gesture-handler';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window')

const HomeScreen = () => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [showPasscodeRemindModal, setShowPasscodeRemindModal] = useState(false);
  const [inited, setInited] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTime, setRefreshTime] = useState(Date.now())

  const [wallets, setWallets] = useRecoilState(walletsAtom);
  
  const [selectedWallet, setSelectedWallet] = useRecoilState(
    selectedWalletAtom,
  );

  const setTabBarVisible = useSetRecoilState(showTabBarAtom);
  const tabBarHeight = useBottomTabBarHeight();
  const tokenInfo = useRecoilValue(tokenInfoAtom);
  const theme = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {

      // Get local auth setting
      const enabled = await getAppPasscodeSetting();
      if (!enabled) {
        setShowPasscodeRemindModal(true);
      } else {
        setShowPasscodeRemindModal(false);
      }
      setInited(true);
    })();
  }, []);

  const updateWalletBalance = async (newSelectedWallet?: number) => {
    const _wallets = await getWallets();
    const _selectedWallet =
      newSelectedWallet !== undefined
        ? newSelectedWallet
        : await getSelectedWallet();
    if (!_wallets[_selectedWallet]) {
      return;
    }
    try {
      const balance = await getBalance(_wallets[_selectedWallet].address);
      const staked = await getStakingAmount(_wallets[_selectedWallet].address);
      const undelegating = await getUndelegatingAmount(_wallets[_selectedWallet].address);

      const newWallets: Wallet[] = JSON.parse(JSON.stringify(_wallets));
      newWallets.forEach((walletItem, index) => {
        if (walletItem.address === _wallets[_selectedWallet].address) {
          newWallets[index].balance = balance;
          newWallets[index].staked = staked;
          newWallets[index].undelegating = undelegating;
        }
      });
      setWallets(newWallets);
      // saveWallets(newWallets);
      _selectedWallet !== selectedWallet && setSelectedWallet(_selectedWallet);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      updateWalletBalance();

      {/* BOTTOM TAB BAR NÈ */}
      setTabBarVisible(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    if (!inited) {
      return;
    }
    updateWalletBalance(selectedWallet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWallet]);

  if (!inited) {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: theme.backgroundColor}}>
        <ActivityIndicator color={theme.textColor} size="large" />
      </SafeAreaView>
    );
  }

  if (showPasscodeRemindModal) {
    setShowPasscodeRemindModal(false);
    // navigation.navigate('NewPasscode');
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Setting',
          state: {
            routes: [{name: 'NewPasscode', params: {fromHome: true}}],
          },
        },
      ],
    });
  }

  const _getBalance = () => {
    if (!wallets[selectedWallet]) return 0;
    return wallets[selectedWallet].balance;
  }

  const onRefresh = async () => {
    setRefreshing(true)
    setRefreshTime(Date.now())
    await updateWalletBalance();
    setRefreshing(false)
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.backgroundColor}}>
      <HomeHeader />
      <QRModal visible={showQRModal} onClose={() => setShowQRModal(false)} />
      
      <ImageBackground
        source={require('../../assets/home_background_light.jpg')}
        imageStyle={{width: viewportWidth, height: viewportHeight, resizeMode: 'cover'}}
        style={{width: viewportWidth, height: viewportHeight - tabBarHeight - HEADER_HEIGHT - 48}}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          style={[styles.bodyContainer]} 
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.textColor]}
              tintColor={theme.textColor}
              titleColor={theme.textColor}
            />
          }
        >
          {/* Thông tin của ví ở homescreen */}
          <CardSliderSection showQRModal={() => setShowQRModal(true)} />

          <TokenListSection refreshTime={refreshTime} />

          <TouchableOpacity
          onPress={() => {navigation.navigate('TransactionList')}}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 12,
              backgroundColor: theme.gray200,
              borderRadius: 12,
              marginHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    
        
                    borderRadius: 20,
                    backgroundColor: 'white',
        
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
        
                    borderWidth: 1,
                    borderColor: theme.gray400,
                    marginLeft: 1,
                    marginRight: 10,
                  }}
                >
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                    }}
                    source={require('../../assets/logo.png')}
                  />
                </View>
              
              <View>
                <CustomText style={{color: theme.textColor, fontSize: 18, marginBottom: 4, fontWeight: 'bold'}}>
                  {
                    numeral(Number(weiToKAI(_getBalance()))).format('0,0.00')}{' '}
                  <CustomText style={{color: theme.gray600, fontWeight: '500'}}>KAI</CustomText>
                </CustomText>
                <CustomText style={{color:theme.gray600, fontSize: 14, fontWeight: '500'}}>
                  $
                  {numeral(
                    tokenInfo.price *
                      Number(weiToKAI(_getBalance())),
                  ).format('0,0.00')}
                </CustomText>
              </View>
              
            </View>
            <Button
              title={getLanguageString(language, 'BUY_KAI')}
              // onPress={() => Alert.alert('Coming soon')}
              onPress={() => Linking.openURL(SIMPLEX_URL)}
              type="ghost"
              size="small"
              textStyle={Platform.OS === 'android' ? {color: '#000000', fontFamily: 'WorkSans-SemiBold'} : {color: '#000000', fontWeight: '500'}}
              style={{paddingHorizontal: 16, paddingVertical: 8, backgroundColor: theme.gray300}}
            />
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default HomeScreen;
