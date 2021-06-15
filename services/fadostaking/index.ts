import KardiaClient from 'kardia-js-sdk';
import { FADO_TOKEN_ADDRESS } from '../../fado.config';
import FADO_STAKING_ABI from './fadoStakingABI.json';
import FADO_TOKEN_ABI from './fadoTokenKRCABI.json';
import { RPC_ENDPOINT } from '../config';
import { weiToKAI } from '../transaction/amount';
import { FADO_STAKE_SMC, FADO_TOKEN_SMC } from './config';

const kardiaClient = new KardiaClient({endpoint: RPC_ENDPOINT});
const kardiaContract = kardiaClient.contract;


export const getFadoTokenBalance = async (smcAddess : string) => {
  try {
    kardiaContract.updateAbi(FADO_STAKING_ABI);
    const rs = await kardiaContract.invokeContract('getBalance', []).call(smcAddess);

    return rs
  } catch (error) {
    console.log(error);
    return 0;
  }
}

export const getFadoTotalStakedAmount = async ( smcAddress: string ) =>{
  try {
    kardiaContract.updateAbi(FADO_STAKING_ABI);
    const rs = await kardiaContract
    .invokeContract('totalStakedAmount', [],).call(smcAddress);
 
    return rs;
  } 
  catch (error) {
    console.log(error);
    return 0;
  }
};

export const stakeFadoToken = async ( stakeAmount: number , wallet: Wallet) => {
      kardiaContract.updateAbi(FADO_TOKEN_ABI);
      const approveStatus = await kardiaContract.invokeContract('approve', [FADO_STAKE_SMC , stakeAmount]).call(FADO_TOKEN_SMC);
      try {
          if(approveStatus === true) {
            kardiaContract.updateAbi(FADO_STAKING_ABI);
            if(wallet !== undefined && wallet.privateKey !== undefined ){
              console.log("start stake");
              
              const txtAddress = kardiaContract.invokeContract('stake', [stakeAmount]).send(wallet.privateKey, FADO_STAKE_SMC);
              return txtAddress;
            }
            return null;
          }
          return null;
            }catch (error) {
  console.log(error);
  return null;
}      
}

export const stakerInfo = async (stakerAddress: string ) => {
    kardiaContract.updateAbi(FADO_STAKING_ABI);

    if(stakerAddress !== undefined){
      const resObj = await kardiaContract.invokeContract('stakerInfo', [stakerAddress]).call(FADO_STAKE_SMC);
      return resObj
  }
    return '';
}