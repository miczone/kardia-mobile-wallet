import { SERVICE_ENDPOINT_ENV } from './config';

let FADO_TOKEN_NAME = "FADO";
let FADO_TOKEN_SYMBOL = "FADO";
let FADO_TOKEN_ID = "0x0292d0AfA6DDaFCFA54ed17eC5e639976DbCb137";
let FADO_TOKEN_ADDRESS = '0x0292d0AfA6DDaFCFA54ed17eC5e639976DbCb137';
let FADO_EXCHANGE_RATE = 0.023;
let FADO_STAKING_VALIDATOR = 'FADO JSC'
let FADO_TOKEN_AVATAR = 'https://kardiachain-explorer.s3-ap-southeast-1.amazonaws.com/explorer.kardiachain.io/logo/6d5492cd5d39308596a2eb5bdf04717687e4ca81.webp'

if(SERVICE_ENDPOINT_ENV === 'development') {
  FADO_TOKEN_NAME = "FADO Token Contract";
  FADO_TOKEN_SYMBOL = "FADO";
  FADO_TOKEN_ID = "0x4a93362e9cFc0B400fD1f58DDb7C0Bc3D92145F6";
  FADO_TOKEN_ADDRESS = '0x4a93362e9cFc0B400fD1f58DDb7C0Bc3D92145F6';
  FADO_STAKING_VALIDATOR = 'val1',
  FADO_TOKEN_AVATAR = 'https://kardiachain-explorer.s3-ap-southeast-1.amazonaws.com/explorer.kardiachain.io/logo/6d5492cd5d39308596a2eb5bdf04717687e4ca81.webp'
}

export {
  FADO_TOKEN_NAME,
  FADO_TOKEN_SYMBOL,
  FADO_TOKEN_ID,
  FADO_EXCHANGE_RATE,
  FADO_STAKING_VALIDATOR,
  FADO_TOKEN_ADDRESS,
  FADO_TOKEN_AVATAR
}