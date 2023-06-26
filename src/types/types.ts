export interface ICryptoInfo {
  name: string;
  previousPrice: number;
  price: number;
  open24hour: number;
  previousDailyChange: number;
  dailyChange: number;
}

export interface ISocketMessage {
  TYPE: string;
  FROMSYMBOL: string;
  PRICE: number;
  OPEN24HOUR?: number;
}
