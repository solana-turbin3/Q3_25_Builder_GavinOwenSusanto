import wallet from "../../../../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import dotenv from "dotenv";
import path from 'path';
const envPath = path.resolve(__dirname, '../../../../.env');
dotenv.config({ path: envPath });

// Define our Mint address
const mint = publicKey("Dv2GZqoBLsTX4yhvmnJyQGx6XC6GPEs61q3Ca3QnJD1B")

// Create a UMI connection
const umi = createUmi(process.env.RPC_URL!);
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint,
            mintAuthority: signer,
        }

        let data: DataV2Args = {
            name: "PINK Coin",
            symbol: "PINK",
            uri: "",
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data: data,
            isMutable: true,
            collectionDetails: null,
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();

// signature = 5nqe4gFAJjUdvan9StGQ2dbNBusDqmqiUPv2vdDKkxtn25QQG2wdgkXNGbxAr4Ci8NUfJygSvSmvrNn6ciLCyuai