// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { console } from "forge-std/console.sol";

import { PointsComponent, ID as PointsComponentID } from "../components/PointsComponent.sol";
import { WinnerComponent, ID as WinnerComponentID } from "../components/WinnerComponent.sol";

uint256 constant ID = uint256(keccak256("system.Init"));

contract InitSystem is System {
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

    WinnerComponent winnerComponent = WinnerComponent(getAddressById(components, WinnerComponentID));
    winnerComponent.set(addressToEntity(initWinner));

    PointsComponent pointsComponent = PointsComponent(getAddressById(components, PointsComponentID));
    pointsComponent.set(addressToEntity(initWinner), 100);
  }
}
