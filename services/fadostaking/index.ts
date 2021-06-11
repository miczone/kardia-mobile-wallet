import KardiaClient from 'kardia-js-sdk';
import { FADO_TOKEN_ADDRESS } from '../../fado.config';
import FADO_ABI from './fadoStakingABI.json';
import { RPC_ENDPOINT } from '../config';
import { weiToKAI } from '../transaction/amount';

const kardiaClient = new KardiaClient({endpoint: RPC_ENDPOINT});
const kardiaContract = kardiaClient.contract;

interface UserWalletDb {
  wallet_id : int,
  user_partner_id: int,
  address: string ,
  private_key : string,
  publisher: string 
}
// tokenAddress: string
export const getFadoBalance = async ( userAddress: string ) => {
  try {
    const client = new KardiaClient({endpoint: RPC_ENDPOINT});
    const krc20 = client.krc20;
    krc20.address = FADO_TOKEN_ADDRESS;
    const balance = await krc20.balanceOf(userAddress);
  
    return balance;
  } catch (error) {
    console.log('error', userAddress, FADO_TOKEN_ADDRESS)
    return 0
  }
};

export const getFadoTotalStakedAmount = async ( smcAddress: string ) =>{
  try {
    kardiaContract.updateAbi(FADO_ABI);
    const rs = await kardiaContract
    .invokeContract('commission', [])
    .call(smcAddress);
  if (rs.status === 0) {
    throw new Error(`Withdraw reward TX Fail: ${rs.transactionHash}`);
  } else {
    return weiToKAI(rs.rate);
  }
    ;
  } catch (error) {
    console.log('error')
    return 0
  }
}