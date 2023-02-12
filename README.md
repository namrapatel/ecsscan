# ecsscan

Backend that loads up a ECS-based World using [MUD](https://github.com/latticexyz/mud/) and builds a graph of the world. That is, the relationships between Entities, Records, and Rules in the given world, thereby creating a networked block explorer; hence ECS Scan.

### Usage

Open two command lines. In the first one, run the following command:

```bash
yarn
yarn start:contracts
```

In the second, once the first has deployed the contracts and started the chain, run:

```bash
cd packages/client
yarn start
```
