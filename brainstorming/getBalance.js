// import { generateAccounts } from './loadMnemonicAccounts'
import { ethers } from 'ethers'

// let mnemonic = process.env.MNEMONIC;
// let mnemonic_path = process.env.MNEMONIC_PATH;
// console.log(process.env.MNEMONIC_PATH)
// if (!mnemonic) {
//   throw new Error("MNEMONIC not found in .env file");
// }
// console.log(`mnemonic=${mnemonic}`)
// let accounts = await generateAccounts(mnemonic, mnemonic_path)


let http_url = "https://sepolia.infura.io/v3/063b32ba31b3461ebca9646500a22df3"
let provider = new ethers.JsonRpcProvider(http_url)

// let ws_url = "wss://rpc.thanos-sepolia.tokamak.network"
// let provider = new ethers.WebSocketProvider(ws_url)

// for(var i = 0; i < accounts.length; i++){
//   let Balance = await provider.getBalance(accounts[i].address)
//   console.log(`Account ${String(i)}, Addresss=${accounts[i].address}, Balance=${Balance.toString()}`)
// }

console.log(await provider.getBalance("0x3CCD40c503C06485F99d2fdbe222B1306e909cA9"))
console.log(provider._network.toJSON())
