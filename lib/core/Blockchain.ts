import { Block } from "./Block";
import * as Consensus from "./Consensus";

export class Blockchain {
  private chain: Block[];
  private difficulty: number;
  private miningReward: number;

  constructor() {
    this.chain = [];
    this.difficulty = Consensus.Difficulty;
    this.miningReward = Consensus.MiningReward;
  }

  Init() {
    this.chain = [];
    const genesisBlock = new Block(new Date(), []);
    this.EnqueueBlock(genesisBlock);
  }

  EnqueueBlock(block: Block) {
    this.chain.push(block);
  }

  GetBlocks(): Block[] {
    return this.chain;
  }

  GetLastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  GetBalance(_address: string): number {
    throw new Error("not implemented yet");
  }

  IsValid(): boolean {
    throw new Error("not implemented yet");
  }
}
