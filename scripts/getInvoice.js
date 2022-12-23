const { ethers } = require("hardhat");

async function getInvoice() {
  const ledger = await ethers.getContract("Ledger");

  const buyerPan = "BUYERPAN";
  let ids = await ledger.getInvoiceIds(buyerPan);
  console.log("Id's are: ");
  ids = ids.map((id) => id.toNumber());
  console.log(ids);

  for (id of ids) {
    console.log(`Invoice no ${id}:`);
    const { sellerPan, invoiceAmount, invoiceDate, status } =
      await ledger.getInvoiceById(id);
    console.log(sellerPan, invoiceAmount, invoiceDate, status);
  }
}

getInvoice()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
