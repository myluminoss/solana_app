
<template>
  <div>
    <el-button type="primary" v-if="isConn" @click="disconnect()">Disconnect</el-button>
    <el-button type="primary" v-else @click="connectWallet()">Connect your wallet</el-button>
    <div v-if="isConn">
      <div>Wallet Address：{{address}}，Balance：{{balance}}</div>
      <div>
        <el-button type="primary" @click="walletLogin()">Login</el-button>
        <el-button type="primary" @click="checkIn()">Sign in</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import bs58 from "bs58";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction
} from '@solana/web3.js';

// Assume that the Phantom wallet has been detected and the window.solana global object has been injected
const provider = window.solana;

// Create a Solana Network Connection
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

export default {
  name: "ApiAccount",
  data() {
    return {
      feePayerAddress: 'GtYb7ZesTrMYGCcGHj5viWTFdBQFVe1F1tBB2SX4aLUC',
      feePayerPrivateKey: '2nQKdYmXMq2x5SS8DN7Vk7qNBQv5Si96pYPGfGQizrUcLkv2GiXnAuyj8RqTtSTsASK6CSKi6j9g8GFnQV7iFrWx',


      ownerAddress: '2P5XX2yhRbAtTmb8PguukjZAJ2TKXq1r8UZ9orAxmoX5',
      ownerPrivateKey: 'VVv7XJ1Z6KpJKjFnNmfKxKoA9j5LWETf5k7FZ5aij5sV7QXyiQZAvaSGfFeHv4uJaeVx8L7ZBK9rD15LjD9XdMq',

      isConn: false,
      balance: 0,
      address: null
    }
  },
  watch: {
    isConn(val) {
      if (val) {
        this.getWalletAddress();
      }
    },
    address(val) {
      if (val) {
        console.log('provider:', provider)
        this.getWalletBalance();
      }
    }
  },
  created() {
    this.isConn = this.isWalletConnected();
  },
  methods: {
    async checkIn() {
      const programId = new PublicKey('DMZYWqWALA6X9TS283rCy21ch1DHWzPHF4kCrFY9ogpg');

      const instructionData = Buffer.from([0]);

      const feePayer = Keypair.fromSecretKey(
          bs58.decode(this.feePayerPrivateKey),
      );

      try {
        const recentBlockhash = await connection.getLatestBlockhash();
        const transaction = new Transaction({
          recentBlockhash: recentBlockhash.blockhash,
          feePayer: feePayer.publicKey,
        });
        transaction.add(
            new TransactionInstruction({
              keys: [],
              programId: programId,
              data: instructionData,
            })
        );
        const signedTransaction = await sendAndConfirmTransaction(connection, transaction, [feePayer]);
        console.log('Transaction successful:', signedTransaction);
      } catch (error) {
        console.error('Error:', error);
      }

    },
    async walletLogin() {
      const message = `Login Request`;
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await provider.signMessage(encodedMessage, "utf8");

      console.log('sign:', signedMessage)

      const response = await fetch('http://localhost:8089/user/loginByWallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: this.address,
          walletSignature: signedMessage.signature.toString('hex'),
          chainType: 'solana',
          fullMessage: message
        })
      });
      const result = await response.json();
      console.log('api res:', result);
      if (result.code === 200) {
        alert('Login successful!');
      } else {
        alert('Login failed: ' + result.msg);
      }
    },
    disconnect() {
      provider.disconnect();
      this.isConn = false;
    },
    async connectWallet() {
      if (!provider) {
        throw new Error('Phantom wallet not detected');
      }
      try {
        const r = await provider.connect();
        console.log('conn res:', r)
        this.isConn = true;
        return true;
      } catch (error) {
        console.error('Error connecting wallet:', error);
        return false;
      }
    },
    isWalletConnected() {
      console.log('is conn', provider && provider.isConnected)
      return provider && provider.isConnected;
    },
    getWalletAddress() {
      console.log('wallet address:', provider.publicKey)
      if (!this.isWalletConnected()) {
        throw new Error('Wallet not connected');
      }
      this.address = new PublicKey(provider.publicKey);
    },
    async getWalletBalance() {
      if (!this.isWalletConnected()) {
        throw new Error('Wallet not connected');
      }
      const r = await connection.getBalance(this.address);
      console.log('get balance:', r)
      this.balance = r;
    }
  }
}
</script>

<style scoped>

</style>
