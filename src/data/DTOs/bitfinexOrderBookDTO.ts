import { BitfinexMessageDTO } from './bitfinexMessageDTO';

export interface BitfinexOrderBookDTO {
  bid: Map<string, string>;
  ask: Map<string, string>;
}

export interface EffectivePriceDTO extends BitfinexMessageDTO{
  operation: 'buy' | 'sell';
  count: number;
  limitEffectivePrice?: number;
}

export interface EffectivePriceCalculator {
  amount: number,
  count: number,
}