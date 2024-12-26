<template>
  <div>
    <el-button type="primary" @click="createToken()" disabled>Creating a Token</el-button>
    <el-button type="primary" @click="getTokenMint()">Get a Token Foundry</el-button>
  </div>
</template>

<script>
import {
  clusterApiUrl,
  Connection,
  Keypair,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  PublicKey
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  createMint,
  getMint
} from "@solana/spl-token";
import bs58 from "bs58";

export default {
  name: "CreateToken",
  data() {
    return {
      address: 'GtYb7ZesTrMYGCcGHj5viWTFdBQFVe1F1tBB2SX4aLUC',
      privateKey: '2nQKdYmXMq2x5SS8DN7Vk7qNBQv5Si96pYPGfGQizrUcLkv2GiXnAuyj8RqTtSTsASK6CSKi6j9g8GFnQV7iFrWx',
      address2: '9v5FvowXeRuTwxRSaYy4v9aJwVKgz3JZvaRqXM2M3WMW',
      privateKey2: '33koNGbMWuMkQo1ucLNaACrqpQwjELBwosirHLhKe9eu3p56cxwB7bt36V8cMSGingiF49yj6EMti4Kb1ehN63FW',
      address3: '2CoZD4ctQMo64mH37YFQCjZ5kE4mfPzoMbGqzqxoYsD1',
      privateKey3: 'AphAaJiXG3XmZ9hLQia1jcynH7cojzLd6jiNq2nQ4BrNUMtxUuzFXUmApNx4MN7MEAQzBrCdD5NAtyPRKVRovKZ'
    }
  },
  methods: {
    async getTokenMint() {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      const mintAccountPublicKey = new PublicKey(this.address3);

      let mintAccount = await getMint(connection, mintAccountPublicKey);

      console.log(mintAccount);
    },
    async createToken(type) {
      // connection
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      // const recentBlockhash = await connection.getLatestBlockhash();

      const feePayer = Keypair.fromSecretKey(
          bs58.decode(
              this.privateKey,
          ),
      );

      const alice = Keypair.fromSecretKey(
          bs58.decode(
              this.privateKey2
          ),
      );

      const mint = Keypair.fromSecretKey(
          bs58.decode(
              this.privateKey3
          ),
      );

      // 1) use build-in function
      let mintPubkey = await createMint(
          connection, // connection
          feePayer, // fee payer
          alice.publicKey, // mint authority
          alice.publicKey, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
          9, // decimals,
          mint
      );
      console.log(`mint: ${mintPubkey.toBase58()}`);

      // or

      // 2) compose by yourself
      if (type === 2) {
        const mint = Keypair.generate();
        console.log(`mint: ${mint.publicKey.toBase58()}`);

        const transaction = new Transaction().add(
            // create mint account
            SystemProgram.createAccount({
              fromPubkey: feePayer.publicKey,
              newAccountPubkey: mint.publicKey,
              space: MINT_SIZE,
              lamports: await getMinimumBalanceForRentExemptMint(connection),
              programId: TOKEN_PROGRAM_ID,
            }),
            // init mint account
            createInitializeMintInstruction(
                mint.publicKey, // mint pubkey
                8, // decimals
                alice.publicKey, // mint authority
                alice.publicKey, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
            ),
        );

        // Send transaction
        const transactionSignature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [feePayer, mint], // Signers
        );

        console.log(`txhash: ${transactionSignature}`);
      }
    }
  }
}
</script>

<style scoped>

</style>
