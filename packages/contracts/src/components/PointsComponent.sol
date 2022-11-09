// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "std-contracts/components/Uint256Component.sol";

uint256 constant ID = uint256(keccak256("component.Points"));

contract PointsComponent is Uint256Component {
  constructor(address world, string memory idString) Uint256Component(world, ID, idString) {}
}
