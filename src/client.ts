import axios from 'axios';
import { ClientSigningRequest, ClientRateToken } from './backend';

function addMinutes(date:Date, minutes: number): Date {
  return new Date(date.getTime() + minutes*60000);
}

export enum FixedSideEnum {
  BUY = 'BUY',
  SELL = 'SELL'
}

interface RateResponse {
  symbol: string;
  fixed_side: FixedSideEnum;
  buy_volume: number;
  sell_volume: number;
  rate: number;
  settlement_fee: number;
}

export class Client {

  private apiUrl: string;

  constructor(
    private baseUrl = 'staging.altalix.com'
  ){
    this.apiUrl = `https://app.${this.baseUrl}/api`
  }

  generateSigningRequest(): ClientSigningRequest {
    // TODO: Somewhere inside the UI - grab these details
    return {
      sellCurrency: 'EUR',
      buyCurrency: 'ETH',
      buyAmount: 3,
      address: '0x093a919323d808d08bd7E72E3dFE0666BeB8D91E'
    }
  }

  async getPartnerRateToken(): Promise<ClientRateToken> {
    // PARTNER TODO: Axios call to partner hosted backend to get a
    // Quote token
    throw new Error("Not implemented error");
  }

  async getRate(
    token: ClientRateToken,
    buyCurrency: string,
    sellVolume: number,
  ): Promise<RateResponse> {
    // TODO: We should retreive this from the currencies endpoint to get the
    // correct code
    const symbol = `${buyCurrency}EUR`
    return axios.get<RateResponse>(
      `${this.apiUrl}/rates`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        params: {
          symbol,
          sell_volume: sellVolume
        }
      }
    ).then(rate => {
      return rate.data;
    })
  }
}
