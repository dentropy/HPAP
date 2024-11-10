import { SchemaRegistry, EAS, NO_EXPIRATION, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers'
import { verifyEvent } from 'nostr-tools'
import { SimplePool } from "nostr-tools/pool";
import { sha256 } from '@noble/hashes/sha2';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'

export default async function HPAPfromEASUID(EASData) {
    const {
        easContractAddress,
        uid,
        schemaRegistryContractAddress,
        provider_http_url,
        relays
    } = EASData
    // Get the Data for the Attestation
    // Setup Provider
    // https://docs.attest.org/docs/developer-tools/eas-sdk#getting-an-attestation
    // The list from the attestation matches to the JSON items in the docs linked in the above line
    let provider = new ethers.JsonRpcProvider(provider_http_url)
    const eas = new EAS(easContractAddress);
    eas.connect(provider);
    const attestation = await eas.getAttestation(uid);
    const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
    schemaRegistry.connect(provider);
    const schemaRecord = await schemaRegistry.getSchema({ uid: attestation[1] });
    let schemaEncoder = new SchemaEncoder(schemaRecord[3])
    let decodeData = schemaEncoder.decodeData(attestation[9])
    // console.log("Able to decode data from EAS(Ethereum Attestation Service\n")



    // Get Nostr Event
    const nostrGet = async (relays, filter) => {
        const pool = new SimplePool();
        const events = await pool.querySync(relays, filter);
        return events;
    };
    let nostr_filter = {
        "ids": [decodeData[0].value.value],
    };
    let nostr_events = await nostrGet(relays, nostr_filter)
    let the_nostr_event = nostr_events[0]
    if (!verifyEvent(the_nostr_event)) {
        return {
            "status": "error",
            "data": "Nostr Event Did Not Check Out"
        }
    }
    // Get the CID, IID(Internet Identifier), and AI Generated Fact
    let nostr_event_data = {
        CID: "",
        IID: "",
        AIGenerated: ""
    }
    for (let element of the_nostr_event.tags) {
        if (element[0] == "CID") {
            nostr_event_data.CID = element
        }
    }
    // Get the IID
    for (let element of the_nostr_event.tags) {
        if (element[0] == "IID") {
            nostr_event_data.IID = element
        }
    }
    // Get the AIGenerated
    for (let element of the_nostr_event.tags) {
        if (element[0] == "AIGenerated") {
            nostr_event_data.AIGenerated = element
        }
    }
    if(nostr_event_data.CID == "" || nostr_event_data.IID == "" || nostr_event_data.AIGenerated == ""){
        return {
            "status": "error",
            "description": "Nostr Event Did Not Check Out",
            "data": {
                nostr_event_data : nostr_event_data
            }
        }
    }
    // console.log("Got Nostr event mentioned on EAS")
    // console.log(nostr_event_data)



    // Validate NIP05
    let username = nostr_event_data.IID[1].split("@")[0]
    let domain_name = nostr_event_data.IID[1].split("@")[1]
    let response = await fetch(`https://${domain_name}/.well-known/nostr.json?name=${username}`)
    response = await response.json()
    if (response.names[username] != the_nostr_event.pubkey) {
        return {
            "status": "error",
            "data": "NIP05 Verification Failed"
        }
    }



    // Get the actual content and validate it
    let content = await fetch(nostr_event_data.CID[2])
    let content_buffer = await content.arrayBuffer()
    let content_hex_hash = bytesToHex(sha256(new Uint8Array(content_buffer)))
    if (nostr_event_data.CID[1].toLowerCase() != content_hex_hash.toLowerCase()) {
        return {
            "status": "error",
            "data": "The content hash at the URL does not match"
        }
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
    let cubid_user_score_response = await fetch("https://passport.cubid.me/api/v2/score/fetch_score", {
        method: "POST",
        body: JSON.stringify({
            "apikey": process.env.CUBID_API_KEY,
            "user_id": cubid_user_response.user_id
        }),
        headers: { "Content-Type": "application/json" },
    });
    cubid_user_score_response = await cubid_user_score_response.json()
    let return_response = {
        content_url: nostr_event_data.CID[2],
        IID: nostr_event_data.IID[1],
        CID: nostr_event_data.CID[1],
        cubid_score: cubid_user_score_response.cubid_score,
        AIGenerated: nostr_event_data.AIGenerated[1],
        nostr_event_data: nostr_event_data,
        content_buffer: content_buffer
    }
    return return_response
}
