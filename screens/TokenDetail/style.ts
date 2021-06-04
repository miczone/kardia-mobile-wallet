import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  tokenLogo: {
    width: 60,
    height: 60,
    borderRadius: 25,
  },
  kaiLogo: {
    width: 24,
    height: 24,
  },
  buttonGroupContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  noTXText: {
    padding: 15,
  },
  kaiAmount: {
    textAlign: 'right',
  },
  kaiCardContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 240,
    // marginBottom: 16,
  },
  kaiCard: {
    
    padding: 30,
    flex: 1,
    justifyContent: 'space-between',
   
  },
  cardBackground: {
    flex: 1,
    top: 0,
    left: 0,
    height: 230,
    resizeMode: 'cover',
    position: 'absolute',
    borderRadius: 22,
  },
  kaiCardText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 32,
    minWidth: 52,
    width: 52,
    minHeight: 52,
    height: 52,
    borderRadius: 26,
    paddingVertical: 0,
    opacity:0.8
  },
  noTXContainer: {
    // flex: 1,
    // paddingHorizontal: 83,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
