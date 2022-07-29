import tokenList from "./tokens.json";

interface IToken {
  name: string;
  symbol: string;
  decimals: number;
  assetId: string;
}

export const TOKENS: Array<IToken> = tokenList;
export const TOKENS_BY_ASSET_ID = TOKENS.reduce(
  (acc, tok) => ({ ...acc, [tok.assetId]: tok }),
  {} as Record<string, IToken>
);

export const TOKENS_BY_SYMBOL: Record<string, IToken> = TOKENS.reduce(
  (acc, tok) => ({ ...acc, [tok.symbol]: tok }),
  {} as Record<string, IToken>
);
