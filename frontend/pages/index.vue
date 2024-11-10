<template>
    <v-form @submit.prevent>
        <v-text-field label="uid" @input="updateRawRelayText" v-model="nostrRelayTextInput"></v-text-field>
        <v-btn class="mt-2" type="submit" @click="addItem" block>Submit</v-btn>
    </v-form>
    <p>{{ JSON.stringify(this.HPAP_response) }}</p>
    <div v-if="HPAP_response != false">
        <p>Internet Identifier: {{ JSON.stringify(HPAP_response.IID) }}</p>
        <p>cubid_score: {{ JSON.stringify(HPAP_response.IID) }}</p>
        <p>AI Genrated: {{ JSON.stringify(HPAP_response.AIGenerated) }}</p>
        <pre>the_nostr_event: {{ JSON.stringify(HPAP_response.the_nostr_event, null, 2) }}</pre>
        <img :src="HPAP_response.content_url"></img>
    </div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid';
import { SimplePool } from "nostr-tools/pool";
import { SchemaRegistry, EAS, NO_EXPIRATION, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers'
import { verifyEvent } from 'nostr-tools'
import { sha256 } from '@noble/hashes/sha2';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'

export default {
    setup() {
        // myrelays = list(map(lambda x: x['name'], objects))
    },
    data() {
        return {
            myrelays: [{
                id: "test",
                name: "wss://relay.newatlantis.top"
            }],
            nostrRelayTextInput: '',
            filterJSON: 'Test',
            JSONValid: false,
            HPAP_input: {
                uid: "0x324897cee471ac2670f8c56d31a691bd542add1f4a88bcfe2494193e397554fa",
                easContractAddress: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
                schemaRegistryContractAddress: "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0",
                provider_http_url: "https://sepolia.infura.io/v3/063b32ba31b3461ebca9646500a22df3",
                relays: [
                    'wss://relay.damus.io/'
                ],
                CUBID_API_KEY: "da46b009-834d-402c-a1d5-e2176a6edfb1",
                DAPP_ID: "54225f25-8fa8-4be7-982c-e9233a89c5a0"
            },
            HPAP_response: false
        }
    },
    methods: {
        async HPAPfromEASUID(EASData) {
            let {
                easContractAddress,
                uid,
                schemaRegistryContractAddress,
                provider_http_url,
                relays
            } = EASData
            uid = this.nostrRelayTextInput
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
            if (nostr_event_data.CID == "" || nostr_event_data.IID == "" || nostr_event_data.AIGenerated == "") {
                return {
                    "status": "error",
                    "description": "Nostr Event Did Not Check Out",
                    "data": {
                        nostr_event_data: nostr_event_data
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
                    "apikey": EASData.CUBID_API_KEY,
                    "dapp_id": EASData.DAPP_ID,
                    "email": nostr_event_data.IID[1],
                    "is_permissive": true
                }),
                headers: { "Content-Type": "application/json" },
            });
            cubid_user_response = await cubid_user_response.json()
            let cubid_user_score_response = await fetch("https://passport.cubid.me/api/v2/score/fetch_score", {
                method: "POST",
                body: JSON.stringify({
                    "apikey": EASData.CUBID_API_KEY,
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
                the_nostr_event: the_nostr_event,
                content_buffer: content_buffer
            }
            this.HPAP_response = return_response
            console.log(this.HPAP_response)
        },
        updateRawRelayText(event) {
            console.log(event.target.value)
            this.nostrRelayTextInput = event.target.value
        },
        updateFilderJSON(event) {
            console.log(event.target.value)
            this.filterJSON = event.target.value
        },
        addItem() {
            this.HPAPfromEASUID(this.HPAP_input)
        },
        removeItem(index) {
            this.myrelays.splice(index, 1);
        },
        validateMyJSON() {
            console.log("Validating JSON")
            try {
                JSON.parse(this.filterJSON)
                this.JSONValid = true

            } catch (error) {
                this.JSONValid = false
            }
        },
        async fetchNostrEvents() {
            const relays = this.myrelays.map(obj => obj.name);
            console.log(relays)
            const pool = new SimplePool();
            const events = await pool.querySync(relays, JSON.parse(this.filterJSON));
            console.log(events)

        }
    }
}
</script>