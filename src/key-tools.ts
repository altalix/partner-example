/* tslint:disable:max-classes-per-file */
export type AlgoName = "RSASSA-PKCS1-v1_5";
export type U8String = string;
export type U16String = string;
export type UInt8Buffer = ArrayBuffer;

export class Encoder {
  constructor(private window: Window) {}

  u8ArrayBufferToB64(buffer: UInt8Buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return this.window.btoa(binary);
  }

  /*
    Convert a string into an ArrayBuffer
    from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  */
  u16StrToU8ArrayBuffer(str: U16String): ArrayBuffer {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i); // This will overflow if larger than a byte
    }
    return buf;
  }

  b64ToUInt8Buffer(b64: string): UInt8Buffer {
    // base64 decode the string to get the binary data
    const binary = this.window.atob(b64);

    // convert from a binary string to an ArrayBuffer
    return this.u16StrToU8ArrayBuffer(binary);
  }
}

export class KeyTools {
  constructor(private crypto: Crypto, private encoder: Encoder) {}

  async importPublicRsaKey(spki: string, name: AlgoName): Promise<CryptoKey> {
    const keyData = this.encoder.b64ToUInt8Buffer(spki);

    return this.crypto.subtle.importKey(
      "spki",
      keyData,
      {
        // these are the algorithm options
        name,
        hash: { name: "SHA-256" },
      },
      false,
      ["verify"]
    );
  }

  async verifyRsaSignature(
    name: AlgoName,
    publicKey: CryptoKey,
    b64Signature: string,
    b64Payload: string
  ): Promise<boolean> {
    const signature = this.encoder.b64ToUInt8Buffer(b64Signature);
    const data = this.encoder.b64ToUInt8Buffer(b64Payload);

    return this.crypto.subtle
      .verify(name, publicKey, signature, data)
      .then((val) => {
        return val;
      });
  }

  // TODO Add better typing
  extractPemContentsFromPublicKey(pem: string): string {
    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    return pem.substring(pemHeader.length, pem.length - pemFooter.length);
  }

  async importPrivateRSAKey(pkcs8: string, name: AlgoName): Promise<CryptoKey> {
    const keyData = this.encoder.b64ToUInt8Buffer(pkcs8);

    return this.crypto.subtle.importKey(
      "pkcs8",
      keyData,
      {
        // these are the algorithm options
        name,
        hash: { name: "SHA-256" },
      },
      false,
      ["sign"]
    );
  }

  async signRsaSignature(
    privateKey: CryptoKey,
    data: UInt8Buffer
  ): Promise<UInt8Buffer> {
    return this.crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, data);
  }
}
