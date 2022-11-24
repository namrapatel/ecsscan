// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { console } from "forge-std/console.sol";

import { BlueTrophyComponent, ID as BlueTrophyComponentID } from "../components/BlueTrophyComponent.sol";
import { HasDiamondComponent, ID as HasDiamondComponentID } from "../components/HasDiamondComponent.sol";
import { MasterComponent, ID as MasterComponentID } from "../components/MasterComponent.sol";
import { Point1Component, ID as Point1ComponentID } from "../components/Point1Component.sol";
import { Point2Component, ID as Point2ComponentID } from "../components/Point2Component.sol";
import { Point3Component, ID as Point3ComponentID } from "../components/Point3Component.sol";
import { Point4Component, ID as Point4ComponentID } from "../components/Point4Component.sol";
import { Point5Component, ID as Point5ComponentID } from "../components/Point5Component.sol";

uint256 constant ID = uint256(keccak256("system.Win2"));

contract Win2System is System {
  constructor(IWorld _world, address _components, string memory _idString) System(_world, _components, _idString) {}

  function execute(address msgSender, address winnerAddress) public returns (bytes memory) {
    return execute(abi.encode(msgSender, winnerAddress));
  }

  function execute(bytes memory arguments) public returns (bytes memory) {
    (address msgSender, address winnerAddress) = abi.decode(arguments, (address, address));

    require(msgSender == address(world), "system can only be called via World");
    uint256 entity = addressToEntity(winnerAddress);

    MasterComponent masterComponent = MasterComponent(getAddressById(components, MasterComponentID));
    require(masterComponent.has(entity), "player must be master");
    HasDiamondComponent hasDiamondComponent = HasDiamondComponent(getAddressById(components, HasDiamondComponentID));
    require(hasDiamondComponent.has(entity), "player must have diamond");
    Point1Component point1Component = Point1Component(getAddressById(components, Point1ComponentID));
    require(point1Component.has(entity), "player must have point1");
    Point2Component point2Component = Point2Component(getAddressById(components, Point2ComponentID));
    require(point2Component.has(entity), "player must have point2");
    Point3Component point3Component = Point3Component(getAddressById(components, Point3ComponentID));
    require(point3Component.has(entity), "player must have point3");
    Point4Component point4Component = Point4Component(getAddressById(components, Point4ComponentID));
    require(point4Component.has(entity), "player must have point4");
    Point5Component point5Component = Point5Component(getAddressById(components, Point5ComponentID));
    require(point5Component.has(entity), "player must have point5");

    BlueTrophyComponent blueTrophyComponent = BlueTrophyComponent(getAddressById(components, BlueTrophyComponentID));
    blueTrophyComponent.set(entity);

    return abi.encode(entity);
  }
}
