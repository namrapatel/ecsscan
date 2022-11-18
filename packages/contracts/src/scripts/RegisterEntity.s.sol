// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { World } from "solecs/World.sol";
import { IComponent } from "solecs/interfaces/IComponent.sol";
import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";

// import { ExamplePrototype } from "../prototypes/ExamplePrototype.sol";

// This script can be run with: forge script src/scripts/RegisterEntity.s.sol:RegisterEntity --fork-url http://explorer-technological-lavender-pinnipe-n7pbxkrefy.t.exfac.xyz --broadcast

contract RegisterEntity is Script {
  function run() external {
    uint256 deployerPrivateKey = uint256(0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97);
    vm.startBroadcast(deployerPrivateKey);

    // There are two ways to register an entity, both require yarn start:contracts to be completed first.

    // 1. Simply set the values for the entity in a forge script.
    // IComponent ec = IComponent(0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26);
    // uint256[] memory entities = ec.getEntities();
    // ec.set(uint256(keccak256("testEntity")), abi.encodePacked(uint256(100)));

    // 2. Register an entity with a prototype (lets you batch a bunch of component.set() calls)
    // IUint256Component components = World(0x5FbDB2315678afecb367f032d93F642f64180aa3).components();
    // ExamplePrototype(components);

    vm.stopBroadcast();
  }
}
