import KardiaClient from 'kardia-js-sdk';
import { FADO_TOKEN_ADDRESS } from '../../fado.config';
import FADO_ABI from './fadoStakingABI.json';
import { RPC_ENDPOINT } from '../config';
import { weiToKAI } from '../transaction/amount';

const kardiaClient = new KardiaClient({endpoint: RPC_ENDPOINT});
const kardiaContract = kardiaClient.contract;


export const getFadoTokenBalance = async (smcAddess : string) => {
  try {
    kardiaContract.updateAbi(FADO_ABI);
    const rs = await kardiaContract.invokeContract('getBalance', []).call(smcAddess);

    return rs
  } catch (error) {
    console.log(error);
    return 0;
  }
}

export const getKRC20TokenFado = async (smcAddess : string , walletAdderess: string) => {
  try {
    const kardiaKrc20 = kardiaClient.krc20;
   // Fetch KRC20 token's data from smart contract
await kardiaKrc20.getFromAddress('KRC20_TOKEN_ADDRESS');

const balance = await kardiaKrc20.balanceOf('YOUR_WALLET_ADDRESS');
// `balance` will be your wallet's balance, but with token's `decimals` padding.
// To get real ballance, use the following code

const decimals = await kardiaKrc20.getDecimals();
const parsedBalance = balance / 10 ** decimals;
return parsedBalance;
  } catch (error) {
    console.log(error + " " + walletAdderess);
    return 0;
  }
}

export const getFadoTotalStakedAmount = async ( smcAddress: string ) =>{
  try {
    kardiaContract.updateAbi(FADO_ABI);
    const rs = await kardiaContract
    .invokeContract('totalStakedAmount', [],).call(smcAddress);
 
    return rs;
  } 
  catch (error) {
    console.log(error);
    return 0;
  }
};

export const stakeFadoToken = async (smcAddress: string ) => {
  
}
