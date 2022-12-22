const { assert } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Ledger Unit Tests", function () {
      let ledger, ledgerContract;
      beforeEach(async () => {
        accounts = await ethers.getSigners(); // could also do with getNamedAccounts
        deployer = accounts[0];
        await deployments.fixture(["all"]);
        ledgerContract = await ethers.getContract("Ledger");
        ledger = ledgerContract.connect(deployer);
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
      });

      describe("getInvoiceIds", function () {
        it("gets invoice ids for a buyerPan", async function () {
          const buyerPan = "BUYERPAN";
          let ids = await ledger.getInvoiceIds(buyerPan);
          console.log("Id's are: ");
          ids = ids.map((id) => id.toNumber());
          assert(ids[0] === 0);
        });
      });

      describe("getInvoiceById", function () {
        it("gets invoice for invoiceId", async function () {
          const buyerPan = "BUYERPAN";
          const SELLERPAN = "SELLERPAN";
          const INVOICEAMOUNT = 1000;
          const INVOICEDATE = "22-12-22";
          const STATUS = true;
          let ids = await ledger.getInvoiceIds(buyerPan);
          ids = ids.map((id) => id.toNumber());

          for (id of ids) {
            const { sellerPan, invoiceAmount, invoiceDate, status } =
              await ledger.getInvoiceById(id);
            assert(
              sellerPan === SELLERPAN,
              invoiceAmount.toString() === INVOICEAMOUNT,
              invoiceDate === INVOICEDATE,
              status === STATUS
            );
          }
        });
      });
    });
