import wallet from "../../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        //1. Load image
        const imagePath = await readFile("/Users/owen/Documents/GitHub/Q3_25_Builder_GavinOwenSusanto/week1/solana-starter/ts/cluster1/assets/image.png"); 
        //2. Convert image to generic file.
        const genericFile = createGenericFile(imagePath, "image.png",{ contentType: 'image/png' });
        //3. Upload image
        const [myUri] = await umi.uploader.upload([genericFile]);

        console.log("Your image URI: ", myUri);
        // https://gateway.irys.xyz/6YipaDpto1Uqk4zVoVCGEeyuTK4F3h7Ui828kntJsutY
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
