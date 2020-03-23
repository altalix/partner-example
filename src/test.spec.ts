import { Backend, Keys } from "../src/backend";
import { Client } from "./client";

describe('Backend', () => {

  /* tslint:disable */
  const partnerSecretKeys: Keys = {
    algorithm: 'RSASSA-PKCS1-v1_5',
    apiKey: 'eyJzY29wZXMiOiBbImF1dGg6Y3JlYXRlX3Nlc3Npb24iXSwgImV4cGlyZXNfYXQiOiAiMjAyMC0wMy0yM1QxODoyNDo0MC42MzMwMDArMDA6MDAiLCAiY3JlYXRlZF9hdCI6ICIyMDIwLTAzLTIzVDE4OjIxOjQwLjc2NDkyNSIsICJwcmluY2lwYWwiOiBudWxsLCAic3ViamVjdCI6ICJiNWY1OTUwNS00YWUxLTQ0NjYtOGE3ZS00ZjU3NjJkZjVhNTcifZfxKwSfMgr6ywpGIyRQ2DLG5kvFwNnIyJ6Nls7ZmSciuJHAFbSN8Xv58xn+MI4mKSr5eI7vysJBSKg7C8eO+8iWHsq2ExgFARWefRYP+6zG2Zkfrtydz9XROadqgsRmk8MyLdxpXGUA4F8P1CLnjSJMwTOUKXLruzfOzRdcz17jgwfedTyVGJ3msaQJMByft8JC2q8vOxFjXO7GzPhGknbWtlW48VIQD/Yr1KSQOQxwug6bfFSu6mD0qi5QINckMpJfLrf8sr5JeiSaYY+L+eddb32CIvBv0wcZHQwVtAcAqVg3AdM85SJNkO3wG4Tku7PoAvD52oE19S82m2GLqUQ=',
    pkcs8:
      'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCwigyM8UYeEf1GUGX2Ldb9q3QBrQrUCi8NPGtsViUAhB2SpEsM3OaJY45G3rkrjH4Ooqa5+BGfStRklFnEAZviLzZ2OzNcFnkioSMy31hzuCgOApIQA4pMgIkYE5lgEykl7PfZ0GM0A2ceM9fwCXv7OSlco42taXoQpS/9Zs+9xPwc9aYVIR1jFJPAq2OQLpV7KfHxeYWORYLggTtGiBrirJ33Ze1egb91vzva/GlNt8W5XwwHQ+mnXEVRThSsHZ7Lm/hiO6kFLmWVIS75ICdZ/r3B4VaUtGyTViyy333agdu5LMcmEtKlAHO9DfNcvJkFNB+qHXlo4R3KS2DG34yRAgMBAAECggEAQGV7AoaYTyu8ucNmDhDWlZ3PKTVX99TnKOrbPJ+Hy9JlfzJS9hQ2O/OG2K8x2ILdELWgH8Ivm22OYEoFHIyBslYKhcI+j97avRkOX+Y8u6l3YvTpFtJTxmg0mgW8MuGKZv0zw85SAY0kNk4u/K5Y/WDyh4pZieIp1pyLDuJL8SqojQxjtMw42lambXXi6bE/hGhXx1le67K3pyKGDATdUYzh8nSJa1SOptfifqzOA/hzSV0prlDI3u4dOY5HmfC7t66QM2VdZ6PN02ObIxrwbWBQoS363BwuhkO9prfqMH5KcuWnspnjgteEbKk2Cppb+1VIQ/dRJ2Fcfonm1Q+24QKBgQDfMLO5eh7zgoSQ2oRPG/3suA+j/A+KkBv+8DOeNaLEsol8dKX46HoREZSm1KGJDtwhzzms1NZvsVU6Q0dp10Fprct8ABFuolJIKVdmnmE2vNmRc7ReIrGRAawoHrjYpc3gblJcaR+vMm4rchqh8lIJGupi1hXqoCFDwGjMviTp3QKBgQDKfbwO/SSVtPZgnp2kQOpgWqyEk2r78fVOof/8IZdtjL49YbKn+0nGYo3mnlFRBTKlHbFCCEYI3BolS17JabTNsDK03HDEjy42fOKe+AL8xoPsOwAvyVbkXd/cln12BPV8nkWrAic5U/9/I+6kPPF2hIVz/w+psroc/Wp/p/BURQKBgGuMME6EBj4Y+oBCi9cDCgzzdLX0VBjU8GicnoLyHYji71VFcGTMwWVQL21ksKI2wuSX0pbxyJLxxLvah6L80sx1rsQF1GCXX0behPsx/m49+ikYtCVYWnAhei+q/i+HVfl7r7xP+7CUgHn29dZryhQRIDiYKN9yYhUftmBSj78RAoGAUSksY2WbcFXkGr34uYk7Z/twAoOD8g/9HtNX4xsjsskixz+NeD8ERvvhnHoAZdULg5rvHWRrjcmKwUAAcgJocbkZ2dwxZtds0nIj80u9BswavGi5nm244jeuLqAzEUbTjmtxySVHy3abhb5FPJcgwTxEsUWeZYo5hr0cHqaVcXECgYBzNLxN1tT907NtpPMcj+5Dko4YSFzZ25nFWXeILeq+F5L03xEMkUkHDNIhx01FX50/cjvJrrOkG7lIQQ1jaE4qaKiVeue7BTPWYbs1kzZ+6WNiOX8wRK6+p6+gekpUm4JFpLbmQBJ8ztyL8JgQu7FUfTkiIG0agwphbhe4a3wpxw==',
  };
  /* tslint:enable */

  it('should enable getting rates', async() => {

    // Client asks the Partner Backend for a quote token
    const client = new Client('crypto.ldnlabs.co.uk');

    // Partner then generates a quote token if it's one of their customers
    const backend = new Backend('partnerId', 'crypto.ldnlabs.co.uk');
    const userToken = await backend.generateUserRateToken(partnerSecretKeys);

    // Client creates parameters to get the rate from Altalix
    const rate = client.getRate(userToken, 'ETH', 25);

    // TODO: validate expected parameters exist
    expect(rate).toBeTruthy();
  });

  it('should allow execution', async() =>{
    // Client asks the Partner Backend for a quote token
    const client = new Client('crypto.ldnlabs.co.uk');

    // Partner then generates a quote token if it's one of their customers
    const backend = new Backend('partnerId', 'crypto.ldnlabs.co.uk');

    // To execute - the client must generate a signing request
    const signingReq = client.generateSigningRequest();

    // Partner then can generate a URL that's got a valid signature for the user
    const url = await backend.generateSignedCreateTransactionURL(
      signingReq,
      partnerSecretKeys
    )

    // Now just open the URL inside your app or redirect user to this URL
    expect(url).toBeTruthy();
  });

});
