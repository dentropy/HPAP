# HPAP - Human Provenance Authenticity Protocol

# Description

Use Human Trusting Technologies such as WOT(Web of Trust) and cubid_score to build a Content Graph of verified human made Art

[HPAP - Human Provenance Authenticity Protocol | Buidls | DoraHacks](https://dorahacks.io/buidl/19411/)

* Art is hashed and shared via [[Blossom]]/[[NIP96]]
* Human uses their Email [[Internet Identifier]] to log into [[Cubid]] and add some stamps to update their [[cubid_score]]
* Human setups up Nostr [[NIP05]] DNS based [[Internet Identifier]] that matches their email [[Internet Identifier]] 
* Human creates and publishes Nostr event articulating their opinion of the art and its metadata using the private key their [[NIP05]] [[Internet Identifier]] points to
* The ID of the Nostr Event is published on the [[Ethereum Attestation Service - EAS]] for [[Proof of History]] purposes, Nostr Events can be easy to retroactively create

#### EAS

EAS: Ethereum Attestation Schema: [Schema #2745 - 0x9908...3f7cf](https://sepolia.easscan.org/schema/view/0x9908e8cf7836eb73b29fb0d6d946cda72ffa75f903d094c64752f44c0e63f7cf)

#### Example Nostr Events

- [noStrudel](https://nostrudel.ninja/#/n/nevent1qvzqqqqqqypzpqnhstlkeaw0upej59rsmsue4jel066eyxr6ezx82kh0eqhk49pjqyt8wumn8ghj7ur4wfcxcetjv4kxz7fwvdhk6tcpr4mhxue69uhkummnw3ezucnfw33k76twv4ezuum0vd5kzmp0qqs8ngh4zadkc2f34kytezpzvxwqcrwggkh5nvyapkzt3umjpv58llsnu6yuq)
- [noStrudel](https://nostrudel.ninja/#/n/nevent1qvzqqqqqqypzpqnhstlkeaw0upej59rsmsue4jel066eyxr6ezx82kh0eqhk49pjqyt8wumn8ghj7ur4wfcxcetjv4kxz7fwvdhk6tcpr4mhxue69uhkummnw3ezucnfw33k76twv4ezuum0vd5kzmp0qqsrlze98xwe27zy6rr7hnycr0n25c5w3je2rys8tsfx64h7fv0tnvsahy380)


#### Sepolia Links

- [Ethereum Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
- [Sepolia RPC and Chain settings | ChainList](https://chainlist.org/chain/11155111)