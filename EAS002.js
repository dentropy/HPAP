import  { EAS, SchemaEncoder }  from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers'
const easContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
const schemaUID = "0x9908e8cf7836eb73b29fb0d6d946cda72ffa75f903d094c64752f44c0e63f7cf";
const eas = new EAS(easContractAddress);
// Signer must be an ethers-like signer.

let http_url = "https://sepolia.infura.io/v3/063b32ba31b3461ebca9646500a22df3"
let provider = new ethers.JsonRpcProvider(http_url)
let wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
wallet = wallet.connect(provider)
await eas.connect(wallet);
// Initialize SchemaEncoder with the schema string
const schemaEncoder = new SchemaEncoder("string nostrEventId,string CID,string internetIdentifier,bool AIGenerated");
const encodedData = schemaEncoder.encodeData([
	{ name: "nostrEventId", value: "3f8b25399d957844d0c7ebcc981be6aa628e8cb2a192075c126d56fe4b1eb9b2", type: "string" },
	{ name: "CID", value: "eca61dae93d2bde2c7eefd764cdbc8c31650a41d5da742b67e6efcd8931ae596", type: "string" },
	{ name: "internetIdentifier", value: "paul@ddaemon.org", type: "string" },
	{ name: "AIGenerated", value: false, type: "bool" }
]);
const tx = await eas.attest({
	schema: schemaUID,
	data: {
		recipient: "0x0000000000000000000000000000000000000000",
		expirationTime: 0,
		revocable: true, // Be aware that if your schema is not revocable, this MUST be false
		data: encodedData,
	},
});
const newAttestationUID = await tx.wait();
console.log("New attestation UID:", newAttestationUID);