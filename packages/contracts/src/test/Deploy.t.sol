// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.15;

import { DSTest } from "ds-test/test.sol";

import { Deploy } from "./utils/Deploy.sol";
import { World } from "solecs/World.sol";
import { getComponentById, getAddressById, addressToEntity } from "solecs/utils.sol";
import { IComponent } from "solecs/interfaces/IComponent.sol";
import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";
import { console } from "forge-std/console.sol";
import { entityToAddress } from "solecs/utils.sol";

import { ComponentDevSystem, ID as ComponentDevSystemID } from "../systems/ComponentDevSystem.sol";

// import { ExamplePrototype, ID as ExamplePrototypeID } from "../prototypes/ExamplePrototype.sol";

contract DeployTest is DSTest {
  address internal deployer;

  World internal world;
  IUint256Component components;
  IUint256Component systems;
  Deploy internal deploy = new Deploy();

  function setUp() public {}

  // function testComponentDeployed() public view {
  //   uint256 locationComponent = addressToEntity(
  //     address(ExampleComponent(getAddressById(components, ExampleComponentID)))
  //   );

  //   uint256 fakeEntity = uint256(0);
  //   require(components.has(locationComponent), "Component not registered.");
  //   require(!components.has(fakeEntity), "Component registration not working.");
  //   console.log("Component registration working.");
  // }

  function testSystemDeployed() public {
    world = deploy.deploy(address(0), address(0), false);
    components = world.components();
    systems = world.systems();
    deployer = deploy.deployer();
    uint256 attackSystem = addressToEntity(address(ComponentDevSystem(getAddressById(systems, ComponentDevSystemID))));

    uint256 fakeEntity = uint256(0);
    require(systems.has(attackSystem), "System not registered.");
    require(!systems.has(fakeEntity), "System registration not working.");
    console.log("System registration working.");
  }

  function testAddressBug() public {
    world = deploy.deploy(address(0), address(0), false);
    components = world.components();
    systems = world.systems();
    deployer = deploy.deployer();
    world.registerSystem(address(0x00CAC06Dd0BB4103f8b62D280fE9BCEE8f26fD59), uint256(keccak256("system.buggySystem")));
    uint256[] memory allSystems = systems.getEntities();
    // Turn allSystems from entity (uint256) to address
    address[] memory allSystemAddresses = new address[](allSystems.length);
    for (uint256 i = 0; i < allSystems.length; i++) {
      allSystemAddresses[i] = entityToAddress(allSystems[i]);
    }
    // Log all the system addresses one by one
    for (uint256 i = 0; i < allSystems.length; i++) {
      console.log("System address: %s", allSystems[i]);
    }
  }

  // function testPrototypeCreatesEntity() public {
  //   (bool success, bytes memory data) = address(ExampleComponent(getAddressById(components, ExampleComponentID))).call(
  //     abi.encodeWithSignature("getValue(uint256)", ExamplePrototypeID)
  //   );

  //   uint256 testValue = abi.decode(data, (uint256));
  //   console.log(uint256(keccak256("ember.prototype.Example")));
  //   assertEq(testValue, 25);
  // }
}
