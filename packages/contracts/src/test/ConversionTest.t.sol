// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import { DSTest } from "ds-test/test.sol";
import { World } from "solecs/World.sol";
import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";
import { Cheats } from "./utils/Cheats.sol";
import { Utilities } from "./utils/Utilities.sol";
import { Deploy } from "./utils/Deploy.sol";
import { componentsComponentId, systemsComponentId } from "solecs/constants.sol";
import { getAddressById } from "solecs/utils.sol";
import { console } from "forge-std/console.sol";

contract ConverstionTest is DSTest {
  Cheats internal immutable vm = Cheats(HEVM_ADDRESS);
  Utilities internal immutable utils = new Utilities();

  address payable internal alice;
  address payable internal bob;
  address payable internal eve;
  address internal deployer;

  function setUp() public {
    address testAddr = 0x9F33beCA6a8ee09df84015b73c00f4114B933Cd2;
    uint256 result = uint256(uint160(testAddr));
    console.log(result);
  }

  function testFail() public {
    address testAddr = 0x9F33beCA6a8ee09df84015b73c00f4114B933Cd2;
    uint256 result = uint256(uint160(testAddr));
    console.log(result);
  }
}
