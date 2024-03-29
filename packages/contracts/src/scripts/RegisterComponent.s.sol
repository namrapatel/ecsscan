// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { World } from "solecs/World.sol";
import { IComponent } from "solecs/interfaces/IComponent.sol";
import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";
import { Uint256Component } from "solecs/components/Uint256Component.sol";

// import { ExamplePrototype } from "../prototypes/ExamplePrototype.sol";

// This script can be run with: forge script src/scripts/RegisterComponent.s.sol:RegisterComponent --fork-url http://explorer-technological-lavender-pinnipe-n7pbxkrefy.t.exfac.xyz --broadcast

contract RegisterComponent is Script {
  function run() external {
    uint256 deployerPrivateKey = uint256(0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356);
    vm.startBroadcast(deployerPrivateKey);

    // Uint256Component newComponent = new Uint256Component(
    //   0x5FbDB2315678afecb367f032d93F642f64180aa3,
    //   uint256(keccak256("bigComponent")),
    //   "bigComponent"
    // );

    // There are two ways to register an entity, both require yarn start:contracts to be completed first.

    // 1. Simply set the values for the entity in a forge script.
    // IComponent ec = IComponent(0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0);
    // uint256[] memory entities = ec.getEntities();
    // ec.set(uint256(keccak256("testEntity")), abi.encodePacked(uint256(100)));

    // 2. Register an entity with a prototype (lets you batch a bunch of component.set() calls)
    // IUint256Component components = World(0x5FbDB2315678afecb367f032d93F642f64180aa3).components();
    // ExamplePrototype(components);

    World world = World(0x5FbDB2315678afecb367f032d93F642f64180aa3);
    world.registerSigner();

    vm.stopBroadcast();
  }
}
