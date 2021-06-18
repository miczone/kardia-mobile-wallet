
import { DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE } from './../../config';
import { cellValue, weiToKAI } from './../transaction/amount';
import KardiaClient from 'kardia-js-sdk';
import { RPC_ENDPOINT } from '../config';

import FADO_STAKING_ABI from './fadoStakingABI.json';
import FADO_TOKEN_ABI from './fadoTokenKRCABI.json';
import FADO_REWARD_ABI from "./fadoRewardABI.json";
import { FADO_STAKE_SMC, FADO_TOKEN_SMC } from './config';
import { parseDecimals, parseKaiBalance } from '../../utils/number';
import BigNumber from 'bignumber.js';
import { getBalance } from '../krc20';
import { FADO_TOKEN_ADDRESS } from '../../fado.config';

const kardiaClient = new KardiaClient({endpoint: RPC_ENDPOINT});
const kardiaContract = kardiaClient.contract;

/**
 * 
 * @param walletAddress 
 * @returns allocate, reward, stakeAmount
 */
export const getStakerInfo = async (walletAddress: string) => {
  kardiaContract.updateAbi(FADO_STAKING_ABI);
  try {
    const stakerInfo = await kardiaContract.invokeContract('stakerInfo', [walletAddress]).call(FADO_STAKE_SMC);

    console.log({stakerInfo});
    return stakerInfo;
  } catch (error) {
    console.log({error});
  }
}

export const getFadoBalance = async (walletAdress: string) => {
  kardiaContract.updateAbi(FADO_STAKING_ABI);
  try {
    const balance = await getBalance(FADO_TOKEN_ADDRESS, walletAdress);
    // const balance = await kardiaContract.invokeContract('getBalance' , []).call(FADO_STAKE_SMC);
    // const convertBal = weiToKAI(balance) ;
    // console.log({convertBal});
    
    return balance;
  } catch (error) {
    console.log({error});
    
  }
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
    if (txtAddress.status === 0) {
      throw new Error(`Delegate TX Fail: ${txtAddress.transactionHash}`);
      }
      else {
        return txtAddress;
      }
    }
      catch (error){
        console.log(error);
        return null;
      }      
}


/**
 * 
 * @param wallet 
 * @param withDrawAmount 
 * @returns transaction address
 */
export const withDrawAll = async (wallet: Wallet, withDrawAmount: number) => {
  const convertAMount = cellValue(withDrawAmount);
  kardiaContract.updateAbi(FADO_STAKING_ABI);

  try {
    const txAddress = await kardiaContract.invokeContract('withdraw',[convertAMount]).send(wallet.privateKey!, FADO_STAKE_SMC, {
      from: wallet.address,
      gas: DEFAULT_GAS_LIMIT,
      gasPrice: DEFAULT_GAS_PRICE,
    });

    console.log({txAddress});
    return txAddress;
  } catch (error) {
    console.log({error});
  }
}


export const claimFadoReward = async (wallet: Wallet) => {
  kardiaContract.updateAbi(FADO_STAKING_ABI);

  try {
    const txAddress = await kardiaContract.invokeContract('claimReward', []).send(wallet.privateKey!, FADO_STAKE_SMC, {
      from: wallet.address,
      gas: DEFAULT_GAS_LIMIT,
      gasPrice: DEFAULT_GAS_PRICE,
    });

    console.log({txAddress});
    return txAddress;
    
  } catch (error) {
  }
}

/**
 * 
 * @param wallet,@param smcAddr
 * @return numberAllowance: 
 * This function get back the approved amount that was call in 'approve' 
 */
const allowance = async (wallet: Wallet, smcAddr: string) => {
  kardiaContract.updateAbi(FADO_TOKEN_ABI);
  const numberAllowance = await kardiaContract.invokeContract('allowance', [wallet.address, smcAddr]).call(FADO_TOKEN_SMC);

  console.log({numberAllowance});
}


