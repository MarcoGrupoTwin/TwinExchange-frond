let API_URL, API_WS, CB_WS;
let production = false;

if(production){
    API_URL = 'https://api.twinexchange.io/api/';
    API_WS = 'https://ws.twinexchange.io/';
    CB_WS = 'wss://ws-direct.exchange.coinbase.com';
}else{
    API_URL = 'http://localhost:3000/api/';
    API_WS = 'http://localhost:3001';
    CB_WS = 'wss://ws-direct.sandbox.exchange.coinbase.com';
    // API_URL = 'http://192.168.0.74:3000/api/';
    // API_WS = 'http://192.168.0.74:3001';
} 

export const URL_API = API_URL;
export const URL_WS = API_WS;
export const COINBASE_WS = CB_WS;