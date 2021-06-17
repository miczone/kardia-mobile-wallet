/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Dimensions, ImageBackground, View, Image, Platform, StyleSheet} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {useFocusEffect} from '@react-navigation/native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {languageAtom} from '../../atoms/language';
import {selectedWalletAtom, walletsAtom} from '../../atoms/wallets';
import { BigNumber } from "bignumber.js";
import List from '../../components/List';
import {getAllValidator, getCurrentStaking, mapValidatorRole} from '../../services/staking';
import {ThemeContext} from '../../ThemeContext';
import {getLanguageString} from '../../utils/lang';
// import {styles} from './style';
import StakingItem from './StakingItem';
import AlertModal from '../../components/AlertModal';
import {useNavigation} from '@react-navigation/native';
import {weiToKAI} from '../../services/transaction/amount';
import Button from '../../components/Button';
import {statusBarColorAtom} from '../../atoms/statusBar';
import {getSelectedWallet, getWallets} from '../../utils/local';
import UndelegateModal from './UndelegateModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showTabBarAtom } from '../../atoms/showTabBar';
import CustomText from '../../components/Text';
import { formatNumberString } from '../../utils/number';
import NewStakingModal from '../common/NewStakingModal';
import { FADO_STAKING_VALIDATOR } from '../../fado.config';
import { FADO_STAKE_SMC, FADO_TOKEN_SMC } from '../../services/fadostaking/config';
import FadoNewStakingModal from '../common/FadoNewStakingModal';
import { getStakerInfo} from '../../services/fadostaking';
import IconButton from '../../components/IconButton';
import theme, { HEADER_HEIGHT } from '../../theme';

const {width: viewportWidth} = Dimensions.get('window');

