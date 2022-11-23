// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { console } from "forge-std/console.sol";

import { PlayerComponent, ID as PlayerComponentID } from "../components/PlayerComponent.sol";
import { Point4Component, ID as Point4ComponentID } from "../components/Point4Component.sol";
import { Point5Component, ID as Point5ComponentID } from "../components/Point5Component.sol";

uint256 constant ID = uint256(keccak256("system.Point1Giver"));

contract Point1GiverSystem is System {
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

    PlayerComponent playerComponent = PlayerComponent(getAddressById(components, PlayerComponentID));
    require(playerComponent.has(entity), "Entity must be a Player.");

    Point4Component point4Component = Point4Component(getAddressById(components, Point4ComponentID));
    point4Component.set(entity);
    Point5Component point5Component = Point5Component(getAddressById(components, Point5ComponentID));
    point5Component.set(entity);

    return abi.encode(entity);
  }
}
