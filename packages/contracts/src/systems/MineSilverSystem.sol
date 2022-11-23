// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { console } from "forge-std/console.sol";

import { HasSilverComponent, ID as HasSilverComponentID } from "../components/HasSilverComponent.sol";
import { PlayerComponent, ID as PlayerComponentID } from "../components/PlayerComponent.sol";

uint256 constant ID = uint256(keccak256("system.MineSilver"));

contract MineSilverSystem is System {
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

  function execute(address msgSender, address playerAddress) public returns (bytes memory) {
    return execute(abi.encode(msgSender, playerAddress));
  }

  function execute(bytes memory arguments) public returns (bytes memory) {
    (address msgSender, address playerAddress) = abi.decode(arguments, (address, address));

    require(msgSender == address(world), "system can only be called via World");
    uint256 entity = addressToEntity(playerAddress);

    PlayerComponent playerComponent = PlayerComponent(getAddressById(components, PlayerComponentID));
    require(playerComponent.has(entity), "Entity must be a Player.");

    HasSilverComponent hasSilverComponent = HasSilverComponent(getAddressById(components, HasSilverComponentID));
    hasSilverComponent.set(entity);

    return abi.encode(entity);
  }
}