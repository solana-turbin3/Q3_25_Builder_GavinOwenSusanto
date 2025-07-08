import wallet from "../../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const imagePath = "https://gateway.irys.xyz/6YipaDpto1Uqk4zVoVCGEeyuTK4F3h7Ui828kntJsutY"
        const metadata = {
            name: "Gavin Pink Rug",
            symbol: "GPR",
            description: "Gavin Pink Rug",
            image: imagePath,
            attributes: [
                {trait_type: 'Rarity', value: 'Pink'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: imagePath
                    },
                ]
            },
            creators: []
        };
        const myUri = await umi.uploader.upload([createGenericFile(JSON.stringify(metadata), "metadata.json",{ contentType: 'application/json' })]);
        console.log("Your metadata URI: ", myUri);
        // https://gateway.irys.xyz/A44zfR8MD2p8WRZ6BWnSw1jJfcXH2UYH87MocuZQupbE
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
