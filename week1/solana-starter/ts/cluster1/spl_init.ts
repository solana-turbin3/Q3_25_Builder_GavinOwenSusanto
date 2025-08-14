import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from '@solana/spl-token';
import wallet from "../../../../turbin3-wallet.json"
import dotenv from "dotenv";
import path from 'path';
const envPath = path.resolve(__dirname, '../../../../.env');
dotenv.config({ path: envPath });


// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection(process.env.RPC_URL!, commitment);

(async () => {
    try {
        // Start here
        const mint = await createMint(
            connection,         // Connection to devnet
            keypair,            // payer
            keypair.publicKey,  // mint authority
            null,               // Freeze authority
            6                   // Decimals
        )
        console.log(`Mint address: ${mint}`)
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()

// Mint address: Dv2GZqoBLsTX4yhvmnJyQGx6XC6GPEs61q3Ca3QnJD1B