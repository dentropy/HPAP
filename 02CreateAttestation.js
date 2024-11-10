import  { EAS, SchemaEncoder }  from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers'

// DATA THE USER HAS TO SET
// The Private key is stored in an ENV Variable process.env.PRIVATE_KEY

// let data_to_attest = {
// 	nostrEventId : "",
// 	CID : "",
// 	internetIdentifier : "",
// 	AIGenerated : true
// }

let data_to_attest = {
	nostrEventId: "79a2f5175b6c2931ad88bc8822619c0c0dc845af49b09d0d84b8f3720b287ffe",
    CID : "38aaa565404a79034d93409993e4adbd5e575317fe54b556d281f958a97ec34a",
    content_url : "https://blossom.newatlantis.top//38aaa565404a79034d93409993e4adbd5e575317fe54b556d281f958a97ec34a",
    IID: "paul@ddaemon.org",
    AIGenerated: false
}


const easContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
const schemaUID = "0x9908e8cf7836eb73b29fb0d6d946cda72ffa75f903d094c64752f44c0e63f7cf";
let http_url = "https://sepolia.infura.io/v3/063b32ba31b3461ebca9646500a22df3"



const eas = new EAS(easContractAddress);
// Signer must be an ethers-like signer.

let provider = new ethers.JsonRpcProvider(http_url)
let wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
wallet = wallet.connect(provider)
await eas.connect(wallet);
// Initialize SchemaEncoder with the schema string
const schemaEncoder = new SchemaEncoder("string nostrEventId,string CID,string internetIdentifier,bool AIGenerated");
const encodedData = schemaEncoder.encodeData([
	{ name: "nostrEventId", value: data_to_attest.nostrEventId, type: "string" },
	{ name: "CID", value: data_to_attest.CID, type: "string" },
	{ name: "internetIdentifier", value: data_to_attest.IID, type: "string" },
	{ name: "AIGenerated", value: data_to_attest.AIGenerated, type: "bool" }
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