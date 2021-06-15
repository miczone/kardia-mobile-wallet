import { DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE } from './../../config';
import { cellValue } from './../transaction/amount';
import KardiaClient from 'kardia-js-sdk';
import { FADO_TOKEN_ADDRESS } from '../../fado.config';
import FADO_STAKING_ABI from './fadoStakingABI.json';
import FADO_TOKEN_ABI from './fadoTokenKRCABI.json';
import FADO_REWARD_ABI from "./fadoRewardABI.json";
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

      const convertAMount = cellValue(stakeAmount);
      
      try {
          // var approveStatus = await kardiaContract.invokeContract('approve', [FADO_STAKE_SMC , convertAMount]).send(wallet.privateKey!, FADO_TOKEN_SMC,{
          //   from: wallet.address,
          //   gas: DEFAULT_GAS_LIMIT,
          //   gasPrice: DEFAULT_GAS_PRICE,
          // });
          // console.log(approveStatus);

         
const invocation = kardiaContract.invokeContract('approve', [FADO_STAKE_SMC , convertAMount])
    const estimatedGas = await invocation.estimateGas(invocation.getDefaultTxPayload)
    const approveStatus = await invocation.send(wallet.privateKey!, FADO_TOKEN_SMC,{
      from: wallet.address,
      gas: estimatedGas,
      gasPrice: DEFAULT_GAS_PRICE,
    });
    console.log(approveStatus);
         
          
          if(approveStatus === true) {
            kardiaContract.updateAbi(FADO_REWARD_ABI);
            if(wallet !== undefined && wallet.privateKey !== undefined ){
              console.log("start stake");
              
              const txtAddress = await kardiaContract.invokeContract('stake', [convertAMount]).send(wallet.privateKey, FADO_STAKE_SMC, {
                from: wallet.address,
                gas: DEFAULT_GAS_LIMIT,
                gasPrice: DEFAULT_GAS_PRICE,
              });
              console.log(txtAddress);
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
      console.log("allownance " + resObj);
      
      return resObj
  }
    return '';
}

export const allowance = async (walletAddress : string , smcAddresss : string ) => {
kardiaContract.updateAbi(FADO_TOKEN_ABI);
const rs = await kardiaContract.invokeContract('allowance' , ["0x5E162Ed79CD19Dc641Dc46a2Ee38bfFF44d0033f" , "0x17c34B8344f20bD0E25F0fD8f128BEBd9B5d0c2B" ]).call(FADO_TOKEN_SMC);
console.log(rs);

}

