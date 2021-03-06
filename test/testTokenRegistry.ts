import { Artifacts } from "../util/artifacts";

const {
  TokenRegistry,
  DummyToken,
} = new Artifacts(artifacts);

contract("TokenRegistry", (accounts: string[]) => {

  const owner = accounts[0];
  const user = accounts[1];
  const emptyAddr = "0x0000000000000000000000000000000000000000";

  let tokenRegistry: any;
  let testTokenAddr: string;
  let lrcAddress: string;
  let eosAddress: string;
  let rdnAddress: string;
  let gtoAddress: string;

  before(async () => {
    tokenRegistry = await TokenRegistry.deployed();
    testTokenAddr = "0x8d01f9bcca92e63a1b2752b22d16e1962aa3c920";

    lrcAddress = await tokenRegistry.getAddressBySymbol("LRC");
    eosAddress = await tokenRegistry.getAddressBySymbol("EOS");
    rdnAddress = await tokenRegistry.getAddressBySymbol("RDN");
    gtoAddress = await tokenRegistry.getAddressBySymbol("GTO");
  });

  describe("owner", () => {

    it("should be able to register a token", async () => {
      await tokenRegistry.registerToken(testTokenAddr, "TEST", {from: owner});
      const isRegistered = await tokenRegistry.areAllTokensRegistered([testTokenAddr]);
      assert.equal(isRegistered, true, "token should be registered");
    });

    it("should be able to unregister a token", async () => {
      let isRegistered = await tokenRegistry.areAllTokensRegistered([testTokenAddr]);
      let addressBySymbol = await tokenRegistry.getAddressBySymbol("TEST");
      assert.equal(isRegistered, true, "token should be registered on start");
      assert.equal(addressBySymbol, testTokenAddr, "token should be registered on start");

      await tokenRegistry.unregisterToken(testTokenAddr, {from: owner});
      isRegistered = await tokenRegistry.areAllTokensRegistered([testTokenAddr]);
      addressBySymbol = await tokenRegistry.getAddressBySymbol("TEST");
      assert.equal(isRegistered, false, "token should be unregistered");
      assert.equal(addressBySymbol, emptyAddr, "token should be unregistered");
    });

    it("should be able to check all tokens registered in array", async () => {
      const tokenList = [lrcAddress, rdnAddress, eosAddress, gtoAddress];
      const allRegistered = await tokenRegistry.areAllTokensRegistered(tokenList);
      assert.equal(allRegistered, true, "all token registered in migration script.");

      tokenList.push(testTokenAddr);
      const allRegistered2 = await tokenRegistry.areAllTokensRegistered(tokenList);
      assert.equal(allRegistered2, false, "not all token registered");
    });

  });

  describe("other users", () => {
    it("should not be able to register a token", async () => {
      // TODO(kongliang)
      assert(true);
    });
  });

});
