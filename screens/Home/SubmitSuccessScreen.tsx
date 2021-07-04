import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, Icon, Image} from 'react-native-elements';
import {useRecoilValue} from 'recoil';
import {languageAtom} from '../../atoms/language';
import {theme} from '../../theme/light';
import {getLanguageString} from '../../utils/lang';

let THANK_YOU_IMG = require('../../assets/fado-wallet/thank-you.png');

const SubmitSuccessScreen = () => {
  const language = useRecoilValue(languageAtom);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={THANK_YOU_IMG}
        containerStyle={styles.imgContainer}
        style={styles.img}
      />
      <Text style={styles.notify}>{getLanguageString(language, 'Notify')}</Text>
      <Text style={styles.message}>
        {getLanguageString(language, 'SUCCESS_MESSAGE')}
      </Text>
      <Text style={styles.message}>
        {getLanguageString(language, 'THANK_MESSAGE')}
      </Text>
      <Button
        title={getLanguageString(language, 'BACK_TO_HOME')}
        onPress={() => navigation.navigate('HomeScreen')}
        buttonStyle={styles.backBtn}
      />
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
  successMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary,
  },
  img: {
    margin: 5,
    resizeMode: 'contain',
  },
  imgContainer: {
    width: '80%',
    height: '30%',
    marginRight: 40,
  },
  notify: {
    fontSize: 16,
    color: theme.primary,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    marginTop: 4,
  },
  backBtn: {
    marginTop: 6,
  },
});

export default SubmitSuccessScreen;
