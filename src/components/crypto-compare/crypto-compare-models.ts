export type CryptoCompareErrorResponse = {
  Response: string;
  Message: string;
  HasWarning: boolean;
  Type: number;
  RateLimit: any;
  Data: any;
  ParamWithError: string;
};

export type CryptoCompareSymbolPriceResponse = Record<string, Record<string, number>>;

export type CryptoCompareResponse = CryptoCompareErrorResponse | CryptoCompareSymbolPriceResponse;
