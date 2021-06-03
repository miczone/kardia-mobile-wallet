import {SERVICE_ENDPOINT_ENV} from '../config';

let DEX_ENDPOINT = 'https://exchange-backend.kardiachain.io/api/v1/';
let ENDPOINT = 'https://backend.kardiachain.io/api/v1/';
let RPC_ENDPOINT = 'https://rpc.kardiachain.io';
let HASURA_ENDPOINT = 'https://hasura-exchange.kardiachain.io/v1/graphql';
let EXPLORER_URL = 'https://explorer.kardiachain.io';
let HASURA_CREDENTIALS = 'ZjE0ZDgzMWNlOWNlNTY0YmRlMGNiYjJl';
let PROXY_ENDPOINT = 'https://backend-proxy.kardiachain.io/api/';

if (SERVICE_ENDPOINT_ENV === 'development') {
  DEX_ENDPOINT = 'https://dex-backend-dev.kardiachain.io/api/v1/';
  ENDPOINT = 'https://backend-dev.kardiachain.io/api/v1/';
  RPC_ENDPOINT = 'https://dev-1.kardiachain.io';
  HASURA_ENDPOINT = 'https://hasura-dev.kardiachain.io/v1/graphql';
  EXPLORER_URL = 'https://explorer-dev.kardiachain.io';
  HASURA_CREDENTIALS = 'fengari@kaitothemoon123';
  PROXY_ENDPOINT = 'https://backend-proxy-dev.kardiachain.io/api/';
} else if (SERVICE_ENDPOINT_ENV === 'staging') {
  DEX_ENDPOINT = 'https://exchange-backend.kardiachain.io/api/v1/';
  ENDPOINT = 'https://backend-beta.kardiachain.io/api/v1/';
  RPC_ENDPOINT = 'https://rpc.kardiachain.io';
  HASURA_ENDPOINT = 'https://hasura-exchange.kardiachain.io/v1/graphql';
  EXPLORER_URL = 'https://explorer.kardiachain.io';
  HASURA_CREDENTIALS = 'ZjE0ZDgzMWNlOWNlNTY0YmRlMGNiYjJl';
}

const SIMPLEX_URL = 'https://buy.chainbits.com/?crypto=KAI';

export {
  DEX_ENDPOINT,
  ENDPOINT,
  RPC_ENDPOINT,
  HASURA_ENDPOINT,
  EXPLORER_URL,
  HASURA_CREDENTIALS,
  PROXY_ENDPOINT,
  SIMPLEX_URL
};
