import { Web3Provider } from "@ethersproject/providers";
import { makeAutoObservable, observable, action, autorun } from "mobx";
import { SignerEntity, MUDProvider } from "../types";

export class ApplicationStore {
  public web3Provider: Web3Provider | null;
  public mudProvider: MUDProvider | null;
  public actingAs: SignerEntity | null;

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

  public setActingAs(signerEntity: SignerEntity) {
    this.actingAs = signerEntity;
  }

  public setWeb3Provider(web3Provider: Web3Provider) {
    this.web3Provider = web3Provider;
  }

  public setMUDProvider(mudProvider: MUDProvider) {
    this.mudProvider = mudProvider;
  }
}
