const { ethers } = require("hardhat");

async function saveInvoice() {
  const ledger = await ethers.getContract("Ledger");
  const buyerPan = "BUYERPAN";
  const selerPan = "SELLERPAN";
  const invoiceAmount = 1000;
  const invoiceDate = "22-12-22";
  const status = true;
  const tx = await ledger.saveInvoice(
    buyerPan,
    selerPan,
    invoiceAmount,
    invoiceDate,
    status
  );
  await tx.wait(1);
}

saveInvoice()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
