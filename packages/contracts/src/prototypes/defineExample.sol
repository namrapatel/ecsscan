// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";
import { getAddressById } from "solecs/utils.sol";

import { ExampleComponent, ID as ExampleComponentID } from "../components/ExampleComponent.sol";

uint256 constant ID = uint256(keccak256("fakeEntityID"));

function defineExample(ExampleComponent exampleComponent) {
  exampleComponent.set(ID, 25);
}
