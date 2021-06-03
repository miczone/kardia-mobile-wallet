import { SERVICE_ENDPOINT_ENV } from './config';

let FADO_TOKEN_NAME = "FADO";
let FADO_TOKEN_SYMBOL = "FADO";
let FADO_TOKEN_ID = "0x0292d0AfA6DDaFCFA54ed17eC5e639976DbCb137";

if(SERVICE_ENDPOINT_ENV === 'development') {
  FADO_TOKEN_NAME = "FADO Token Contract";
  FADO_TOKEN_SYMBOL = "FADO";
  FADO_TOKEN_ID = "0x4a93362e9cFc0B400fD1f58DDb7C0Bc3D92145F6";
}

export {
  FADO_TOKEN_NAME,
  FADO_TOKEN_SYMBOL,
  FADO_TOKEN_ID
}