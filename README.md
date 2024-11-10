# HPAP - Human Provenance Authenticity Protocol

# Description

Use Human Trusting Technologies such as WOT(Web of Trust) and cubid_score to build a Content Graph of verified human made Art

[HPAP - Human Provenance Authenticity Protocol | Buidls | DoraHacks](https://dorahacks.io/buidl/19411/)

* Art is hashed and shared via [[Blossom]]/[[NIP96]]
* Human uses their Email [[Internet Identifier]] to log into [[Cubid]] and add some stamps to update their [[cubid_score]]
* Human setups up Nostr [[NIP05]] DNS based [[Internet Identifier]] that matches their email [[Internet Identifier]] 
* Human creates and publishes Nostr event articulating their opinion of the art and its metadata using the private key their [[NIP05]] [[Internet Identifier]] points to
* The ID of the Nostr Event is published on the [[Ethereum Attestation Service - EAS]] for [[Proof of History]] purposes, Nostr Events can be easy to retroactively create


#### Sepolia Links

- [Ethereum Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
- [Sepolia RPC and Chain settings | ChainList](https://chainlist.org/chain/11155111)