// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { console } from "forge-std/console.sol";

import { SignerComponent, ID as SignerComponentID } from "../components/SignerComponent.sol";

uint256 constant ID = uint256(keccak256("system.CreateSigner"));

contract CreateSignerSystem is System {
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

  function execute(address signerAddr) public returns (bytes memory) {
    return execute(abi.encode(signerAddr));
  }

  function execute(bytes memory arguments) public returns (bytes memory) {
    address signerAddr = abi.decode(arguments, (address));

    // Check that signer has not already been created
    SignerComponent signerComponent = SignerComponent(getAddressById(components, SignerComponentID));
    uint256 signerEntity = addressToEntity(signerAddr);
    require(signerComponent.getValue(signerEntity) == false, "This signer is already registered.");

    // If not created already, create
    signerComponent.set(signerEntity);

    return abi.encode(signerEntity);
  }
}
