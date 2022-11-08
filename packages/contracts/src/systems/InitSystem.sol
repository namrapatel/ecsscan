// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById } from "solecs/utils.sol";
import { console } from "forge-std/console.sol";

import { defineExample } from "../prototypes/defineExample.sol";

string constant ID_STRING = "system.Init";
uint256 constant ID = uint256(keccak256("system.Init"));

contract InitSystem is System {
  uint256 public readCounter;
  string[] public readComponentIds;
  mapping(string => address) public readComponentIdToAddress;

  uint256 public writeCounter;
  string[] public writeComponentIds;
  mapping(string => address) public writeComponentIdToAddress;

  uint256 public id;
  string public idString;

  constructor(
    IWorld _world,
    address _components,
    string[] memory _readComponentsIds,
    address[] memory _readComponentsAddrs,
    string[] memory _writeComponentsIds,
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

  function getReadComponentIds() public view returns (string[] memory) {
    return readComponentIds;
  }

  function getWriteComponentIds() public view returns (string[] memory) {
    return writeComponentIds;
  }

  function getMetadataURL() public pure returns (string memory) {
    return "fakeURL";
  }

  function execute(bytes memory) public returns (bytes memory) {}
}
