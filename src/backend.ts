import { KeyTools, AlgoName, Encoder } from "./key-tools";
import axios from "axios";

type ApiKey = string;
type PrivateKey = string;
type PrivateKeyId = string;
type ISODateString = string;
export type ClientRateToken = string;
interface SigningKey {
  id: PrivateKeyId;
  pkcs8: PrivateKey;
}

export interface Keys {
  algorithm: AlgoName;
  apiKey: ApiKey;
  signingKey: SigningKey;
}

interface PayloadParams {
  sell_currency: string;
  buy_currency: string;
  buy_amount?: number;
  sell_amount?: number;
  address: string;
  partner_id: string;
  key_id: string;
  created_at: ISODateString;
}

export interface ClientSigningRequest {
  sellCurrency: string;
  buyCurrency: string;
  buyAmount?: number;
  sellAmount?: number;
  address: string;
}

interface TokenCreatedResponse {
  access_token: ClientRateToken;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

export class Backend {
  private encoder: Encoder;
  private keyTool: KeyTools;
  private apiUrl: string;
  private appUrl: string;

  constructor(
    private partnerId: string,
    private baseUrl = "staging.altalix.com"
  ) {
    this.encoder = new Encoder(window);
    this.keyTool = new KeyTools(window.crypto, this.encoder);
    this.apiUrl = `https://app.${this.baseUrl}/api`;
    this.appUrl = `https://app.${this.baseUrl}`;
  }

  async getPrivateKey(keys: Keys): Promise<CryptoKey> {
    return this.keyTool.importPrivateRSAKey(
      keys.signingKey.pkcs8,
      keys.algorithm
    );
  }

  async generateSignedCreateTransactionURL(
    clientSigningRequest: ClientSigningRequest,
    keys: Keys
  ): Promise<string> {
    // TODO: Partners should validate their signing request from their clients
    const privateKey = await this.getPrivateKey(keys);

    // Generate string encoded json
    const json = this.generateJsonParams(
      clientSigningRequest,
      this.partnerId,
      keys.signingKey.id
    );
    const stringifiedJson = JSON.stringify(json);

    // Create buffer that can be signed (almost all browsers are utf-16 encoded)
    const buffer = this.encoder.u16StrToU8ArrayBuffer(stringifiedJson);

    // Sign buffer
    const signature = await this.keyTool.signRsaSignature(privateKey, buffer);

    // Base 64 encode buffer and signature.
    const b64Payload = this.encoder.u8ArrayBufferToB64(buffer);
    const b64Signature = this.encoder.u8ArrayBufferToB64(signature);

    // Perform URL Encoding
    const url = new URL(`${this.appUrl}/partners/transaction-create`);
    url.searchParams.set("payload", b64Payload);
    url.searchParams.set("signature", b64Signature);

    return url.toString();
  }

  async generateUserRateToken(keys: Keys): Promise<ClientRateToken> {
    const expiryDate = addMinutes(new Date(), 10);
    return axios
      .post<TokenCreatedResponse>(
        `${this.apiUrl}/auth/sessions`,
        {
          scopes: ["user:rate"],
          expires_at: expiryDate.toISOString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keys.apiKey}`,
          },
        }
      )
      .then((resp) => {
        return resp.data.access_token;
      });
  }

  private generateJsonParams(
    req: ClientSigningRequest,
    partnerId: string,
    privateKeyId: PrivateKeyId
  ): PayloadParams {
    const params = {
      sell_currency: req.sellCurrency,
      buy_currency: req.buyCurrency,
      address: req.address,
      partner_id: partnerId,
      key_id: privateKeyId,
      created_at: new Date().toISOString(),
    };
    const fixedAmountParam = this.generateFixedAmountParam(req);

    return {
      ...params,
      ...fixedAmountParam,
    };
  }

  private generateFixedAmountParam(req: ClientSigningRequest) {
    if (req.buyAmount) {
      return { buy_amount: req.buyAmount };
    } else if (req.sellAmount) {
      return { sell_amount: req.sellAmount };
    } else {
      throw new Error("Client must set buy or sell amount");
    }
  }
}
