import { ec } from "elliptic";
const secp256k1 = new ec("secp256k1");

export class Wallet {
  private key: ec.KeyPair;
  private address: string;

  constructor(address?: string, privateKey?: string) {
    if (!address || !privateKey) {
      this.key = secp256k1.genKeyPair();
      this.address = this.key.getPublic("hex");
    } else {
      this.key = secp256k1.keyFromPrivate(privateKey);
      this.address = address;
    }
  }

  get Address(): string {
    return this.address;
  }

  get Key(): string {
    return this.key.getPrivate("hex");
  }
}
