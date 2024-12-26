<template>
  <div>
    <el-button type="primary" @click="mintToken()" :disabled="true">Minting Tokens</el-button>
    <el-button type="primary" @click="transferToken()" :disabled="false">Transferring Tokens</el-button>
    <el-button type="primary" @click="burnToken()" :disabled="true">Destroy Token</el-button>
  </div>
</template>

<script>
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createTransferCheckedInstruction,
  createMintToCheckedInstruction,
  mintToChecked,
  transferChecked,
  burnChecked,
  createBurnCheckedInstruction
} from "@solana/spl-token";
import bs58 from "bs58";

export default {
  name: "MintToken",
  data() {
    return {
      feePayerAddress: 'GtYb7ZesTrMYGCcGHj5viWTFdBQFVe1F1tBB2SX4aLUC',
      feePayerPrivateKey: '2nQKdYmXMq2x5SS8DN7Vk7qNBQv5Si96pYPGfGQizrUcLkv2GiXnAuyj8RqTtSTsASK6CSKi6j9g8GFnQV7iFrWx',

      mintPubKey: '2CoZD4ctQMo64mH37YFQCjZ5kE4mfPzoMbGqzqxoYsD1',
      tokenAccount: 'HJStMjhNa1TdWBHXcxEbwmTCdtfUBDXbhc6rdSwBDRd1',       // token account 1
      tokenAccount2: '3TbfZuDqtHcCbHKgyo7rMqRkyoN96bhWHUvTGRTh2vaV',      // token account 2

      address2: '9v5FvowXeRuTwxRSaYy4v9aJwVKgz3JZvaRqXM2M3WMW',
      privateKey2: '33koNGbMWuMkQo1ucLNaACrqpQwjELBwosirHLhKe9eu3p56cxwB7bt36V8cMSGingiF49yj6EMti4Kb1ehN63FW',


      ownerAddress2: '3WJSSwpwheJXMoLSmo3x9mQWbibWxQbxU5Pfo73CHPvp',
      ownerPrivateKey2: '2QoSGfsQLjmENXN8bUq7RHGZr6GS4AbSgfMg3dQdWovzN3JDrw6ArSEmMfJ36kuvSRPNDZ89o2iU8kmGSzj5DmqA',   // token account 2 Owner

      nftPubKey: 'G9yj7mZeDsnXxacYPqCpP6vs6noAx22EFb3WAKH6Bjyt',
      nftAccount: '6PMnfU2RKV4ksgYMw9w4nVf1peQXcGavsw4TjqB5HNHH',
      oa: '6NywCuKHt1thk1q7eFQUzvj2sdGhBtgy3byAjgiuGcgG',

      proMetadataToken: 'HLo4jQsVVoXhpkQeoCH3eU3UY76JGEu27HZAZf94MN6c',
      proTokenAccount: '5LZdfVTC3tChMRTCa6BjqudR4ZkTgcxJpYj295rBMqwn',

      proTokenAccount2: 'FowiFH6ar17pzrWz57jqqGbqJtzTvMV13AZWY2zL3LDw'
    }
  },
  methods: {
    async burnToken(type) {
      // connection
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      const feePayer = Keypair.fromSecretKey(
          bs58.decode(
              this.feePayerPrivateKey
          ),
      );

      const alice = Keypair.fromSecretKey(
          bs58.decode(
              this.ownerPrivateKey2
          ),
      );

      const mintPubkey = new PublicKey(
          this.mintPubKey
      );

      const tokenAccountPubkey = new PublicKey(
          this.feePayerPrivateKey
      );

      // 1) use build-in function
      let txhash = await burnChecked(
          connection, // connection
          feePayer, // payer
          tokenAccountPubkey, // token account
          mintPubkey, // mint
          alice, // owner
          1e9, // amount, if your decimals is 8, 10^8 for 1 token
          9,
      );
      console.log(`txhash: ${txhash}`);

      // or

      // 2) compose by yourself
      if (type === 2) {
        let tx = new Transaction().add(
            createBurnCheckedInstruction(
                tokenAccountPubkey, // token account
                mintPubkey, // mint
                alice.publicKey, // owner of token account
                1e8, // amount, if your decimals is 8, 10^8 for 1 token
                8, // decimals
            ),
        );
        console.log(
            `txhash: ${await sendAndConfirmTransaction(connection, tx, [
              feePayer,
              alice /* fee payer + token authority */,
            ])}`,
        );
      }
    },
    async transferToken(type) {
      const rpcUrl = "https://solana-mainnet.api.syndica.io/api-key/8n9dteTVCvEWru8bgBrWYPkEJBhBV71PgXz3MAcNgzZELtvkA9LvD7CuAMge3ydCxZh1wsk787VfPTzCmgtR1aKXYWcoQhrogx";
      // const rpcUrl = clusterApiUrl("testnet");

      // connection
      const connection = new Connection(rpcUrl, "confirmed");

      const feePayer = Keypair.fromSecretKey(
          bs58.decode(
              this.feePayerPrivateKey
          ),
      );

      const alice = Keypair.fromSecretKey(
          bs58.decode(
              this.feePayerPrivateKey
          ),
      );

      const mintPubkey = new PublicKey(
          this.proMetadataToken
      );

      const tokenAccountXPubkey = new PublicKey(
          this.proTokenAccount
      );
      const tokenAccountYPubkey = new PublicKey(
          this.proTokenAccount2
      );

      // 1) use build-in function
      let txhash = await transferChecked(
          connection, // connection
          feePayer, // payer
          tokenAccountXPubkey, // from (should be a token account)
          mintPubkey, // mint
          tokenAccountYPubkey, // to (should be a token account)
          alice, // from's owner
          100e2, // amount, if your decimals is 8, send 10^8 for 1 token
          2, // decimals
      );
      console.log(`txhash: ${txhash}`);

      // or

      // 2) compose by yourself
      if (type === 2) {
        let tx = new Transaction().add(
            createTransferCheckedInstruction(
                tokenAccountXPubkey, // from (should be a token account)
                mintPubkey, // mint
                tokenAccountYPubkey, // to (should be a token account)
                alice.publicKey, // from's owner
                1e8, // amount, if your decimals is 8, send 10^8 for 1 token
                8, // decimals
            ),
        );
        console.log(
            `txhash: ${await sendAndConfirmTransaction(connection, tx, [
              feePayer,
              alice /* fee payer + owner */,
            ])}`,
        );
      }
    },
    async mintToken(type) {
      // connection
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      const feePayer = Keypair.fromSecretKey(
          bs58.decode(
              this.feePayerPrivateKey
          ),
      );

      const alice = Keypair.fromSecretKey(
          bs58.decode(
              this.privateKey2
          ),
      );

      const mintPubkey = new PublicKey(
          this.mintPubKey
      );

      const tokenAccountPubkey = new PublicKey(
          this.tokenAccount2
      );

      // 1) use build-in function
      let txhash = await mintToChecked(
          connection, // connection
          feePayer, // fee payer
          mintPubkey, // mint
          tokenAccountPubkey, // receiver (should be a token account)
          alice, // mint authority
          3e9, // amount. if your decimals is 8, you mint 10^8 for 1 token.
          9, // decimals
      );
      console.log(`txhash: ${txhash}`);

      // if alice is a multisig account
      // let txhash = await mintToChecked(
      //   connection, // connection
      //   feePayer, // fee payer
      //   mintPubkey, // mint
      //   tokenAccountPubkey, // receiver (should be a token account)
      //   alice.publicKey, // !! mint authority pubkey !!
      //   1e8, // amount. if your decimals is 8, you mint 10^8 for 1 token.
      //   8, // decimals
      //   [signer1, signer2 ...],
      // );

      // or

      // 2) compose by yourself
      if (type === 2) {
        let tx = new Transaction().add(
            createMintToCheckedInstruction(
                mintPubkey, // mint
                tokenAccountPubkey, // receiver (should be a token account)
                alice.publicKey, // mint authority
                1e8, // amount. if your decimals is 8, you mint 10^8 for 1 token.
                8, // decimals
                // [signer1, signer2 ...], // only multisig account will use
            ),
        );

        console.log(
            `txhash: ${await sendAndConfirmTransaction(connection, tx, [
              feePayer,
              alice /* fee payer + mint authority */,
            ])}`,
        );
      }
    }
  }
}
</script>

<style scoped>

</style>
