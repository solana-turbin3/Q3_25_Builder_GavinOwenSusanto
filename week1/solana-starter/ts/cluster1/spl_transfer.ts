import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../../../../turbin3-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import dotenv from "dotenv";
import path from 'path';
const envPath = path.resolve(__dirname, '../../../../.env');
dotenv.config({ path: envPath });

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection(process.env.RPC_URL!, commitment);

// Mint address
const mint = new PublicKey("Dv2GZqoBLsTX4yhvmnJyQGx6XC6GPEs61q3Ca3QnJD1B");

// Recipient address
const to = new PublicKey("8uxyewWYegRAjbzNc7sRMpn4KtxPM5WjgZCaCnE5ghCY");

const token_decimals = 1_000_000;

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const ata_from = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        )

        // Get the token account of the toWallet address, and if it does not exist, create it
        const ata_to = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to
        )

        // Transfer the new token to the "toTokenAccount" we just created
        const transferTx = await transfer(
            connection,
            keypair,
            ata_from.address,
            ata_to.address,
            keypair.publicKey,
            100*token_decimals
        )
        console.log(transferTx);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();

// signature = 2q8Nzz7xWBDdaLbiVqGioZ6TVvkCi7PjrJ2vHSM7k3XzgZPNhYHZhJbkgoPugFCH7jT6FjicSLEMMDTZTv9MQWHu