// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { console } from "forge-std/console.sol";

import { PlayerComponent, ID as PlayerComponentID } from "../components/PlayerComponent.sol";
import { Point1Component, ID as Point1ComponentID } from "../components/Point1Component.sol";
import { Point2Component, ID as Point2ComponentID } from "../components/Point2Component.sol";

uint256 constant ID = uint256(keccak256("system.PointGiver1"));

contract PointGiver1System is System {
  constructor(IWorld _world, address _components, string memory _idString) System(_world, _components, _idString) {}

  function execute(address msgSender, address winnerAddress) public returns (bytes memory) {
    return execute(abi.encode(msgSender, winnerAddress));
  }

  function execute(bytes memory arguments) public returns (bytes memory) {
    (address msgSender, address winnerAddress) = abi.decode(arguments, (address, address));

    require(msgSender == address(world), "system can only be called via World");
    uint256 entity = addressToEntity(winnerAddress);

    PlayerComponent playerComponent = PlayerComponent(getAddressById(components, PlayerComponentID));
    require(playerComponent.has(entity), "Entity must be a Player.");

    Point1Component point1Component = Point1Component(getAddressById(components, Point1ComponentID));
    point1Component.set(entity);
    Point2Component point2Component = Point2Component(getAddressById(components, Point2ComponentID));
    point2Component.set(entity);

    return abi.encode(entity);
  }
}
