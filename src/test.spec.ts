import { Backend, Keys } from "../src/backend";
import { Client } from "./client";

describe("Backend", () => {
  /* tslint:disable */
  const partnerSecretKeys: Keys = {
    algorithm: "RSASSA-PKCS1-v1_5",

    // API KEY HERE
    apiKey:
      "eyJzY29wZXMiOiBbImF1dGg6Y3JlYXRlX3Nlc3Npb24iXSwgImNyZWF0ZWRfYXQiOiAiMjAyMC0wNy0wOFQxMjo0MToyMC43NDcwOTMrMDA6MDAiLCAic3ViamVjdCI6ICJjZWI0MzdiYi02NjIzLTQyMGMtYWU4MC1jYjZiNDdjNzhlZWIiLCAiZXhwaXJlc19hdCI6ICIyMDIxLTA3LTA3VDIzOjAwOjAwKzAwOjAwIiwgInByaW5jaXBhbCI6IG51bGx9G4pNLsITCnG+GlCD7BLd7W2/LIyzZ2pkkWLLV/OWUW0VdRbm7Rumb43vWfMDwY+bmzuDAstldZNG0WiMu6v3xk5jpuS9gU3Nv1QLp1L89FANyLuJj9hrQ+cD/03kw87Bk1SSqqR8wWaLgqompWz3ta63pcS/+morrNjy4ysbbHIezGAnXo2ZGXah+TwEbZWG0OwvduHHS5pvO/ZIgg1z/lipnJ6K2IRMIhxwUyy2DRj9oolFGnmbb1W6y14Ia1bASpZqo60B6F+aae6t/7f2fi28bg1cseNrNuVRWTyKeXdd5KLqDPm40poFUxyPZEytIaYxZcOD5i3OEFFUuLaDRg==",

    // SIGNING PRIVATE KEY HERE
    keyId:  "e523ac3d-d9cc-4012-a9bb-905cd112715c",
    pkcs8:  "MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDA3eC7BZxq5VSv3wu+QQevolXLf0GF1elxRAKsC4nOnnpqRh8M4GFKJJWmuoAuc3Q95zESxm78HwKDY374h1ICRRnIgZ71ab+J0sDB9kKFc5jGUMMyGjyDzH/6zAqXg/6e1X/ww2wgaMhQOrFC5KP8lV+M9kWx1n0hMzz3PtSv/7ShXKMEEnedE3KdNTLSYc7Q+6/Igf2AjjQ3zKmR3zc2uYA4YVHn79XvzMeOPLR7s0ZnwKcCjQh3c44ouSvzA/JER7Z7pIYPSPP8pTLPQ54QRyK/VeGMxZjgBmEmFvStzq7NYJ0uci09XGE7FjKE3UEu6e28FQhXZcjWkOpPaZdjAgMBAAECggEAFeshVx/UHvHhJfubQgvx66vvRCk6MROWbCDmjNbi2nB4SQufC7+UTvDJcSFQ3/aPB1n24cNbaZu8lWIBVA1M7KUdwQO6JPnXoroo3eI2vSPeAOu8wzzoE7Jx+PanXYDKtxJcb+hFqYk++p8w9gE2AcaYDVUPpp5RqixAiXjCgx3BlKmSwSgSIS01g1jTMuIBjVPN5H9AmDuRr6SHhidYUsAPqaID2fpBwW4NgnJYrEbqtgD+O5E3zAycx+Ccz5J5wWFpdTqQ4HnbZU8fa3uxxYpz87bTQRTyUbhZ54g7fEiW3Bosm6Vp9QLOTFrz+LW0Cvj34mD/eGz+zuG6E++FAQKBgQD0i9w7tZE1OyIIZoRREkJGadgV7oCLVl26h5QTkC/TzmGJLOSr/zysNUdfAJHZz9fIwbTXVjG1z1Sex3ktOUWM6Qz9TJnVAvbfP/TOWiXIO06H/gm5GHT5hw98TOGqBWYXNqK3MaVMzXq/vT+poZw46leCOEfc+YnVCA33PM0AkwKBgQDJ5l9tQyJH1tRQEnOc4TdNlOAfNAUe3ZqMjRX3zgdunAZ9ctGzhTl/HlfMoF7at/hl1PBxecfSVpPFJ5hgD0jvz28lS4ArlONooe4ZTN0JNZ3P40x37L8LdTHjekTcg2wPCnhORvk60eIRKNQMeVTxJZpLxyO47cqnx+TOlOTf8QKBgQDwcwB1+T4wv9bjuaFKcZCW2YWtctgTqTT5rktrvO857Ig8r9acQ5etn6lwgQfnyZRbghNFVCwGnziN8oZ0cAax2Yh7GrF7H7ILq0ATEdJqgd3im2eGBsUlgKY6SwHsAejy1DbDt93XmYajNvp82TnZQJoQoTQP05Cx1Xyd57uOXwKBgQCUOlknC5m4amWXn+RXchW7FKjy36s+vO2BcPeG5jEYqN4u7cQ9a3sJ88n8BmV9aIGqqYoZlZH5v+xfW7GIHNCsl3t/Qw4HcRkAMZpv4rmI0F9bSAJVLXAZRmJpItQ5nRcRd9tZhMvnvj2d4X7E5bNSFAxSxBJa6+HUCnLWpAPg0QKBgQCmMS98Xai8nUHJ7tq0Y/hUAeZ+hxGvufAFPjTH7irjnw2QGvRUwfVgaRjSWGZXKJS04e3HRrBISf1VWgnXHPnh5Kf75nYbYs71GhADeVzdmbnyj6kyGAZXSoqVCBPvySxIXVPXSoJA7ZUJwUFJf/J23ObLX6pcrf2v0s4lrC4Mfw=="
  };
  /* tslint:enable */

  it("should enable getting rates", async () => {
    // Client asks the Partner Backend for a quote token
    const client = new Client();

    // Partner then generates a quote token if it's one of their customers
    const backend = new Backend("partnerId");
    const userToken = await backend.generateUserRateToken(partnerSecretKeys);

    // Client creates parameters to get the rate from Altalix
    const rate = client.getRate(userToken, "ETH", 25);
    
    // TODO: validate expected parameters exist
    expect(rate).toBeTruthy();
  });

  it("should allow execution", async () => {
    // Client asks the Partner Backend for a quote token
    const client = new Client("crypto.ldnlabs.co.uk");

    // Partner then generates a quote token if it's one of their customers
    const backend = new Backend("partnerId", "crypto.ldnlabs.co.uk");

    // To execute - the client must generate a signing request
    const signingReq = client.generateSigningRequest();

    // Partner then can generate a URL that's got a valid signature for the user
    const url = await backend.generateSignedCreateTransactionURL(
      signingReq,
      partnerSecretKeys
    );

    // Now just open the URL inside your app or redirect user to this URL
    expect(url).toBeTruthy();
  });
});
