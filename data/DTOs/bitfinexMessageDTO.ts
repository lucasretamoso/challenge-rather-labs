import { BitfinexFrequencyEnum, BitfinexPrecisionEnum } from "../enums/bitfinexEnum";

export interface BitfinexBookRequestDTO {
  symbol: string;
  prec?: BitfinexPrecisionEnum;
  freq?: BitfinexFrequencyEnum;
  len?: ["1", "25", "100", "250"];
}

export interface BitfinexBookMessegetDTO extends BitfinexBookRequestDTO {
  event: string;
  channel: string;
}