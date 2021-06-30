import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, Icon, Image} from 'react-native-elements';
import {useRecoilValue} from 'recoil';
import {languageAtom} from '../../atoms/language';
import {theme} from '../../theme/light';
import {getLanguageString} from '../../utils/lang';

interface Props {}

const SubmitSuccessScreen = (props: Props) => {
  const language = useRecoilValue(languageAtom);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.successMessage}>
        {getLanguageString(language, 'FADO_CONTACT_SUPPORT_SUCCESS')}
      </Text>
      <Button title={getLanguageString(language, 'BACK_TO_HOME')} onPress={() => navigation.navigate('HomeScreen')}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  imgContainer: {
    width: '50%',
    height: '50%',
    
  },
  img: {
    margin: 10,
    resizeMode: 'contain',
  },
  successMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary
    
  },
});

export default SubmitSuccessScreen;
