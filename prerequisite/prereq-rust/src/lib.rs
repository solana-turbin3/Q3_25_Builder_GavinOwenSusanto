#[cfg(test)]
mod tests {
    use solana_client::rpc_client::RpcClient;
    use solana_program::system_instruction::transfer;
    use solana_sdk::{
        hash::hash,
        instruction::{AccountMeta, Instruction},
        message::Message,
        pubkey::Pubkey,
        signature::{read_keypair_file, Keypair, Signer},
        system_program,
        transaction::Transaction,
    };
    use std::str::FromStr;

    const RPC_URL: &str = "RPC_URL";

    #[test]
    fn keygen() {
        // Create a new keypair
        let kp = Keypair::new();

        println!(
            "You've generated a new Solana wallet: {}",
            kp.pubkey().to_string()
        );
        println!("");
        println!("To save your wallet, copy and paste the following into a JSON file:");
        // Convert to proper JSON string
        let json_string = serde_json::to_string(&kp.to_bytes().to_vec()).unwrap();
        println!("{}", json_string);
    }
    // 2injdAT3egEcUzWZ9ZS3UgnqBii8BHLyoc7rQn357qwo

    #[test]
    fn airdrop() {
        // Import our keypair
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");

        // we'll establish a connection to Solana devnet using the const we defined above
        let client = RpcClient::new(RPC_URL);

        // We're going to claim 2 devnet SOL tokens (2 billion lamports)
        match client.request_airdrop(&keypair.pubkey(), 2_000_000_000u64) {
            Ok(sig) => {
                println!("Success! Check your TX here:");
                println!("https://explorer.solana.com/tx/{}?cluster=devnet", sig);
            }
            Err(err) => {
                println!("Airdrop failed: {}", err);
            }
        }
    }

    #[test]
    fn transfer_sol() {
        // Load your devnet keypair from file
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");

        // Generate a signature from the keypair
        let pubkey = keypair.pubkey();
        let message_bytes = b"I verify my Solana Keypair!";
        let sig = keypair.sign_message(message_bytes);
        let sig_hashed = hash(sig.as_ref());

        // Verify the signature using the public key
        match sig.verify(&pubkey.to_bytes(), &sig_hashed.to_bytes()) {
            true => println!("Signature verified"),
            false => println!("Verification failed"),
        }

        // Define the destination (Turbin3) address
        let to_pubkey = Pubkey::from_str("B2rsdVwUXgcqPGAtM3jkdDXZHJx3up5uScq7E3dfeCs7").unwrap();

        // Connect to devnet
        let rpc_client = RpcClient::new(RPC_URL);

        // Fetch recent blockhash
        let recent_blockhash = rpc_client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        // Create and sign the transaction
        let transaction = Transaction::new_signed_with_payer(
            &[transfer(&keypair.pubkey(), &to_pubkey, 100_000_000)],
            Some(&keypair.pubkey()),
            &vec![&keypair],
            recent_blockhash,
        );

        // Send the transaction and print tx
        let signature = rpc_client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "Success! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );
    }

    #[test]
    fn transfer_all_sol() {
        // Step 1: Initialize wallet and connection parameters
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");
        let rpc_client = RpcClient::new(RPC_URL);
        let to_pubkey = Pubkey::from_str("B2rsdVwUXgcqPGAtM3jkdDXZHJx3up5uScq7E3dfeCs7").unwrap();
        let recent_blockhash = rpc_client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        // Step 2: Get current balance
        let balance = rpc_client
            .get_balance(&keypair.pubkey())
            .expect("Failed to get balance");

        // Step 3: Build a mock transaction to calculate fee
        let message = Message::new_with_blockhash(
            &[transfer(&keypair.pubkey(), &to_pubkey, balance)],
            Some(&keypair.pubkey()),
            &recent_blockhash,
        );

        // Step 4: Estimate transaction fee
        let fee = rpc_client
            .get_fee_for_message(&message)
            .expect("Failed to get fee calculator");

        // Step 5: Create final transaction with balance minus fee
        let transaction = Transaction::new_signed_with_payer(
            &[transfer(&keypair.pubkey(), &to_pubkey, balance - fee)],
            Some(&keypair.pubkey()),
            &vec![&keypair],
            recent_blockhash,
        );

        // This ensures we leave zero lamports behind.

        // Step 6: Send transaction and verify
        let signature = rpc_client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send final transaction");

        println!(
            "Success! Entire balance transferred: https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );
    }

    #[test]
    fn submit_rs() {
        // Step 1: Create a Solana RPC client
        let rpc_client = RpcClient::new(RPC_URL);

        // Step 2: Load your signer keypair
        let signer =
            read_keypair_file("Turbin3-wallet.json").expect("Couldn't find wallet file");

        // Step 3: Define program and account public keys
        // Specify all the public keys of the program and accounts your instruction will interact with.
        let mint = Keypair::new();
        let turbin3_prereq_program =
            Pubkey::from_str("TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM").unwrap();
        let collection = Pubkey::from_str("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2").unwrap();
        let mpl_core_program =
            Pubkey::from_str("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d").unwrap();
        let system_program = system_program::id();

        // Step 4: Get the PDAs (Program Derived Addresses)
        let signer_pubkey = signer.pubkey();

        // Prereqs PDA
        let seeds = &[b"prereqs", signer_pubkey.as_ref()];
        let (prereq_pda, _bump) = Pubkey::find_program_address(seeds, &turbin3_prereq_program);

        // Collection Authority PDA
        let authority_seeds = &[b"collection", collection.as_ref()];
        let (authority_pda, _authority_bump) =
            Pubkey::find_program_address(authority_seeds, &turbin3_prereq_program);

        // Step 5: Prepare the instruction data (discriminator)
        // The discriminator uniquely identifies the instruction your program expects.
        // From the IDL, the submit_rs instruction discriminator is:
        let data = vec![77, 124, 82, 163, 21, 133, 181, 206];

        // Step 6: Define the accounts metadata
        // Use new for accounts that the instruction writes to and new_readonly for accounts that are
        // read-only. The true flag indicates the account must sign the transaction.
        let accounts = vec![
            AccountMeta::new(signer.pubkey(), true), // user signer
            AccountMeta::new(prereq_pda, false),     // PDA account
            AccountMeta::new(mint.pubkey(), true),   // mint keypair
            AccountMeta::new(collection, false),     // collection
            AccountMeta::new_readonly(authority_pda, false), // authority (PDA)
            AccountMeta::new_readonly(mpl_core_program, false), // mpl core program
            AccountMeta::new_readonly(system_program, false), // system program
        ];

        // Step 7: Get the recent blockhash
        // We need a recent blockhash to build the transaction:
        let blockhash = rpc_client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        // Step 8: Build the instruction
        // Construct the instruction by specifying the program ID, accounts, and instruction data.
        let instruction = Instruction {
            program_id: turbin3_prereq_program,
            accounts,
            data,
        };

        // Step 9: Create and sign the transaction
        // Create a transaction containing the instruction and sign it with the necessary keypairs.
        let transaction = Transaction::new_signed_with_payer(
            &[instruction],
            Some(&signer.pubkey()),
            &[&signer, &mint],
            blockhash,
        );

        // Step 10: Send and confirm the transaction
        let signature = rpc_client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "Success! Check out your TX here:\nhttps://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );
    }
}
