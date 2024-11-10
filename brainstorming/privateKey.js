import { ethers } from 'ethers'

console.log(process.env["PRIVATE_KEY"])
let wallet = new ethers.Wallet(process.env.PRIVATE_KEY)

console.log(wallet)