// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.15;
pragma abicoder v2;

import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";

import { ExampleComponent, ID as ExampleComponentID } from "../components/ExampleComponent.sol";
import { console } from "forge-std/console.sol";

uint256 constant ID = uint256(keccak256("ember.prototype.Example"));

function ExamplePrototype(IUint256Component components) returns (string memory) {
  console.log("ExamplePrototype constructor");

  ExampleComponent(getAddressById(components, ExampleComponentID)).set(ID, 25);

  return "ExamplePrototype finished";
}
