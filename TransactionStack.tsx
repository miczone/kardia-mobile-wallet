import React, { useEffect, useState } from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
// import CreateTxScreen from './screens/CreateTransaction';
import TransactionScreen from './screens/Transactions';
import TransactionDetail from './screens/TransactionDetail';
import SuccessTx from './screens/SuccessTx';
import TokenDetail from './screens/TokenDetail';
import TokenTxDetail from './screens/TokenTxDetail';
import { useRecoilValue } from 'recoil';
import { selectedWalletAtom, walletsAtom } from './atoms/wallets';
import { filterByOwnerSelector } from './atoms/krc20';
import { getSelectedWallet, getWallets } from './utils/local';
import { getBalance } from './services/account';


const TransactionStack = createStackNavigator();

const TransactionStackScreen = () => {
 
 //Cục này để get param của fado token
  const selectedWallet = useRecoilValue(selectedWalletAtom);
  const wallets = useRecoilValue(walletsAtom)
  const tokenList = useRecoilValue(filterByOwnerSelector(wallets[selectedWallet].address))
  const fadoToken = tokenList[0];
  const [balance, setBalance] = useState<number[]>([]);

  const updateBalanceAll = async () => {
    
    const _wallets = await getWallets();
    const _selectedWallet = await getSelectedWallet();
    const promiseArr = tokenList.map((i) => {
      return getBalance(i.address, _wallets[_selectedWallet].address);
    });
    const balanceArr = await Promise.all(promiseArr);
    setBalance(balanceArr);
   
  }
 
  useEffect(() => {
    updateBalanceAll();
  }, [tokenList, selectedWallet]);
// End

 
  return (
    <TransactionStack.Navigator
      initialRouteName="TokenDetail"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
  
      {/*Chuyển sang route này để switch main thành Fado Coin */}
      <TransactionStack.Screen 
      name="TokenDetail" 
      component={TokenDetail} options={{headerShown: false}} 
      initialParams={
          {tokenAddress: fadoToken.address,
           name: fadoToken.name,
           symbol: fadoToken.symbol,
           avatar: fadoToken.avatar,
           decimals: fadoToken.decimals,
            balance: balance[0],}
        }    
      />

      <TransactionStack.Screen name="TokenTxDetail" component={TokenTxDetail} options={{headerShown: false}}  />
    </TransactionStack.Navigator>
  );
};

export default TransactionStackScreen;
