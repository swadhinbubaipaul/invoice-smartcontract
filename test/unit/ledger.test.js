const { assert, expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { network, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

const BUYERPAN = "BUYERPAN";
const SELLERPAN = "SELLERPAN";
const INVOICEAMOUNT = 1000;
const INVOICEDATE = "22-12-22";
const STATUS = "paid";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Ledger Contract", function () {
      async function deployTokenFixture() {
        const Ledger = await ethers.getContractFactory("Ledger");
        const ledger = await Ledger.deploy();
        await ledger.deployed();
        return { ledger };
      }

      describe("saveInvoice", function () {
        it("should revert on empty buyerPan", async function () {
          const { ledger } = await loadFixture(deployTokenFixture);

          await expect(
            ledger.saveInvoice(
              "",
              SELLERPAN,
              INVOICEAMOUNT,
              INVOICEDATE,
              STATUS
            )
          ).to.be.revertedWithCustomError(ledger, "EmptyDetailsEntered");
        });

        it("should revert on empty sellerPan", async function () {
          const { ledger } = await loadFixture(deployTokenFixture);

          await expect(
            ledger.saveInvoice(BUYERPAN, "", INVOICEAMOUNT, INVOICEDATE, STATUS)
          ).to.be.revertedWithCustomError(ledger, "EmptyDetailsEntered");
        });

        it("should revert on 0 invoice amount", async function () {
          const { ledger } = await loadFixture(deployTokenFixture);

          await expect(
            ledger.saveInvoice(BUYERPAN, SELLERPAN, 0, INVOICEDATE, STATUS)
          ).to.be.revertedWithCustomError(ledger, "EmptyDetailsEntered");
        });

        it("should revert on empty invoice date", async function () {
          const { ledger } = await loadFixture(deployTokenFixture);

          await expect(
            ledger.saveInvoice(BUYERPAN, SELLERPAN, INVOICEAMOUNT, "", STATUS)
          ).to.be.revertedWithCustomError(ledger, "EmptyDetailsEntered");
        });

        it("should revert on empty status", async function () {
          const { ledger } = await loadFixture(deployTokenFixture);

          await expect(
            ledger.saveInvoice(
              INVOICEAMOUNT,
              SELLERPAN,
              INVOICEAMOUNT,
              INVOICEDATE,
              ""
            )
          ).to.be.revertedWithCustomError(ledger, "EmptyDetailsEntered");
        });
      });

      describe("getInvoiceIds", function () {
        it("gets invoice ids for a buyerPan", async function () {
          const { ledger } = await loadFixture(deployTokenFixture);
          await ledger.saveInvoice(
            BUYERPAN,
            SELLERPAN,
            INVOICEAMOUNT,
            INVOICEDATE,
            STATUS
          );
          let ids = await ledger.getInvoiceIds(BUYERPAN);
          ids = ids.map((id) => id.toNumber());
          assert(ids[0] === 0);
        });
      });

      describe("getInvoiceById", function () {
        it("gets invoice for invoiceId", async function () {
          const { ledger } = await loadFixture(deployTokenFixture);
          let ids = await ledger.getInvoiceIds(BUYERPAN);
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
