import bs58 from 'bs58'
import prompt from 'prompt-sync'
import wallet from "./dev-wallet.json"

const promptSync = prompt()

function convertWalletToBase58() {
  try {
    const base58PrivateKey = bs58.encode(Buffer.from(wallet))
    console.log("Base58 Private Key:", base58PrivateKey)
    return base58PrivateKey
  } catch (error) {
    console.error("Error converting wallet:", error)
  }
}

function convertBase58ToWallet() {
  try {
    const base58Input = promptSync("Enter your base58 private key: ")
    
    if (!base58Input) {
      console.log("No input provided")
      return
    }
    
    const walletArray = JSON.stringify(Array.from(bs58.decode(base58Input)))
    console.log("Wallet byte array:", walletArray)
    return walletArray
  } catch (error) {
    console.error("Error converting base58:", error)
  }
}

// convertWalletToBase58()
// convertBase58ToWallet()
