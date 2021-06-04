/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';
import {useRecoilValue} from 'recoil';
import {ThemeContext} from '../../../ThemeContext';
import {languageAtom} from '../../../atoms/language';
import {getLanguageString} from '../../../utils/lang';
import {styles} from './style';
import CustomText from '../../../components/Text';

const ListCard = ({
  gasPrice,
  selectGasPrice,
}: {
  gasPrice: number;
  selectGasPrice: (gasPrice: number) => void;
}) => {
  const theme = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);

  const data = [
    {
      title: getLanguageString(language, 'SLOW_SPEED'),
      time: `~5 ${getLanguageString(language, 'SECOND')}`,
      gasPrice: 1,
      image: require('../../../assets/icon/speed_slow_dark.png'),
    },
    {
      title: getLanguageString(language, 'AVERAGE_SPEED'),
      time: `~3 ${getLanguageString(language, 'SECOND')}`,
      gasPrice: 2,
      image: require('../../../assets/icon/speed_average_dark.png'),
    },
    {
      title: getLanguageString(language, 'FAST_SPEED'),
      time: `~1 ${getLanguageString(language, 'SECOND')}`,
      gasPrice: 3,
      image: require('../../../assets/icon/speed_fast_dark.png'),
    },
  ];

  return (
    <View style={styles.listCard}>
      {data.map((item, index) => {
        const active = item.gasPrice === gasPrice;
        return (
          <TouchableOpacity
            key={`tx-speed-${index}`}
            onPress={() => selectGasPrice(item.gasPrice)}
            style={{
              backgroundColor: active
                ? theme.red600
                : theme.backgroundColor,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              width: 114,
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.36,
              shadowRadius: 6.68,

              elevation: 11,
            }}>
            <View
              style={{
                borderRadius: 8,
                padding: 8,
                backgroundColor: active
                  ? theme.red700
                  : 'rgba(58, 59, 60, 1)',
              }}>
              <Image source={item.image} style={{width: 20, height: 20}} />
            </View>
            <View style={{alignItems: 'flex-start'}}>
              <CustomText
                style={{
                  textAlign: 'center',
                  color: active ? theme.white : theme.textColor,
                }}>
                {item.title}
              </CustomText>
              <CustomText
                style={{
                  textAlign: 'center',
                  color: active ? theme.white : theme.textColor,
                }}>
                {item.time}
              </CustomText>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ListCard;
