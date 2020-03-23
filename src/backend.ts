import { KeyTools, AlgoName, Encoder } from './key-tools';
import axios from 'axios';

type ApiKey = string;
type PrivateKey = string;
export type ClientRateToken = string;

export interface Keys {
  algorithm: AlgoName;
  apiKey: ApiKey;
  pkcs8: PrivateKey;
}

function addMinutes(date:Date, minutes: number): Date {
  return new Date(date.getTime() + minutes*60000);
}

export interface ClientSigningRequest {
  sellCurrency: string;
  buyCurrency: string;
  buyAmount?: number;
  sellAmount?: number;
  address: string;
}


export class Backend {

  private encoder: Encoder
  private keyTool: KeyTools
  private apiUrl: string;
  private appUrl: string;

  constructor(
    private partnerId: string,
    private baseUrl = 'staging.altalix.com'
  ){
    this.encoder = new Encoder(window);
    this.keyTool = new KeyTools(window.crypto, this.encoder);
    this.apiUrl = `https://app.${this.baseUrl}/api`
    this.appUrl = `https://app.${this.baseUrl}`
  }

  async getPrivateKey(keys: Keys): Promise<CryptoKey> {
    return this.keyTool.importPrivateRSAKey(
      keys.pkcs8,
      keys.algorithm
    );
  }

  async generateSignedCreateTransactionURL(
    clientSigningRequest: ClientSigningRequest,
    keys: Keys
  ): Promise<string> {
    // TODO: Partners should validate their signing request from their clients
    const privateKey = await this.getPrivateKey(keys)

    //Generate string encoded json
    const json = this.generateJsonParams(clientSigningRequest, this.partnerId)
    const stringifiedJson = JSON.stringify(json);

    // Create buffer that can be signed (almost all browsers are utf-16 encoded)
    const buffer = this.encoder.u16StrToU8ArrayBuffer(stringifiedJson);

    // Sign buffer
    const signature = await this.keyTool.signRsaSignature(privateKey, buffer);

    // Base 64 encode buffer and signature.
    const b64Payload = this.encoder.u8ArrayBufferToB64(buffer);
    const b64Signature = this.encoder.u8ArrayBufferToB64(signature);

    // Perform URL Encoding
    const url = new URL(this.appUrl);
    url.searchParams.set('payload', b64Payload);
    url.searchParams.set('signature', b64Signature);

    return url.toString()
  }

  async generateUserRateToken(
    keys: Keys
  ): Promise<ClientRateToken> {
    const expiryDate = addMinutes(new Date(), 10);
    return axios.post(
      `${this.apiUrl}/auth/sessions`,
      {
        scopes: ['user:rate'],
        expires_at: expiryDate.toISOString()
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${keys.apiKey}`,
          'Access-Control-Allow-Origin': '*' // TODO: Can I now remove this?
        }
      }
    ).then(resp => {
      console.log("got resp: "+ resp)
      return resp.data['access_token']
    });
  }


  private generateJsonParams(req: ClientSigningRequest, partnerId: string){
    return {
      sell_currency: req.sellAmount,
      buy_currency: req.buyAmount,
      buy_amount: req.buyAmount,
      address: req.address,
      partner_id: partnerId
    };
  }
}
