// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { console } from "forge-std/console.sol";

import { HasDiamondComponent, ID as HasDiamondComponentID } from "../components/HasDiamondComponent.sol";
import { HasGoldComponent, ID as HasGoldComponentID } from "../components/HasGoldComponent.sol";
import { HasSilverComponent, ID as HasSilverComponentID } from "../components/HasSilverComponent.sol";
import { RedTrophyComponent, ID as RedTrophyComponentID } from "../components/RedTrophyComponent.sol";

uint256 constant ID = uint256(keccak256("system.Win1"));

contract Win1System is System {
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

  function execute(address msgSender, address initWinner) public returns (bytes memory) {
    return execute(abi.encode(msgSender, initWinner));
  }

  function execute(bytes memory arguments) public returns (bytes memory) {
    (address msgSender, address initWinner) = abi.decode(arguments, (address, address));

    require(msgSender == address(world), "system can only be called via World");
    uint256 entity = addressToEntity(initWinner);

    HasDiamondComponent hasDiamondComponent = HasDiamondComponent(getAddressById(components, HasDiamondComponentID));
    HasGoldComponent hasGoldComponent = HasGoldComponent(getAddressById(components, HasGoldComponentID));
    HasSilverComponent hasSilverComponent = HasSilverComponent(getAddressById(components, HasSilverComponentID));
    require(hasDiamondComponent.has(entity), "player must have diamond");
    require(hasGoldComponent.has(entity), "player must have gold");
    require(hasSilverComponent.has(entity), "player must have silver");

    RedTrophyComponent redTrophyComponent = RedTrophyComponent(getAddressById(components, RedTrophyComponentID));
    redTrophyComponent.set(entity);

    return abi.encode(entity);
  }
}
