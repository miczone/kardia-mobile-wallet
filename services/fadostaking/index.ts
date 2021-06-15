import { allowance } from './index';
import { DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE } from './../../config';
import { cellValue } from './../transaction/amount';
import KardiaClient from 'kardia-js-sdk';
import {FADO_TOKEN_ADDRESS} from '../../fado.config';
import FADO_STAKING_ABI from './fadoStakingABI.json';
import FADO_TOKEN_ABI from './fadoTokenKRCABI.json';
import FADO_REWARD_ABI from "./fadoRewardABI.json";
import { RPC_ENDPOINT } from '../config';
import { weiToKAI } from '../transaction/amount';
import { FADO_STAKE_SMC, FADO_TOKEN_SMC } from './config';

const kardiaClient = new KardiaClient({endpoint: RPC_ENDPOINT});
const kardiaContract = kardiaClient.contract;

// Base on ABI defined, note that function with constant = "false" > invoke.send ,
// else invole.call


export const stakeFadoToken = async ( stakeAmount: number , wallet: Wallet) => {
  const convertAMount = cellValue(stakeAmount);
  
  kardiaContract.updateAbi(FADO_TOKEN_ABI);
  try{         
    const invocation = kardiaContract.invokeContract('approve', [FADO_STAKE_SMC , convertAMount]);
    // Test fail thu switch lại
    const estimatedGas = await invocation.estimateGas(invocation.getDefaultTxPayload)
    const approveStatus = await invocation.send(wallet.privateKey!, FADO_TOKEN_SMC,{
      from: wallet.address,
      gas: estimatedGas,
      gasPrice: DEFAULT_GAS_PRICE,
    });
    console.log(approveStatus);
          if(approveStatus === true){
            kardiaContract.updateAbi(FADO_REWARD_ABI);
              console.log("start stake");
              const txtAddress = await kardiaContract
              .invokeContract('stake', [convertAMount])
              .send(wallet.privateKey!, FADO_STAKE_SMC, {
                from: wallet.address,
                gas: DEFAULT_GAS_LIMIT,
                gasPrice: DEFAULT_GAS_PRICE,
              });
              console.log(txtAddress);
              return txtAddress;9
          }
          return null;
      }
      catch (error){
        console.log(error);
        return null;
      }      
}

