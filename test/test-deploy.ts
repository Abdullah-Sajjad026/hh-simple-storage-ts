import * as hre from "hardhat";
import * as chai from "chai";
import {SimpleStorage__factory, SimpleStorage} from "../typechain-types";

describe("SimpleStorage", async function () {
  let SimpleStorageFactory: SimpleStorage__factory, contract: SimpleStorage;

  beforeEach(async () => {
    SimpleStorageFactory = (await hre.ethers.getContractFactory(
      "SimpleStorage"
    )) as SimpleStorage__factory;
    contract = await SimpleStorageFactory.deploy();
  });

  it("Should start with a number of 0", async function () {
    const currentValue = await contract.getStoredNumber();
    chai.assert.equal(currentValue.toString(), "0");
  });

  it("Should update when we call setNumber", async () => {
    const expectedNumber = "19";
    const transactionResponse = await contract.setNumber(expectedNumber);
    await transactionResponse.wait(1);

    const currentNumber = await contract.getStoredNumber();

    chai.assert.equal(currentNumber.toString(), expectedNumber);
  });

  it("Should add a person with name and number", async function () {
    const person = {name: "Ahmad", number: "28"};
    const transactionResponse = await contract.addPerson(
      person.number,
      person.name
    );
    await transactionResponse.wait(1);

    const {number, name} = await contract.personsArray(0);
    chai.assert.equal(name, person.name);
  });
});
