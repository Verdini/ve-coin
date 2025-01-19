import elliptic from "elliptic";
const secp256k1 = new elliptic.ec("secp256k1");

//
export interface Wallet {
  address: string;
  key: string;
}

export function buildWallet(): Wallet {
  const key = secp256k1.genKeyPair();
  return {
    address: key.getPublic("hex"),
    key: key.getPrivate("hex"),
  };
}
