const { ethers, network } = require("hardhat");
const fs = require("fs");

const FRONT_END_ADDRESS_FILE =
  "../nextjs-invoice/constants/contractAddress.json";
const FRONT_END_ABI_FILE = "../nextjs-invoice/constants/abi.json";

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Updating front end...");
    await updateABI();
    await updateContractAddresses();
  }
};

async function updateABI() {
  const ledger = await ethers.getContract("Ledger");
  fs.writeFileSync(
    FRONT_END_ABI_FILE,
    ledger.interface.format(ethers.utils.FormatTypes.json)
  );
  console.log("Updated ABI");
}

async function updateContractAddresses() {
  const ledger = await ethers.getContract("Ledger");
  const chainId = network.config.chainId.toString();
  const currentAddresses = JSON.parse(
    fs.readFileSync(FRONT_END_ADDRESS_FILE, "utf-8")
  );
  if (chainId in currentAddresses) {
    if (!currentAddresses[chainId].includes(ledger.address)) {
      currentAddresses[chainId].push(ledger.address);
    }
  } else {
    currentAddresses[chainId] = [ledger.address];
  }
  fs.writeFileSync(FRONT_END_ADDRESS_FILE, JSON.stringify(currentAddresses));
  console.log("Updated Address");
}

module.exports.tags = ["all", "frontend"];
