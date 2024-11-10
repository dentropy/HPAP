import { EAS, NO_EXPIRATION, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers'

let wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
let http_url = "https://sepolia.infura.io/v3/063b32ba31b3461ebca9646500a22df3"
let provider = new ethers.JsonRpcProvider(http_url)

const easContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
const eas = new EAS(easContractAddress);
eas.connect(wallet);

// Initialize SchemaEncoder with the schema string
const schemaEncoder = new SchemaEncoder('string nostrEventId,string CID,string internetIdentifier,bool AIGenerated');
const encodedData = schemaEncoder.encodeData([
  { name: 'nostrEventId', value: "", type: 'string' },
  { name: 'CID', value: "eca61dae93d2bde2c7eefd764cdbc8c31650a41d5da742b67e6efcd8931ae596", type: 'string' },
  { name: 'internetIdentifier', value: "paul@ddaemon.org", type: 'string' },
  { name: 'AIGenerated', value: false, type: 'bool' }
]);

const schemaUID = '0x9908e8cf7836eb73b29fb0d6d946cda72ffa75f903d094c64752f44c0e63f7cf';

const transaction = await eas.attest({
  schema: schemaUID,
  data: {
    recipient: '0xCF35d8B94A054EC4A23A49698c981f892B0f47A1',
    expirationTime: NO_EXPIRATION,
    revocable: false, // Be aware that if your schema is not revocable, this MUST be false
    data: encodedData
  }
});

const newAttestationUID = await transaction.wait();

console.log('New attestation UID:', newAttestationUID);

console.log('Transaction receipt:', transaction.receipt);