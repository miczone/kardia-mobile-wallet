/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, Image, AppState, Dimensions, Linking, Platform, ImageBackground} from 'react-native';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import {selectedWalletAtom, walletsAtom} from '../../atoms/wallets';
import TransactionStackScreen from '../../TransactionStack';
import {
  getAddressBook,
  getAppPasscodeSetting,
  getFontSize,
  getLanguageSetting,
  getSelectedWallet,
  getTokenList,
  getWallets,
  saveSelectedWallet,
  saveTokenList,
  saveWallets,
} from '../../utils/local';
import {styles} from './style';
import NoWalletStackScreen from '../../NoWalletStack';
import {createStackNavigator} from '@react-navigation/stack';
import Notification from '../Notification';
import {ThemeContext} from '../../ThemeContext';
import {getBalance} from '../../services/account';
import {tokenInfoAtom} from '../../atoms/token';
import {getTokenInfo} from '../../services/token';
import SettingStackScreen from '../../SettingStack';
import {addressBookAtom} from '../../atoms/addressBook';
import {languageAtom} from '../../atoms/language';
import {localAuthAtom, localAuthEnabledAtom} from '../../atoms/localAuth';
import ConfirmPasscode from '../ConfirmPasscode';
import StakingStackScreen from '../../StakingStack';
import {getLanguageString} from '../../utils/lang';
import Portal from '@burstware/react-native-portal';
import {filterByOwnerSelector, krc20ListAtom} from '../../atoms/krc20';
import HomeStackScreen from '../../HomeStack';
import AddressStackScreen from '../../AddressStack';
import {showTabBarAtom} from '../../atoms/showTabBar';
import CustomText from '../../components/Text';
import { fontSizeAtom } from '../../atoms/fontSize';
import { getAppStatus } from '../../services/util';
import { INFO_DATA } from '../Setting';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import KAIDex from '../KAIDex';
import { dexStatusAtom } from '../../atoms/dexStatus';
import { initDexConfig } from '../../services/dex';
import { getVerifiedTokenList } from '../../services/krc20';
import { FADO_TOKEN_ID } from '../../fado.config';
import { useForceUpdate } from '../../hooks/forceUpdate';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const {width: viewportWidth} = Dimensions.get('window')

let lastTimestamp = 0;

