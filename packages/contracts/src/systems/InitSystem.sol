// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById } from "solecs/utils.sol";
import { console } from "forge-std/console.sol";

import { ExampleComponent, ID as ExampleComponentID } from "../components/ExampleComponent.sol";
import { defineExample } from "../prototypes/defineExample.sol";

string constant ID_STRING = "system.Init";
uint256 constant ID = uint256(keccak256("system.Init"));

contract InitSystem is System {
  uint256 public readCounter;
  uint256[] public readComponentIds;
  mapping(uint256 => address) public readComponentIdToAddress;

  uint256 public writeCounter;
  uint256[] public writeComponentIds;
  mapping(uint256 => address) public writeComponentIdToAddress;

  uint256 public id;
  string public idString;

  constructor(
    IWorld _world,
    address _components,
    uint256[] memory _readComponentsIds,
    address[] memory _readComponentsAddrs,
    uint256[] memory _writeComponentsIds,
    address[] memory _writeComponentsAddrs,
    string memory _idString
  ) System(_world, _components) {
    // Read components
    require(
      _readComponentsIds.length == _readComponentsAddrs.length,
      "InitSystem: readComponentsIds and readComponentsAddrs must have the same length"
    );
    readCounter = _readComponentsIds.length;
    readComponentIds = _readComponentsIds;
    for (uint256 i = 0; i < readCounter; i++) {
      readComponentIdToAddress[_readComponentsIds[i]] = _readComponentsAddrs[i];
    }

    // Written components
    require(
      _writeComponentsIds.length == _writeComponentsAddrs.length,
      "InitSystem: writeComponentsIds and writeComponentsAddrs must have the same length"
    );
    writeCounter = _writeComponentsIds.length;
    writeComponentIds = _writeComponentsIds;
    for (uint256 i = 0; i < writeCounter; i++) {
      writeComponentIdToAddress[_writeComponentsIds[i]] = _writeComponentsAddrs[i];
    }

    // System ID
    id = ID;
    idString = _idString;
  }

  function getReadComponentIds() public view returns (uint256[] memory) {
    return readComponentIds;
  }

  function getWriteComponentIds() public view returns (uint256[] memory) {
    return writeComponentIds;
  }

  function execute(bytes memory) public returns (bytes memory) {
    ExampleComponent exampleComponent = ExampleComponent(getAddressById(components, ExampleComponentID));
    defineExample(exampleComponent);

    exampleComponent.set(ID, 25);
  }
}
