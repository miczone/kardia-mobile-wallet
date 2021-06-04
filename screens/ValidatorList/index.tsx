import {useFocusEffect, useNavigation} from '@react-navigation/native';
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {languageAtom} from '../../atoms/language';
import ENIcon from 'react-native-vector-icons/Entypo';
import List from '../../components/List';
import TextInput from '../../components/TextInput';
import {getAllValidator} from '../../services/staking';
import {ThemeContext} from '../../ThemeContext';
import {getLanguageString} from '../../utils/lang';
import {getDigit, isNumber} from '../../utils/number';
import {styles} from './style';
import TextAvatar from '../../components/TextAvatar';
import NewStakingModal from '../common/NewStakingModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomText from '../../components/Text';
import { showTabBarAtom } from '../../atoms/showTabBar';
import ValidatorItem from './ValidatorItem';

const ValidatorList = () => {
  const theme = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);
  // const [filterValidator, setFilterValidator] = useState('');
  const [validatorList, setValidatorList] = useState<Validator[]>([]);
  const [loading, setLoading] = useState(true);
  const [validatorItem, setValidatorItem] = useState<Validator>();

  const navigation = useNavigation();

  const setTabBarVisible = useSetRecoilState(showTabBarAtom)

  useFocusEffect(
    useCallback(() => {
      setTabBarVisible(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    (async () => {
      try {
        const {validators} = await getAllValidator();
        setValidatorList(validators);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <NewStakingModal
        validatorItem={validatorItem}
        visible={validatorItem !== undefined && validatorItem.smcAddress !== ''}
        onClose={() => {
          setValidatorItem(undefined);
        }}
      />
      <ENIcon.Button
        style={{paddingHorizontal: 20}}
        name="chevron-left"
        onPress={() => navigation.goBack()}
        color={theme.backBtnTextColor}
        underlayColor={theme.backBtnUnderlayColor}
        backgroundColor="transparent"
      />
      <CustomText
        style={{color: theme.textColor, paddingHorizontal: 20, fontSize: 36}}>
        {getLanguageString(language, 'CHOOSE_VALIDATOR')}
      </CustomText>
      <View style={{flex: 1}}>
        <List
          keyExtractor={(item) => item.smcAddress}
          // items={validatorList.filter(filter)}
          items={validatorList}
          loading={loading}
          loadingSize="large"
          loadingColor={theme.textColor}
          render={(item: Validator) => {
            return (
              <ValidatorItem item={item} onSelect={() => setValidatorItem(item)} />
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ValidatorList;
