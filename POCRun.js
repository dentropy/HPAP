import HPAPfromEASUID from "./POCFunction";

// Schema EAS Explorer: https://sepolia.easscan.org/schema/view/0x9908e8cf7836eb73b29fb0d6d946cda72ffa75f903d094c64752f44c0e63f7cf

// EAS Attestation: https://sepolia.easscan.org/attestation/view/0x324897cee471ac2670f8c56d31a691bd542add1f4a88bcfe2494193e397554fa

let EASData = {
    uid : "0x324897cee471ac2670f8c56d31a691bd542add1f4a88bcfe2494193e397554fa",
    easContractAddress : "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    schemaRegistryContractAddress : "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0",
    provider_http_url : "https://sepolia.infura.io/v3/063b32ba31b3461ebca9646500a22df3",
    relays : [
        'wss://relay.damus.io/'
    ]
}

let data = await HPAPfromEASUID(EASData)
console.log(data)

import fs from 'fs'
await fs.writeFileSync("content_buffer", data.content_buffer,  "binary");

process.exit()