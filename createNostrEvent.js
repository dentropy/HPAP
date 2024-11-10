import { generateSecretKey, getPublicKey } from 'nostr-tools'
import { generateSeedWords, validateWords, privateKeyFromSeedWords } from 'nostr-tools/nip06'
import * as nip19 from 'nostr-tools/nip19'

// const mnemonic = "curve foster stay broccoli equal icon bamboo champion casino impact will damp"
// let mnemonic_validation = validateWords(mnemonic)
// let secret_key = privateKeyFromSeedWords(mnemonic, "", 0)


let secret_key = nip19.decode("nsec190tamgf2fdj5lgnhcpx50fx3w3rvneahav3xa4r5y9umdlcrzq8qmmuf32").data
let public_key = getPublicKey(secret_key)


import { finalizeEvent, verifyEvent } from 'nostr-tools'

let signedEvent = finalizeEvent({
    kind: 1,
    created_at: Math.floor(Date.now() / 1000),
    tags: [
        [
            "CID",
            "eca61dae93d2bde2c7eefd764cdbc8c31650a41d5da742b67e6efcd8931ae596",
            "https://blossom.newatlantis.top/eca61dae93d2bde2c7eefd764cdbc8c31650a41d5da742b67e6efcd8931ae596"
        ],
        [
            "IID",
            "paul@ddaemon.org"
        ],
        [
            "AIGenerated",
            "false"
        ]
    ],
    content: 'My Profile Pic',
}, secret_key)

let isGood = verifyEvent(signedEvent)

// signedEvent = {
//     kind: 1,
//     created_at: 1729427962,
//     tags: [
//         ["CID", "eca61dae93d2bde2c7eefd764cdbc8c31650a41d5da742b67e6efcd8931ae596", "https://blossom.newatlantis.top/eca61dae93d2bde2c7eefd764cdbc8c31650a41d5da742b67e6efcd8931ae596"]
//     ],
//     content: "Danny made this art",
//     pubkey: "a582c706dad3a703d6c0211dc25e6bb2cbc9081ced7c2adbab91150b905645a7",
//     id: "884209832ccb2a6ac11c9631f1f819b46eacf406a7199847fa1ee177e88b56dc",
//     sig: "7a861d4a4c867266cf86880b7aea2d6eb7f9a16e9579049dc42f650794e3d3c5d079026248ecb439c9c5ab5629e8d3ba6586881dcc0aab9de6327e331eb8ce5e"
// }

console.log("\nsignedEvent")
console.log(signedEvent)
console.log("\nisGood")
console.log(isGood)


import { Relay } from 'nostr-tools'
// import 'websocket-polyfill' // UNCOMMENT WHEN USING BUN

const relay = await Relay.connect('wss://relay.damus.io/')
console.log(`\nconnected to ${relay.url}`)


relay.subscribe([
    {
        kinds: [1],
        authors: [public_key],
    },
], {
    onevent(event) {
        console.log('got event:', event)
    }
})



console.log("\nsignedEvent")
console.log(signedEvent)

await relay.publish(signedEvent)
