// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById } from "solecs/utils.sol";

import { ExampleComponent, ID as ExampleComponentID } from "../components/ExampleComponent.sol";
import { defineExample } from "../prototypes/defineExample.sol";

uint256 constant ID = uint256(keccak256("system.Init"));

contract InitSystem is System {
  uint256 counter;
  mapping(uint256 => address) public readComponentIdToAddress;

  constructor(
    IWorld _world,
    address _components,
    uint256[] memory _readComponentsIds,
    address[] memory readComponentsAddrs
  ) System(_world, _components) {
    require(
      _readComponentsIds.length == readComponentsAddrs.length,
      "InitSystem: readComponentsIds and readComponentsAddrs must have the same length"
    );
    counter = _readComponentsIds.length;
    for (uint256 i = 0; i < counter; i++) {
      readComponentIdToAddress[_readComponentsIds[i]] = readComponentsAddrs[i];
    }
  }

  function execute(bytes memory) public returns (bytes memory) {
    ExampleComponent exampleComponent = ExampleComponent(getAddressById(components, ExampleComponentID));
    defineExample(exampleComponent);

    exampleComponent.set(ID, 25);
  }
}
