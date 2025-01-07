export interface Consensus {
  blockInterval: number;
  initialDifficulty: number;
  difficultyStep: number;
  initialMiningReward: number;
  miningRewardStep: number;
  maxCoins: number;
}

export const DefaultConsensus: Consensus = {
  // Number of blocks that need to be mined before the difficulty can be adjusted
  blockInterval: 10,
  // Initial difficulty
  initialDifficulty: 1,
  // Increase in difficulty every BlockInterval blocks
  difficultyStep: 1,
  // Initial mining reward
  initialMiningReward: 100,
  // Decrease in mining reward every BlockInterval blocks
  // reward = initial / (step ^ Floor(blockNumber / blockInterval))
  miningRewardStep: 2,
  // Maximum number of coins
  maxCoins: 21000000,
};
