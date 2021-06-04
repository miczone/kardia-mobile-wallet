import {StyleSheet} from 'react-native';
import {STATUSBAR_HEIGHT} from '../../components/StatusBar';

export const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -STATUSBAR_HEIGHT,
  },
  splashImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noWalletContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  noWalletLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});
