<template>
  <div>
    <el-button type="primary" @click="createNFT()" :disabled="true">Creating NFTs</el-button>
    <el-button type="primary" @click="transferNFT()" :disabled="true">Transferring NFTs</el-button>
    <el-button type="primary" @click="tryPump()" :disabled="true">Try to get Pump transaction</el-button>
  </div>
</template>

<script>
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  percentAmount,
  keypairIdentity,
} from "@metaplex-foundation/umi";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction, VersionedTransaction
} from "@solana/web3.js";
import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata
} from "@metaplex-foundation/mpl-token-metadata";
import bs58 from "bs58";

export default {
  name: "NFTTest",
  data() {
    return {
      address: 'GtYb7ZesTrMYGCcGHj5viWTFdBQFVe1F1tBB2SX4aLUC',
      privateKey: '2nQKdYmXMq2x5SS8DN7Vk7qNBQv5Si96pYPGfGQizrUcLkv2GiXnAuyj8RqTtSTsASK6CSKi6j9g8GFnQV7iFrWx',

      ownerAddress2: '3WJSSwpwheJXMoLSmo3x9mQWbibWxQbxU5Pfo73CHPvp',
      ownerPrivateKey2: '2QoSGfsQLjmENXN8bUq7RHGZr6GS4AbSgfMg3dQdWovzN3JDrw6ArSEmMfJ36kuvSRPNDZ89o2iU8kmGSzj5DmqA',

      nftPubKey: 'G9yj7mZeDsnXxacYPqCpP6vs6noAx22EFb3WAKH6Bjyt',
      nftAccount: 'C6i1zLi61u2sUWXRgnkXMkHA4dF4jHGDZEtbs8vtrmG6',
      nftAccount2: '6PMnfU2RKV4ksgYMw9w4nVf1peQXcGavsw4TjqB5HNHH',
    }
  },
  methods: {
    async tryPump() {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const mintKeypair = Keypair.generate();
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

      const feePayer = Keypair.fromSecretKey(
          bs58.decode(
              this.privateKey
          ),
      );

      const tokenAccountYPubkey = new PublicKey(
          this.address
      );

      const payload = {
        publicKey: tokenAccountYPubkey.toBase58(),
        action: "create",
        tokenMetadata: {
          name: 'MyLuu addfas',
          symbol: 'MyLuu',
          uri: 'https://yfcdn.imnotai.com/test/metadata.json',
        },
        mint: mintKeypair.publicKey.toBase58(),
        denominatedInSol: "true", // API expects string "true"
        amount: 0.0001,
        slippage: 5,
        priorityFee: 0.00005,
        pool: "pump",
      };

      const response = await fetch("https://pumpportal.fun/api/trade-local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });

      const transactionData = await response.arrayBuffer();
      const tx = VersionedTransaction.deserialize(new Uint8Array(transactionData));
      tx.sign([mintKeypair, feePayer]);
      // Send transaction with proper blockhash handling
      console.log("Sending transaction...");
      // Send and confirm transaction with options
      const signature = await connection.sendTransaction(tx, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 5
      });

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      });

      console.log("Token launch successful!", confirmation);
    },
    async transferNFT() {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      const walletKeypair = Keypair.fromSecretKey(
          bs58.decode(
              this.ownerPrivateKey2
          ),
      );

      const receiverPublicKey = new PublicKey(
          this.nftAccount
      );

      const nftAccountPublicKey = new PublicKey(
          this.nftPubKey
      );

      const PROGRAM_ID = new PublicKey(this.nftPubKey);
      const instructionData = Buffer.from([0]);
      const keys = [
        { pubkey: walletKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: receiverPublicKey, isSigner: false, isWritable: true },
        { pubkey: nftAccountPublicKey, isSigner: false, isWritable: true }
      ];
      const tx = new TransactionInstruction({
        keys,
        programId: PROGRAM_ID,
        data: instructionData
      });
      const transaction = new Transaction();
      transaction.add(tx);
      const signature = await sendAndConfirmTransaction(connection, transaction, [walletKeypair]);
      console.log('Transaction sent with signature:', signature);
    },
    async createNFT() {
      try {
        /* console.log("Loading keypair from environment...");
        const privateKey = JSON.parse(process.env.SOLANA_PRIVATE_KEY || "[]");
        if (privateKey.length === 0) {
          throw new Error("SOLANA_PRIVATE_KEY is not set in .env file");
        } */

        const privateKey = Keypair.fromSecretKey(
            bs58.decode(
                this.privateKey,
            ),
        );

        console.log("Creating Umi instance...");
        const umi = createUmi(clusterApiUrl("devnet"));

        const keypair = umi.eddsa.createKeypairFromSecretKey(
            privateKey.secretKey
        );

        // Use keypairIdentity to set the keypair as the signer
        const signer = keypairIdentity(keypair);
        umi.use(signer);
        umi.use(mplTokenMetadata());

        console.log("Keypair loaded. Public key:", keypair.publicKey);

        console.log("Generating new mint address...");
        const mint = generateSigner(umi);

        console.log("Creating NFT...");
        const { signature } = await createNft(umi, {
          mint,
          name: "My NFT2",
          // Replace this with your Arweave metadata URI
          uri: "https://yfcdn.imnotai.com/test/metadata.json",
          maxSupply: 1,
          sellerFeeBasisPoints: percentAmount(0),
          creators: [
            {
              address: keypair.publicKey,
              share: 100,
              verified: true,
            },
          ],
        }).sendAndConfirm(umi);

        console.log("NFT created successfully!");
        console.log("Mint address:", mint.publicKey); // Mint address: G9yj7mZeDsnXxacYPqCpP6vs6noAx22EFb3WAKH6Bjyt
        console.log("Transaction signature:", signature);

        console.log("Fetching digital asset...");
        const asset = await fetchDigitalAsset(umi, mint.publicKey);
        console.log("Digital Asset:", asset);
      } catch (error) {
        console.error("Error:", error);
        console.error("Stack trace:", error.stack);
      }
    }
  }
}
</script>

<style scoped>

</style>
