// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { console } from "forge-std/console.sol";

import { SlyComponent, ID as SlyComponentID } from "../components/SlyComponent.sol";
import { WowComponent, ID as WowComponentID } from "../components/WowComponent.sol";
import { RedTrophyComponent, ID as RedTrophyComponentID } from "../components/RedTrophyComponent.sol";

uint256 constant ID = uint256(keccak256("system.BackdoorWin"));

contract BackdoorWinSystem is System {
  constructor(IWorld _world, address _components, string memory _idString) System(_world, _components, _idString) {}

  function execute(address msgSender, address playerAddress) public returns (bytes memory) {
    return execute(abi.encode(msgSender, playerAddress));
  }

  function execute(bytes memory arguments) public returns (bytes memory) {
    (address msgSender, address playerAddress) = abi.decode(arguments, (address, address));

    require(msgSender == address(world), "system can only be called via World");
    uint256 entity = addressToEntity(playerAddress);

    SlyComponent slyComponent = SlyComponent(getAddressById(components, SlyComponentID));
    require(slyComponent.has(entity), "Entity must be sly.");
    WowComponent wowComponent = WowComponent(getAddressById(components, WowComponentID));
    require(wowComponent.has(entity), "Entity must be wowing.");

    RedTrophyComponent redTrophyComponent = RedTrophyComponent(getAddressById(components, RedTrophyComponentID));
    redTrophyComponent.set(entity);

    return abi.encode(entity);
  }
}
