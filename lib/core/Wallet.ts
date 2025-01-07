import { ec } from "elliptic";
const secp256k1 = new ec("secp256k1");

//
export interface Wallet {
  address: string;
  key: string;
}

export function createWallet(): Wallet {
  const key = secp256k1.genKeyPair();
  return {
    address: key.getPublic("hex"),
    key: key.getPrivate("hex"),
  };
}
