import {task} from "hardhat/config";

export default task("block-number", "Prints current block number").setAction(
  async (address, hre) => {
    console.log(
      `Current block number: ${await hre.ethers.provider.getBlockNumber()}`
    );
  }
);
