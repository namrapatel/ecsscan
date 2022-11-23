// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "std-contracts/components/BoolComponent.sol";

uint256 constant ID = uint256(keccak256("component.Point5"));

contract Point5Component is BoolComponent {
  constructor(address world, string memory idString) BoolComponent(world, ID, idString) {}
}
