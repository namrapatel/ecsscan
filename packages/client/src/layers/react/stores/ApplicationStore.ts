import { Web3Provider } from "@ethersproject/providers";
import { makeAutoObservable, observable, action, autorun } from "mobx";
import { Entity, World } from "../../loupe/types";
import { Persona } from "../types";
import { World as mudWorld } from "@latticexyz/recs";

export class ApplicationStore {
  public world: World | null = null;
  public mudWorld: mudWorld | null = null;
  public web3Provider: Web3Provider | null;
  public signerEntity: Persona | null;

  constructor() {
    makeAutoObservable(this, {
      world: observable,
      mudWorld: observable,
      web3Provider: observable,
      signerEntity: observable,
      setWeb3Provider: action,
      setWorld: action,
      setSignerEntity: action,
    });
    this.world = null;
    this.mudWorld = null;
    this.mudWorld = null;
    this.web3Provider = null;
    this.signerEntity = null;
  }

  public setWorld(world: World) {
    this.world = world;
  }

  public setMUDWorld(mudWorld: mudWorld) {
    this.mudWorld = mudWorld;
  }

  public setWeb3Provider(web3Provider: Web3Provider) {
    this.web3Provider = web3Provider;
  }

  public setSignerEntity(signerEntity: Persona) {
    this.signerEntity = signerEntity;
  }
}
