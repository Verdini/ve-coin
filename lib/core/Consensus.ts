export interface IConsensus {
  BlockInterval: number;
  InitialDifficulty: number;
  DifficultyStep: number;
  InitialMiningReward: number;
  MiningRewardStep: number;
  MaxCoins: number;
}

export const DefaultConsensus: IConsensus = {
  // Number of blocks that need to be mined before the difficulty can be adjusted
  BlockInterval: 10,
  // Initial difficulty
  InitialDifficulty: 1,
  // Difficulty = InitialDifficulty * number of blocks * DifficultyCoefficient
  DifficultyStep: 1,
  // Initial mining reward
  InitialMiningReward: 100,
  // MiningReward = InitialMiningReward / number of blocks * MiningRewardCoefficient
  MiningRewardStep: 0.5,
  // Maximum number of coins
  MaxCoins: 21000000,
};
