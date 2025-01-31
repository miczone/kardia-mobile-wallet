import {RPC_ENDPOINT, ENDPOINT} from '../config';
import KardiaClient from 'kardia-js-sdk';
import {requestWithTimeOut} from '../util';

export const getKRC20TokenInfo = async (address: string) => {
  const client = new KardiaClient({endpoint: RPC_ENDPOINT});
  const krc20 = client.krc20;
  krc20.address = address;

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };
  const response = await requestWithTimeOut(
    fetch(`${ENDPOINT}contracts/${address}`, requestOptions),
    50 * 1000,
  );
  const responseJSON = await response.json();
  const info = {
    name: responseJSON.data.name,
    symbol: responseJSON.data.tokenSymbol,
    decimals: responseJSON.data.decimals,
    totalSupply: responseJSON.data.totalSupply,
    avatar: responseJSON.data.logo || '',
    // avatar: '',
  };
  return info;
};

export const getBalance = async (tokenAddress: string, userAddress: string) => {
  try {
    const client = new KardiaClient({endpoint: RPC_ENDPOINT});
    const krc20 = client.krc20;
    krc20.address = tokenAddress;
    const balance = await krc20.balanceOf(userAddress);
    return balance;
  } catch (error) {
    console.log('error', userAddress, tokenAddress)
    return 0
  }
};

export const getTxDetail = async (
  tokenAddress: string,
  userAddress: string,
  transactionHash: string,
) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };
  const response = await requestWithTimeOut(
    fetch(
      `${ENDPOINT}token/txs?page=1&limit=1&txHash=${transactionHash}&address=${userAddress}&contractAddress=${tokenAddress}`,
      requestOptions,
    ),
    50 * 1000,
  );
  const responseJSON = await response.json();
  return responseJSON.data
    ? responseJSON.data.data.map((i: any) => {
        i.hash = i.transactionHash;
        i.date = new Date(i.time);
        i.time = new Date(i.time);
        i.status = 1;
        i.type = i.from === userAddress ? 'OUT' : 'IN';
        return i;
      })[0]
    : {};
};

export const getTx = async (tokenAddress: string, userAddress: string, page: number) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };
  const response = await requestWithTimeOut(
    fetch(
      `${ENDPOINT}token/txs?page=${page}&limit=5&address=${userAddress}&contractAddress=${tokenAddress}`,
      requestOptions,
    ),
    50 * 1000,
  );
  const responseJSON = await response.json();
  let haveMore = true
  if (responseJSON?.data?.total >= 0 && responseJSON.data.data.length === 0) {
    haveMore = false
  } else if (responseJSON?.data?.total > responseJSON.data.data.length * (responseJSON?.data?.page)) {
    haveMore = true
  }
  return responseJSON.data
    ? {
        data: responseJSON.data.data.map((i: any) => {
          i.date = new Date(i.time);
          i.time = new Date(i.time);
          i.status = 1;
          i.type = i.from === userAddress ? 'OUT' : 'IN';
          return i;
        }),
        haveMore: haveMore
      }
    : {
      data: [],
      haveMore: false
    };
};

export const estimateKRC20Gas = async (to: string, amount: number) => {
  const client = new KardiaClient({endpoint: RPC_ENDPOINT});
  const krc20 = client.krc20;

  const estimatedGas = krc20.estimateGas(to, amount);
  return estimatedGas;
};

export const transferKRC20 = async (
  tokenAddress: string,
  privateKey: string,
  to: string,
  amount: number,
  transferPayload: Record<string, any> = {},
) => {
  const client = new KardiaClient({endpoint: RPC_ENDPOINT});
  const krc20 = client.krc20;
  krc20.address = tokenAddress;
  await krc20.getDecimals(true);

  return krc20.transfer(privateKey, to, amount, transferPayload);
};

export const getVerifiedTokenList = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };
  const response = await requestWithTimeOut(
    fetch(`${ENDPOINT}contracts?page=1&limit=25&type=KRC20&status=Verified`, requestOptions),
    50 * 1000,
  );
  const responseJSON = await response.json();
  const tokenList: KRC20[] = responseJSON.data.data.map((item: any) => {
    return {
      id: item.address,
      name: item.name,
      address: item.address,
      symbol: item.tokenSymbol,
      avatar: item.logo,
      decimals: item.decimal,
    }
  });
  return tokenList;
}