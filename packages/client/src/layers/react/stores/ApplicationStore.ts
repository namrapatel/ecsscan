import { Web3Provider } from "@ethersproject/providers";
import { makeAutoObservable, observable, action, autorun } from "mobx";
import { Entity } from "../../loupe/types";
import { MUDProvider } from "../types";

export class ApplicationStore {
  public web3Provider: Web3Provider | null;
  public mudProvider: MUDProvider | null;
  public actingAs: Entity | null;

  constructor() {
    makeAutoObservable(this, {
      actingAs: observable,
      web3Provider: observable,
      mudProvider: observable,
    });
    this.actingAs = null;
    this.web3Provider = null;
    this.mudProvider = null;
  }

  public setActingAs(newEntity: Entity) {
    this.actingAs = newEntity;
  }

  public setWeb3Provider(web3Provider: Web3Provider) {
    this.web3Provider = web3Provider;
  }

  public setMUDProvider(mudProvider: MUDProvider) {
    this.mudProvider = mudProvider;
  }
}
