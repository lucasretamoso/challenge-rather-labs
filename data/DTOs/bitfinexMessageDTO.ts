export interface BitfinexMessageDTO {
  event: string;
  channel: string;
  symbol: string;
  frec?: string;
}