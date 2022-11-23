// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { console } from "forge-std/console.sol";

import { MasterComponent, ID as MasterComponentID } from "../components/MasterComponent.sol";
import { Point5Component, ID as Point5ComponentID } from "../components/Point5Component.sol";

uint256 constant ID = uint256(keccak256("system.MasterChecker"));

contract MasterCheckerSystem is System {
  constructor(
    IWorld _world,
    address _components,
    string[] memory _readComponentsIds,
    address[] memory _readComponentsAddrs,
    string[] memory _writeComponentsIds,
    address[] memory _writeComponentsAddrs,
    string memory _idString
  )
    System(
      _world,
      _components,
      _readComponentsIds,
      _readComponentsAddrs,
      _writeComponentsIds,
      _writeComponentsAddrs,
      _idString
    )
  {}

  function execute(address msgSender, address winnerAddress) public returns (bytes memory) {
    return execute(abi.encode(msgSender, winnerAddress));
  }

  function execute(bytes memory arguments) public returns (bytes memory) {
    (address msgSender, address winnerAddress) = abi.decode(arguments, (address, address));

    require(msgSender == address(world), "system can only be called via World");
    uint256 entity = addressToEntity(winnerAddress);

    Point5Component point5Component = Point5Component(getAddressById(components, Point5ComponentID));
    require(point5Component.has(entity), "Entity must have point5.");

    MasterComponent masterComponent = MasterComponent(getAddressById(components, MasterComponentID));
    masterComponent.set(entity);

    return abi.encode(entity);
  }
}
