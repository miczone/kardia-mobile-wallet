
import { DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE } from './../../config';
import { cellValue } from './../transaction/amount';
import KardiaClient from 'kardia-js-sdk';
import { RPC_ENDPOINT } from '../config';
import { weiToKAI } from '../transaction/amount';

import FADO_STAKING_ABI from './fadoStakingABI.json';
import FADO_TOKEN_ABI from './fadoTokenKRCABI.json';
import FADO_REWARD_ABI from "./fadoRewardABI.json";
import { FADO_STAKE_SMC, FADO_TOKEN_SMC } from './config';

const kardiaClient = new KardiaClient({endpoint: RPC_ENDPOINT});
const kardiaContract = kardiaClient.contract;

export const getStakerInfo = async (walletAddress: string) => {
  kardiaContract.updateAbi(FADO_STAKING_ABI);
  const response = await kardiaContract.invokeContract('stakerInfo', [walletAddress]).call(FADO_STAKE_SMC);

  console.log({response});
}

/**
 * @param stakeAmount 
 * @param wallet 
 * @returns tx : Return transaction address.
 */
export const stakeFadoToken = async ( stakeAmount: number , wallet: Wallet) => {
  const convertAMount = cellValue(stakeAmount);
  console.log({convertAMount});

  kardiaContract.updateAbi(FADO_TOKEN_ABI);
  try{         
    const approveInvocation = await kardiaContract.invokeContract('approve', [FADO_STAKE_SMC , convertAMount]);
    // Test fail thu switch lại
    const estimatedGas = await approveInvocation.estimateGas(approveInvocation.getDefaultTxPayload)
    console.log({estimatedGas});
    
    const approveStatus = await approveInvocation.send(wallet.privateKey!, FADO_TOKEN_SMC,{
      from: wallet.address,
      gas: DEFAULT_GAS_LIMIT,
      gasPrice: DEFAULT_GAS_PRICE,
    });
    await  allowance(wallet, FADO_STAKE_SMC);
    console.log({approveStatus});

    kardiaContract.updateAbi(FADO_STAKING_ABI);
    const stakeInvocation = await kardiaContract.invokeContract('stake', [convertAMount])
    const stakeEstimateGas = await stakeInvocation.estimateGas(stakeInvocation.getDefaultTxPayload)
    console.log({stakeEstimateGas});

    const txtAddress = await stakeInvocation.send(wallet.privateKey!, FADO_STAKE_SMC, {
      from: wallet.address,
      gas: DEFAULT_GAS_LIMIT,
      gasPrice: DEFAULT_GAS_PRICE,
    })

    console.log({txtAddress});
      }
      catch (error){
        console.log(error);
        return null;
      }      
}


/**
 * 
 * @param wallet,@param smcAddr
 * @return numberAllowance: 
 * This function get back the approved amount that was call in 'approve' 
 */
const allowance = async (wallet: Wallet, smcAddr: string) => {
  console.log("HELLO");
  
  kardiaContract.updateAbi(FADO_TOKEN_ABI);
  const numberAllowance = await kardiaContract.invokeContract('allowance', [wallet.address, smcAddr]).call(FADO_TOKEN_SMC);

  console.log({numberAllowance});
}


