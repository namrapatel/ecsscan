// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { console } from "forge-std/console.sol";

import { PointsComponent, ID as PointsComponentID } from "../components/PointsComponent.sol";
import { WinnerComponent, ID as WinnerComponentID } from "../components/WinnerComponent.sol";

uint256 constant ID = uint256(keccak256("system.Increment"));

contract IncrementSystem is System {
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

  function execute(
    address msgSender,
    address addrToIncrement,
    uint256 incrementNum
  ) public returns (bytes memory) {
    return execute(abi.encode(msgSender, addrToIncrement, incrementNum));
  }

  function execute(bytes memory arguments) public returns (bytes memory) {
    (address msgSender, address addrToIncrement, uint256 incrementNum) = abi.decode(
      arguments,
      (address, address, uint256)
    );

    require(msgSender == address(world), "System can only be called via World");
    PointsComponent pointsComponent = PointsComponent(getAddressById(components, PointsComponentID));
    uint256 entity = addressToEntity(addrToIncrement);
    uint256 prevPoints = pointsComponent.getValue(entity);
    uint256 newPoints = prevPoints + incrementNum;
    pointsComponent.set(entity, newPoints);

    if (newPoints > 1000) {
      WinnerComponent winnerComponent = WinnerComponent(getAddressById(components, WinnerComponentID));
      winnerComponent.set(entity);
    }
  }
}
