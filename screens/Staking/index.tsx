import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { languageAtom } from '../../atoms/language';
import { showTabBarAtom } from '../../atoms/showTabBar';
import { statusBarColorAtom } from '../../atoms/statusBar';
import { getStakerInfo, stakeFadoToken } from '../../services/fadostaking';
import { ThemeContext } from '../../ThemeContext';
import { getSelectedWallet, getWallets } from '../../utils/local';
import {styles} from './style';

interface Props {
  
}

const FadoStakingScreen = (props: Props) => {
  const theme = useContext(ThemeContext);
  
  const language = useRecoilValue(languageAtom); 
  const navigation = useNavigation();

  const setStatusBarColor = useSetRecoilState(statusBarColorAtom);
  const setTabBarVisible = useSetRecoilState(showTabBarAtom);

  useFocusEffect(
    useCallback(() => {
      setTabBarVisible(true);
      setStatusBarColor(theme.backgroundColor);
      return () => {
        setStatusBarColor(theme.backgroundColor);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    (async () => {
      const wallets = await getWallets();
      const selectedWallets = await getSelectedWallet();

      if (
        !wallets[selectedWallets] ||
        !wallets[selectedWallets].address
      ) {
        return;
      }

      try {
        console.log("Address:" + " " +wallets[selectedWallets].address);
        
        // await stakeFadoToken(50, wallets[selectedWallets]);
        await getStakerInfo(wallets[selectedWallets].address);

      } catch (error) {
        console.error({error} + '-' + wallets[selectedWallets].address);
      }
    })();
  }, [])

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      {/* UI */}
      <Text>BIN</Text>
    </SafeAreaView>
  )
}

export default FadoStakingScreen;
