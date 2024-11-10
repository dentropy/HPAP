import { SchemaRegistry } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';

// https://sepolia.etherscan.io/address/0xC2679fBD37d54388Ce493F1DB75320D236e1815e
const schemaRegistryContractAddress = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e';
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

onsole.log(await provider.getBalance("0x3CCD40c503C06485F99d2fdbe222B1306e909cA9"))
schemaRegistry.connect(signer);

const schema = 'uint256 nostrEventId, uint8 CID';
const resolverAddress = '0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0'; // Sepolia 0.26
const revocable = true;

const transaction = await schemaRegistry.register({
  schema,
  resolverAddress,
  revocable
});

// Optional: Wait for transaction to be validated
await transaction.wait();