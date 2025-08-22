import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorVault } from "../target/types/anchor_vault";

describe("anchor-vault", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorVault as Program<AnchorVault>;

  const vaultState = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("state"), provider.wallet.publicKey.toBuffer()],
    program.programId
  )[0];

  const vault = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), vaultState.toBuffer()],
    program.programId
  )[0];

  it("Initialize vault", async () => {
    const tx = await program.methods
    .initialize()
    .accountsPartial({
      user: provider.wallet.publicKey,
      vaultState: vaultState,
      vault: vault
    })
    .rpc();
    
    console.log("\nYour transaction signature", tx);
  })

  it("Deposit", async () => {
    const tx = await program.methods
    .deposit( new anchor.BN(2 * anchor.web3.LAMPORTS_PER_SOL))
    .accountsPartial({
      user: provider.wallet.publicKey,
      vaultState: vaultState,
      vault: vault
    })
    .rpc();
    
    console.log("\nYour transaction signature", tx);
    console.log("\nVault balance", await provider.connection.getBalance(vault));
  })

  it("withdraw", async () => {
    const tx = await program.methods
    .withdraw( new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL))
    .accountsPartial({
      user: provider.wallet.publicKey,
      vaultState: vaultState,
      vault: vault
    })
    .rpc();
    
    console.log("\nYour transaction signature", tx);
    console.log("\nVault balance", await provider.connection.getBalance(vault));
  })

  it("Close", async () => {
    const tx = await program.methods
    .close()
    .accountsPartial({
      user: provider.wallet.publicKey,
      vaultState: vaultState,
      vault: vault
    })
    .rpc();
    
    console.log("\nYour transaction signature", tx);
    console.log("\nVault balance", await provider.connection.getBalance(vault));
  })

  
});