import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
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

const token_decimals = 1_000_000;

// Mint address
const mint = new PublicKey("Dv2GZqoBLsTX4yhvmnJyQGx6XC6GPEs61q3Ca3QnJD1B");

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        )
        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        const mintTx = await mintTo(
            connection,
            keypair,
            mint,
            ata.address,
            keypair.publicKey,
            100*token_decimals
        );
        console.log(`Your mint txid: ${mintTx}`);
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()

// Your ata is: HYgXaiuNLJnUdzX568FmUAEL2pFSLGMMLVb12E2Y3JFj
// Your mint txid: XdbcoRGH9tqWRodUFgGmejgPzG2DJufwBWBa9THeZh48ggYjKH1pCLJ68LAWknL9mXCYQtNBWjA6CYR29pN8TJx