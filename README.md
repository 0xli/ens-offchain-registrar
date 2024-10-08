# ENS Offchain Registrar

This repo builds on top of [ensdomains/offchain-resolver](https://github.com/ensdomains/offchain-resolver) to demonstrate what is effectively an offchain subname registrar for ENS names.

Note: This repo does not include a resolver contract. You can [find that here](https://github.com/ensdomains/offchain-resolver/blob/main/packages/contracts), or use [ccip.tools](https://ccip.tools/) to easily deploy it.

## [Gateway](worker/README.md)

[Cloudflare Worker](https://developers.cloudflare.com/workers/) is used as the [CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) gateway. [Cloudflare D1](https://developers.cloudflare.com/d1/) is used to store name data.

These choices allow for a scalable namespace with low cost (store up to 1M names for free), low latency, and high availability.

## [Frontend](web/README.md)

A bare bones Next.js app that allows users to easily register subnames (i.e. POST to the Cloudflare worker's API) by signing a message with their wallet.

##beagles.eth
used to be managed by a subdomain contract
```
https://etherscan.io/address/0xe38bcae0fb14dd33784389ba76757591fc16bbbd#code
```
#### 1 in order to change the resolver set the manager back to self
https://app.ens.domains/beagles.eth?tab=ownership
#### 2 deploy Resolver on ccip.tools
Transaction Fee:
0.001102547617165698 ETH ($3.71)

```
https://ens-gateway.beaglechat.workers.dev/lookup/{sender}/{data}.json
[0x67548a3c43819643390A9Aa5E0BCB284422DEA86,0x013aA72c583083726919631B7DcF54E4b4C5F237]
https://etherscan.io/tx/0x6ca567764d95d05856d9749bc1d3d8092b55e554bf32f5bf04652b23f6f0438c#eventlog
```
0x71B81d547de647D94a1892817c2Bc9BC93c5bAdd
https://etherscan.io/address/0x71b81d547de647d94a1892817c2bc9bc93c5badd#internaltx
#### 3 change the resolver to 0x71B81d547de647D94a1892817c2Bc9BC93c5bAdd
https://app.ens.domains/beagles.eth?tab=more