const StakingScreen = () => {
  const theme = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);
  const selectedWallet = useRecoilValue(selectedWalletAtom);
  const wallets = useRecoilValue(walletsAtom);
  const setStatusBarColor = useSetRecoilState(statusBarColorAtom);
  const setTabBarVisible = useSetRecoilState(showTabBarAtom);
  const navigation = useNavigation();

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(true);
  const [currentStaking, setCurrentStaking] = useState<Staking[]>([]);
  const [undelegatingIndex, setUndelegatingIndex] = useState(-1);
  
  //@luannm
  const [validatorList, setValidatorList] = useState<Validator[]>([]);
  const [validatorItem, setValidatorItem] = useState<Validator>();
  const [stakerInfo, setStakerInfo] = useState();
  const [visible, setVisible] = useState(false);

  console.log({visible});
  
  const getStakingData = async () => {
    const localWallets = await getWallets();
    const localSelectedWallet = await getSelectedWallet();

    // Check valid wallet
    if (
      !localWallets[localSelectedWallet] ||
      !localWallets[localSelectedWallet].address
    ) {
      return;
    }
    try {
      // const _staking = await getCurrentStaking(
      //   localWallets[localSelectedWallet].address,
      // );
      //   console.log({_staking});
      
      // Get staker info
      // const stakerInfoConst = await getStakerInfo(localWallets[localSelectedWallet].address);
      // if (stakerInfoConst !== undefined) {
      //   setStakerInfo(stakerInfoConst);
      // }
      if (loading === true) {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      if (loading === true) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getStakingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, selectedWallet, wallets]);

  useFocusEffect(
    useCallback(() => {
      getStakingData();
      setTabBarVisible(true);
      // TODO: Update after designer finish
      setStatusBarColor(theme.backgroundColor);
      return () => {
        setStatusBarColor(theme.backgroundColor);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    if (message !== '' || undelegatingIndex >= 0) {
      setStatusBarColor(theme.backgroundColor);
    } else {
      setStatusBarColor(theme.backgroundColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [undelegatingIndex, message]);

  const parseStakingItemForList = (item: Staking) => {
    return {
      label: item.validatorContractAddr,
      value: item.validatorContractAddr,
      name: item.name,
      stakedAmount: item.stakedAmount,
      claimableRewards: item.claimableRewards,
      withdrawableAmount: item.withdrawableAmount,
      unbondedAmount: item.unbondedAmount,
      role: mapValidatorRole(item.validatorRole),
    };
  };

  
  //Call Api and get "Fado SJC
  useEffect(() => {
    (async () => {
      try {
        const {validators} = await getAllValidator();

      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  //Toggle Modal with Validator = FADO, 
  const toggleStakingModal = () =>{
    // validatorList.map((validator) => {
    //   if(validator.name === FADO_STAKING_VALIDATOR){
    //     setValidatorItem(validator);
    //   }
    // })
    console.log({visible});
    
    setVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={styles.header}>
        <CustomText style={[styles.headline, {color: theme.primary}]}>
          {getLanguageString(language, 'STAKING_TITLE')}
        </CustomText>
      </View>

      {!stakerInfo  &&
        <View style={styles.emptyStake}> 
          <Image
              style={{width: 200, height: 172}}
              source={require('../../assets/icon/no_staking.png')}
          />

          <CustomText style={{color: theme.textColor, fontSize: 24, fontWeight: 'bold', textAlign: 'center',marginBottom: 8}}>
            {getLanguageString(language, 'NO_STAKING')}
          </CustomText>

          <CustomText style={[styles.noStakingText, {color: theme.mutedTextColor, textAlign: 'center', marginBottom: 32, lineHeight: 26}]}>
           {getLanguageString(language, 'NO_STAKING_ITEM')}
          </CustomText>
          
          <Button
              type="primary"
              onPress={() => toggleStakingModal()}
              title={getLanguageString(language, 'STAKE_NOW')}
              textStyle={{
                fontWeight: '500', 
                fontSize: theme.defaultFontSize + 3,
                fontFamily: Platform.OS === 'android' ? 'WorkSans-SemiBold' : undefined
              }}
              style={{width: 248}}
              icon={
                <AntIcon
                  name="plus"
                  size={20}
                  color={theme.white}
                  style={{marginRight: 8}}
                />
              }
            />
        </View>
      }

      {stakerInfo && 
        <View>
          <CustomText>Welcome</CustomText>
        </View>
      }

      {/* {currentStaking.length > 0 && (
        <ImageBackground
          source={require('../../assets/staking_background.png')}
          imageStyle={{
            resizeMode: 'cover',
            width: viewportWidth - 40,
            height: 172,
            borderRadius: 12,
          }}
          style={{
            width: viewportWidth - 40,
            height: 172,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingVertical: 32,
          }}>
          <CustomText
            allowFontScaling={false}
            style={[
              styles.sectionTitle,
              {color: theme.textColor, textAlign: 'center', fontWeight: '500'},
              {fontFamily: Platform.OS === 'android' ? 'WorkSans-SemiBold' : undefined}
            ]}>
            {getLanguageString(language, 'TOTAL_EARNING')}
          </CustomText>
        </ImageBackground>
      )} */}

      {/* {currentStaking.length > 0 && (
        <CustomText
          style={[
            styles.sectionTitle,
            {
              color: theme.textColor,
              // paddingHorizontal: 14,
              paddingVertical: 20,
            },
          ]}>
          {getLanguageString(language, 'YOUR_INVESTMENTS')}
        </CustomText>
      )}
      <List
        loading={loading}
        loadingColor={theme.primaryColor}
        items={currentStaking.map(parseStakingItemForList)}
        render={(item, index) => {
          return (
            <StakingItem
              item={item}
            />
          );
        }}
        ItemSeprator={() => <View style={{height: 6}} />}
      /> */}
      
      {/* {currentStaking.length > 0 && (
        <>
        <Button
          type="primary"
          icon={<AntIcon name="plus" size={24} color={theme.white} />}
          size="small"
          onPress={() => toggleStakingModal()}
          style={styles.floatingButton}
        />
      
        <NewStakingModal
                validatorItem={validatorItem}
                visible={validatorItem !== undefined}
                onClose={() => {
                  setValidatorItem(undefined);
                 }}
      /> */}

        {/* <FadoNewStakingModal
            visible={validatorItem !== undefined}
            onClose = {() => {
            setValidatorItem(undefined);
          }}
        /> */}
      {/* </> */}
      {/* )} */}
      <FadoNewStakingModal
          visible={visible}
          onClose={() => {
          setVisible(false);
          }}
      /> 

      {message !== '' && (
      <AlertModal
          type={messageType as any}
          message={message}
          onClose={() => {
            setMessage('');
            if (messageType === 'success') {
              getStakingData();
            }
          }}
          visible={true}
        />
      )}
      
      <UndelegateModal
        item={
          undelegatingIndex >= 0
            ? currentStaking.map(parseStakingItemForList)[undelegatingIndex]
            : {}
        }
        showModal={(_message: string, _messageType: string) => {
          setUndelegatingIndex(-1);
          setMessage(_message);
          setMessageType(_messageType);
        }}
        visible={undelegatingIndex >= 0}
        onClose={() => setUndelegatingIndex(-1)}
      />
    </SafeAreaView>
  );
};

export default StakingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 15,
    paddingHorizontal: 20,
  },
  header:{
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    marginHorizontal: -20,
  },
  headline:{
    fontSize: 36,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  emptyStake:{
    justifyContent:'center',
    alignItems:'center'
  },
  noStakingText: {
    // padding: 15,
    fontSize: 15,
    // fontStyle: 'italic',
  },
})


// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import React, { useCallback, useContext, useEffect } from 'react';
// import { View } from 'react-native';
// import { Text } from 'react-native-elements';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRecoilValue, useSetRecoilState } from 'recoil';
// import { languageAtom } from '../../atoms/language';
// import { showTabBarAtom } from '../../atoms/showTabBar';
// import { statusBarColorAtom } from '../../atoms/statusBar';
// import { claimFadoReward, getStakerInfo, stakeFadoToken, withDrawAll } from '../../services/fadostaking';
// import { ThemeContext } from '../../ThemeContext';
// import { getSelectedWallet, getWallets } from '../../utils/local';
// import {styles} from './style';

// interface Props {
  
// }

// const FadoStakingScreen = (props: Props) => {
//   const theme = useContext(ThemeContext);
  
//   const language = useRecoilValue(languageAtom); 
//   const navigation = useNavigation();

//   const setStatusBarColor = useSetRecoilState(statusBarColorAtom);
//   const setTabBarVisible = useSetRecoilState(showTabBarAtom);

//   useFocusEffect(
//     useCallback(() => {
//       setTabBarVisible(true);
//       setStatusBarColor(theme.backgroundColor);
//       return () => {
//         setStatusBarColor(theme.backgroundColor);
//       };
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []),
//   );

//   useEffect(() => {
//     (async () => {
//       const wallets = await getWallets();
//       const selectedWallets = await getSelectedWallet();

//       if (
//         !wallets[selectedWallets] ||
//         !wallets[selectedWallets].address
//       ) {
//         return;
//       }

//       try {
//         console.log("Address:" + " " +wallets[selectedWallets].address);
        
 
//       } catch (error) {
//         console.error({error} + '-' + wallets[selectedWallets].address);
//       }
//     })();
//   }, [])

//   return (
//     <SafeAreaView style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
//       {/* UI */}
//       <Text>BIN</Text>
//     </SafeAreaView>
//   )
// }

// export default FadoStakingScreen;
