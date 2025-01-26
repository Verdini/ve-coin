import {
  buildBlockchain,
  buildWallet,
  mineBlock,
  signTransaction,
} from "../../../lib/core";

export function initBlockchainFixtures() {
  const timestamp = new Date().getTime();

  const walletMiner = buildWallet();
  const wallet1 = buildWallet();
  const wallet2 = buildWallet();

  const blockchain = buildBlockchain();

  const secondBlock = mineBlock({
    height: 1,
    previousHash: blockchain.getLastBlock().header.hash,
    transactions: [],
    message: "First mined empty block",
    difficulty: blockchain.getDifficulty(),
    reward: blockchain.getMiningReward(),
    minerAddress: walletMiner.address,
  });

  // Add the block to the blockchain and reward miner with 100 coins
  blockchain.addBlock(secondBlock);

  const transaction1 = {
    fromAddress: walletMiner.address,
    toAddress: wallet1.address,
    amount: 45,
    fee: 5,
    timestamp,
    signature: "",
  };
  signTransaction(transaction1, walletMiner.key);
  blockchain.addToMemPool(transaction1);

  const transaction2 = {
    fromAddress: walletMiner.address,
    toAddress: wallet2.address,
    amount: 45,
    fee: 5,
    timestamp,
    signature: "",
  };
  signTransaction(transaction2, walletMiner.key);
  blockchain.addToMemPool(transaction2);

  const thirdBlock = mineBlock({
    height: 1,
    previousHash: blockchain.getLastBlock().header.hash,
    transactions: blockchain.takeFromMemPool(),
    message: "Second mined block",
    difficulty: blockchain.getDifficulty(),
    reward: blockchain.getMiningReward(),
    minerAddress: walletMiner.address,
  });

  // Add the block to the blockchain and reward miner with 100 coins
  blockchain.addBlock(thirdBlock);

  return { walletMiner, wallet1, wallet2, blockchain };
}
