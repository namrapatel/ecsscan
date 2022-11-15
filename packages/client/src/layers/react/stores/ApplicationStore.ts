import { Web3Provider } from "@ethersproject/providers";
import { makeAutoObservable, observable, action, autorun } from "mobx";
import { Entity, SignerEntity } from "../../loupe/types";

export class ApplicationStore {
  public web3Provider: Web3Provider | null;
  public signerEntity: SignerEntity | null;
  public actingAs: Entity | null;

  constructor() {
    makeAutoObservable(this, {
      actingAs: observable,
      web3Provider: observable,
      signerEntity: observable,
      setActingAs: action,
      setWeb3Provider: action,
    });
    this.actingAs = null;
    this.web3Provider = null;
    this.signerEntity = null;
  }

  public setActingAs(newEntity: Entity) {
    this.actingAs = newEntity;
  }

  public setWeb3Provider(web3Provider: Web3Provider) {
    this.web3Provider = web3Provider;
  }

  public setSignerEntity(signerEntity: SignerEntity) {
    this.signerEntity = signerEntity;
  }
}
