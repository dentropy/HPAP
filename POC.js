// Start with Attestation
import { SchemaRegistry, EAS, NO_EXPIRATION, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers'
// Set EAS Settings
const easContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
const uid = "0x324897cee471ac2670f8c56d31a691bd542add1f4a88bcfe2494193e397554fa";
const schemaRegistryContractAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";
const schemaUID = "0x9908e8cf7836eb73b29fb0d6d946cda72ffa75f903d094c64752f44c0e63f7cf";
// Setup Provider
let http_url = "https://sepolia.infura.io/v3/063b32ba31b3461ebca9646500a22df3"
let provider = new ethers.JsonRpcProvider(http_url)
// Get the Data for the Attestation
const eas = new EAS(easContractAddress);
eas.connect(provider);
const attestation = await eas.getAttestation(uid);
console.log(Object.keys(attestation));
for(var item of attestation){
    console.log("")
    console.log(item)
}
// Get the schema from the EAS Registry
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
schemaRegistry.connect(provider);
const schemaRecord = await schemaRegistry.getSchema({ uid: schemaUID });
console.log("schemaRecord")
console.log(schemaRecord)
console.log(typeof(schemaRecord))
console.log(Object.keys(schemaRecord))
console.log(String(schemaRecord))
let schemaEncoder = new SchemaEncoder(schemaRecord[3])
console.log("item")
console.log(attestation)
let decodeData = schemaEncoder.decodeData(attestation[9])
console.log(decodeData)




// Get Nostr Event

import { verifyEvent } from 'nostr-tools'
import { SimplePool } from "nostr-tools/pool";
import { nip19 } from 'nostr-tools'
let relays = [
    'wss://relay.damus.io/'
]
export const nostrGet = async (relays, filter) => {
    const pool = new SimplePool();
    const events = await pool.querySync(relays, filter);
    pool.publi
    console.log("events");
    console.log(events);
    return events;
};
let unix_time = Math.floor((new Date()).getTime() / 1000);
let nostr_filter = {
    "ids": [decodeData[0].value.value],
    // since: unix_time - 1000000,
    // authors: [npub],
    // kinds: [4],
    // "#p": npub
  };
let nostr_events = await nostrGet(relays, nostr_filter)
let the_nostr_event = nostr_events[0]
if( !verifyEvent(the_nostr_event)){
    console.log("Nostr Event Did Not Check Out")
    process.exit()
}
console.log(the_nostr_event)
// Get the CID
let nostr_event_data = {
    CID : "",
    IID : "",
    AIGenerated: ""
}
for(let element of the_nostr_event.tags){
    if(element[0] == "CID"){
        nostr_event_data.CID = element
    }
}
// Get the IID
for(let element of the_nostr_event.tags){
    if(element[0] == "IID"){
        nostr_event_data.IID = element
    }
}
// Get the AIGenerated
for(let element of the_nostr_event.tags){
    if(element[0] == "AIGenerated"){
        nostr_event_data.AIGenerated = element
    }
}
console.log(nostr_event_data)


// Validate NIP05

// For Testing
// let nostr_event_data = {}
// nostr_event_data.IID = "paul@ddaemon.org"
console.log("nostr_event_data")
console.log(nostr_event_data)


import {  useFetchImplementation, queryProfile, NIP05_REGEX, isNip05 } from 'nostr-tools/nip05'
let username = nostr_event_data.IID[1].split("@")[0]
let domain_name = nostr_event_data.IID[1].split("@")[1]
let profile = await queryProfile(String(domain_name))
let response = await fetch(`https://${domain_name}/.well-known/nostr.json?name=${username}`)
response = await response.json()
if(response.names[username] != the_nostr_event.pubkey){
    console.log("NIP05 Verification Failed")
    process.exit()
} else {
    console.log("NIP05 Verification SUCCESS")
}

// Get the actual content and validate it
import { sha256 } from '@noble/hashes/sha2';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'
let content = await fetch("https://blossom.newatlantis.top/eca61dae93d2bde2c7eefd764cdbc8c31650a41d5da742b67e6efcd8931ae596")
let content_buffer = await content.arrayBuffer()
let content_hex_hash = bytesToHex(sha256(new Uint8Array(content_buffer)))
if(nostr_event_data.CID[1].toLowerCase() != content_hex_hash.toLowerCase()){
    console.log("The content hash at the URL does not match")
    process.exit()
} else {
    console.log("Content hash matches")
}

// Get Cubid Cubid Score
let cubid_user_response = await fetch("https://passport.cubid.me/api/v2/create_user", {
    method: "POST",
    body: JSON.stringify({ 
        "apikey": process.env.CUBID_API_KEY,
        "dapp_id": process.env.DAPP_ID,
        "email": nostr_event_data.IID[1],
        "is_permissive": true 
    }),
    headers: { "Content-Type": "application/json" },
});
cubid_user_response = await cubid_user_response.json()
console.log(cubid_user_response)

let cubid_user_score_response = await fetch("https://passport.cubid.me/api/v2/score/fetch_score", {
    method: "POST",
    body: JSON.stringify({ 
        "apikey": process.env.CUBID_API_KEY,
        "user_id": cubid_user_response.user_id
    }),
    headers: { "Content-Type": "application/json" },
});
cubid_user_score_response = await cubid_user_score_response.json()
console.log(cubid_user_score_response)