const Wrap = () => {
  const theme = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);

  const showTabBar = useRecoilValue(showTabBarAtom);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarLabel: ({focused, color, position}) => {
          if (route.name === 'Home') {
            return (
              <CustomText style={{fontSize: 10, color: focused ? theme.white : 'rgba(255,255,255,0.7)'}}>
                {getLanguageString(language, 'HOME')}
              </CustomText>
            )
          } else if (route.name === 'Transaction') {
            return (
              <CustomText style={{fontSize: 10, color: focused ? theme.white : 'rgba(255,255,255,0.7)'}}>
                {getLanguageString(language, 'TRANSACTIONS')}
              </CustomText>
            )
          } else if (route.name === 'Staking') {
            return (
              <CustomText style={{fontSize: 10, color: focused ? theme.white : 'rgba(255,255,255,0.7)'}}>
                {getLanguageString(language, 'STAKING')}
              </CustomText>
            )
          } else if (route.name === 'Address') {
            return (
              <CustomText style={{fontSize: 10, color: focused ? theme.white : 'rgba(255,255,255,0.7)'}}>
                {getLanguageString(language, 'ADDRESS_BOOK')}
              </CustomText>
            )
          } else if (route.name === 'Setting') {
            return (
              <CustomText style={{fontSize: 10, color: focused ? theme.white : 'rgba(255,255,255,0.7)'}}>
                {getLanguageString(language, 'SETTING')}
              </CustomText>
            )
          } else if (route.name === 'DEX') {
            return (
              <CustomText style={{fontSize: 10, color: focused ? theme.white : 'rgba(255,255,255,0.7)'}}>
                {getLanguageString(language, 'KAI_DEX')}
              </CustomText>
            )
          }
        },
        tabBarIcon: ({color, size, focused}) => {
          let iconName = '';

          if (route.name === 'Home') {
            return (
              <Image
                style={{width: 24, height: 24, marginTop: 12, marginBottom: 5}}
                source={
                  focused
                    ? require('../../assets/icon/home_dark.png')
                    : require('../../assets/icon/home_dark_inactive.png')
                }
              />
            );
          } else if (route.name === 'News') {
            iconName = 'newspaper-o';
          } else if (route.name === 'Transaction') {
            return (
              <Image
                style={{width: 24, height: 24, marginTop: 12, marginBottom: 5}}
                source={
                  focused
                    ? require('../../assets/icon/transaction_dark.png')
                    : require('../../assets/icon/transaction_dark_inactive.png')
                }
              />
            );
          } else if (route.name === 'DApp') {
            iconName = 'th-large';
          } else if (route.name === 'Setting') {
            return (
              <Image
                style={{width: 24, height: 24, marginTop: 12, marginBottom: 5}}
                source={
                  focused
                    ? require('../../assets/icon/setting_dark.png')
                    : require('../../assets/icon/setting_dark_inactive.png')
                }
              />
            );
          } else if (route.name === 'Staking') {
            return (
              <Image
                style={{width: 24, height: 24, marginTop: 12, marginBottom: 5}}
                source={
                  focused
                    ? require('../../assets/icon/staking_dark.png')
                    : require('../../assets/icon/staking_dark_inactive.png')
                }
              />
            );
          } else if (route.name === 'Address') {
            return (
              <Image
                style={{width: 24, height: 24, marginTop: 12, marginBottom: 5}}
                source={
                  focused
                    ? require('../../assets/icon/address_book_dark.png')
                    : require('../../assets/icon/address_book_dark_inactive.png')
                }
              />
            );
          } else if (route.name === 'DEX') {
            return (
              <Image
                style={{width: 24, height: 24, marginTop: 12, marginBottom: 5}}
                source={
                  focused
                    ? require('../../assets/icon/kai_dex_dark.png')
                    : require('../../assets/icon/kai_dex_dark_inactive.png')
                }
              />
            )
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarVisible: showTabBar,
      })}
      tabBarOptions={{
        activeTintColor: theme.white,
        inactiveTintColor: theme.white,
        inactiveBackgroundColor: theme.backgroundColor,
        activeBackgroundColor: theme.red600,
        keyboardHidesTabBar: true,
        tabStyle: {
          backgroundColor: theme.red600,
          borderTopColor: theme.backgroundFocusColor,
          paddingBottom: 4,
          elevation: 24,
        },
        labelStyle: {
          fontWeight: 'bold',
          marginBottom: 4,
        },
        style: {
          backgroundColor: theme.red600,
          borderTopColor: theme.red700,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 2,
          shadowRadius: 4,
        },

        // showLabel: false,
      }}>
      {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Transaction" component={TransactionStackScreen} />
      {/* <Tab.Screen name="DEX" component={KAIDex} /> */}
      <Tab.Screen name="Staking" component={StakingStackScreen} />
      <Tab.Screen name="Address" component={AddressStackScreen} />
      {/* <Tab.Screen name="News" component={NewsScreen} /> */}
      {/* <Tab.Screen name="Setting" component={SettingStackScreen} /> */}
    </Tab.Navigator>
  );
};

