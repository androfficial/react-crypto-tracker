export interface CryptoInfo {
  name: string;
  symbol: string;
  price: number;
  open24hour: number;
  dailyChange: number;
}

export interface SocketMessage {
  TYPE: string;
  FROMSYMBOL: string;
  TOSYMBOL: string;
  PRICE: number;
  OPEN24HOUR?: number;
}
