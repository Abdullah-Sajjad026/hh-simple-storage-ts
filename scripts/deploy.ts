import "@nomiclabs/hardhat-etherscan";
import "dotenv/config";
import * as hre from "hardhat";

async function main() {
  const SimpleStorageFactory = await hre.ethers.getContractFactory(
    "SimpleStorage"
  );
  console.log("Deploying SimpleStorage Contract ...");
  const contract = await SimpleStorageFactory.deploy();
  await contract.deployed();
  console.log(`Contract deployed to address: ${contract.address}`);

  // verifying if on goerli-testnet and have etherscan api key
  if (hre.network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    // waiting 5 block confirmations before verifying to make sure etherscan has indexed the transaction
    console.log(
      "Waiting block confirmations before verifying the contract ..."
    );
    await contract.deployTransaction.wait(5);
    await verify(contract.address, []);
  }

  const number = await contract.getStoredNumber();
  console.log(`Number is ${number}`);
  const transactionResponse = await contract.setNumber(9);
  await transactionResponse.wait(1);
  console.log(`Updated number is ${await contract.getStoredNumber()}`);
}

async function verify(contractAddress: string, args: any[]) {
  console.log("Verifying deployed contract ...");
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified"))
      console.log("Already Verified");
    else console.log(error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