const AppContainer = () => {
  const [wallets, setWallets] = useRecoilState(walletsAtom);
  const setTokenInfo = useSetRecoilState(tokenInfoAtom);
  const setAddressBook = useSetRecoilState(addressBookAtom);
  const setKRC20TokenList = useSetRecoilState(krc20ListAtom);
  const setFontSize = useSetRecoilState(fontSizeAtom);
  const [selectedWallet, setSelectedWallet] = useRecoilState(
    selectedWalletAtom,
  );
  const [language, setLanguage] = useRecoilState(languageAtom);
  const [isLocalAuthed, setIsLocalAuthed] = useRecoilState(localAuthAtom);
  const [localAuthEnabled, setLocalAuthEnabled] = useRecoilState(
    localAuthEnabledAtom,
  );
  const [inited, setInited] = useState(0);
  const [appStatus, setAppStatus] = useState('OK')
  const forceUpdate = useForceUpdate();

  const setDexStatus = useSetRecoilState(dexStatusAtom)

  const theme = useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      if (!inited || appStatus !== 'OK') return;
      let _selectedWallet = await getSelectedWallet();
      if (_selectedWallet !== selectedWallet) {
        await saveSelectedWallet(selectedWallet);
      }
    })();
  }, [selectedWallet, inited]);

  useEffect(() => {
    (async () => {
      if (!inited || appStatus !== 'OK') return;
      await saveWallets(wallets);
    })();
  }, [wallets, inited]);

  const handleAppStateChange = useCallback(
    (state: string) => {
      if (state === 'background' || state === 'inactive') {
        // Store current time
        lastTimestamp = Date.now();
      } else if (state === 'active') {
        // Lock app if unfocused in 2 minute
        if (Date.now() - lastTimestamp > 2 * 60 * 1000) {
          setIsLocalAuthed(false);
        }
      }
    },
    [],
  );

  const compareVersion = (localVersion: string, serverVersion: string) => {
    const localArr = localVersion.split('.').map((i) => Number(i));
    const serverArr = serverVersion.split('.').map((i) => Number(i));
    if (serverArr[0] < localArr[0]) {
      return 'OK'
    }
    if (serverArr[0] > localArr[0]) {
      return 'NEED_UPDATE'
    }

    if (serverArr[1] < localArr[1]) {
      return 'OK'
    }
    if (serverArr[1] > localArr[1]) {
      return 'NEED_UPDATE'
    }

    if (serverArr[2] <= localArr[2]) {
      return 'OK'
    }
    return 'NEED_UPDATE'

  }

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inited]);

  useEffect(() => {
    (async () => {
      if (!wallets || !wallets[selectedWallet]) return

      const selectedWalletAddress = wallets[selectedWallet].address;
      const localTokenList = await getTokenList();
      const currentWalletTokenList = localTokenList.filter((item) => item.walletOwnerAddress === selectedWalletAddress);

      // Fix get fado token for use case remove all wallet in app
      if(currentWalletTokenList.length <= 0 ) {
        // Add fado token to local list
        const vertifiedTokenList = await getVerifiedTokenList();
        const newTokenList = vertifiedTokenList.filter((item, idx) => {
          if(item.id === FADO_TOKEN_ID) {
            vertifiedTokenList[idx].walletOwnerAddress = selectedWalletAddress;
            return item;
          }
        })
        await saveTokenList(newTokenList);
        setKRC20TokenList(newTokenList);

        forceUpdate();
      }

      const serverStatus = await getAppStatus(wallets[selectedWallet].address);
      try {
        // Init dex config
        await initDexConfig()
        setDexStatus(serverStatus.dexStatus)
      } catch (error) {
        setDexStatus('OFFLINE')
        console.error('Init Dex config fail');
        console.log(error)
      }
  
    })()
  }, [selectedWallet, wallets])

  useEffect(() => {
    (async () => {
      const _wallets = await getWallets();
      const _selectedWallet = await getSelectedWallet();

      const address = _wallets && _wallets[_selectedWallet] ? _wallets[_selectedWallet].address : ''

      const serverStatus = await getAppStatus(address);

      console.log(serverStatus)

      if (serverStatus.status === 'UNDER_MAINTAINANCE') {
        setAppStatus('UNDER_MAINTAINANCE')
        return;
      }

      const compareResult = "OK";
      setAppStatus(compareResult)

      if (compareResult !== 'OK') {
        setInited(1);
        return;
      }

      // Get local auth setting
      const enabled = await getAppPasscodeSetting();
      setLocalAuthEnabled(enabled);

      // Get local wallets data
      try {
        let localWallets = await getWallets();

        const promiseArr = localWallets.map(async (wallet) => {
          wallet.balance = await getBalance(wallet.address);
          return wallet;
        });

        localWallets = await Promise.all(promiseArr);
        setWallets(localWallets);
      } catch (error) {
        console.error(error);
      }

      // Get selected wallet
      try {
        let _selectedWallet = await getSelectedWallet();
        setSelectedWallet(_selectedWallet);
      } catch (error) {
        console.error(error);
      }

      // Get token info
      try {
        const info = await getTokenInfo();
        setTokenInfo(info);
      } catch (error) {
        console.error(error);
      }

      // Get local address book
      const addressBook = await getAddressBook();
      setAddressBook(addressBook);

      // Get language setting
      const languageSetting = await getLanguageSetting();
      languageSetting && setLanguage(languageSetting);

      // Add fado token to local list
      const vertifiedTokenList = await getVerifiedTokenList();
      const newTokenList = vertifiedTokenList.filter((item, idx) => {
        if(item.id === FADO_TOKEN_ID) {
          vertifiedTokenList[idx].walletOwnerAddress = address;
          return item;
        }
      })
      await saveTokenList(newTokenList);

      // Get local KRC20 list
      const krc20List = await getTokenList();
      const filteredList = krc20List.filter((item) => !!item.walletOwnerAddress)
      if (filteredList.length === krc20List.length) {
        console.log('No old token found')
      } else {
        console.log('Clear old token')
        await saveTokenList(filteredList);
      }
      setKRC20TokenList(filteredList);

      // Get font size setting
      const fontSizeSetting = await getFontSize();
      setFontSize(fontSizeSetting)

      setInited(1);
    })();
  }, [
    setWallets,
    setTokenInfo,
    setAddressBook,
    setLanguage,
    setSelectedWallet,
    setKRC20TokenList,
    setLocalAuthEnabled,
  ]);

  if (!inited) {
    return (
      <View style={[styles.splashContainer, {backgroundColor: theme.backgroundColor}]}>
        <ImageBackground
          style={styles.splashImage}
          source={require('../../assets/fado-wallet/splash-screen-light.png')}
        />
      </View>
    );
  }

  if (appStatus === 'UNDER_MAINTAINANCE') {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: theme.backgroundColor, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={require('../../assets/under_maintenance.png')}
          style={{
            width: viewportWidth,
            height: 400,
          }}
        />
        <CustomText style={{color: theme.textColor, fontSize: 32, textAlign: 'center', marginBottom: 12, fontWeight: 'bold'}}>Under maintenance</CustomText>
        <CustomText style={{color: theme.textColor, fontSize: 13, textAlign: 'center', marginHorizontal: 20}}>Sorry for the inconvenience .We will come back soon</CustomText>
      </SafeAreaView>
    )
  }

  if (appStatus === 'NEED_UPDATE') {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: theme.backgroundColor, alignItems: 'center', justifyContent: 'center'}}>
        <CustomText style={{color: theme.textColor, fontSize: 28, fontWeight: 'bold', marginBottom: 12, marginHorizontal: 20}}>
          New version is available.
        </CustomText>
        <CustomText style={{color: theme.textColor, marginHorizontal: 20}}>
          A new version is available, please update your app to use latest features
        </CustomText>
        <Button
          title={'Update'}
          style={{marginHorizontal: 20, marginTop: 24}}
          onPress={() => {
            if (Platform.OS === 'android') {
              Linking.openURL("market://details?id=com.kardiawallet")
            } else {
              Linking.openURL("itms-apps://itunes.apple.com/us/app/apple-store/id1551620695")
            }
          }}
        />
      </SafeAreaView>
    )
  }

  if (wallets.length === 0) {
    return (
      <NavigationContainer>
        <Portal.Host>
          <NoWalletStackScreen />
        </Portal.Host>
      </NavigationContainer>
    );
  }

  if (!isLocalAuthed && localAuthEnabled) {
    return <ConfirmPasscode />;
  }

  return (
    <>
      <NavigationContainer>
        <Portal.Host>
          <Stack.Navigator>
            <Stack.Screen
              options={{headerShown: false}}
              name="Wrap"
              component={Wrap}
            />
            <Stack.Screen
              name="Notification"
              component={Notification}
              options={{
                headerStyle: {
                  backgroundColor: theme.backgroundColor,
                },
                headerTitleStyle: {
                  color: theme.textColor,
                },
                headerTintColor: theme.textColor,
                headerBackTitleVisible: false,
                headerTitle: getLanguageString(
                  language,
                  'NOTIFICATION_SCREEN_TITLE',
                ),
              }}
            />
          </Stack.Navigator>
        </Portal.Host>
      </NavigationContainer>
    </>
  );
};

export default AppContainer;
