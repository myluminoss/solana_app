<template>
  <div>
    <el-button type="primary" @click="createNFT()" :disabled="true">Creating NFTs</el-button>
    <el-button type="primary" @click="createToken()" :disabled="false">Creating a Metadata Token</el-button>
    <el-button type="primary" @click="mintToken()" :disabled="false">Minting Tokens</el-button>
    <el-button type="primary" @click="createTokenAccount()" :disabled="true">Create a token account</el-button>
    <el-button type="primary" @click="mintToken2()" :disabled="true">Minting Tokens 2</el-button>
    <el-button type="primary" @click="transferToken()" :disabled="false">Transferring Tokens</el-button>
  </div>
</template>

<script>
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplTokenMetadata, createNft, fetchDigitalAsset, createFungible, mintV1, TokenStandard, transferV1 } from '@metaplex-foundation/mpl-token-metadata'
import {clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmTransaction, Transaction} from "@solana/web3.js";
import { generateSigner, keypairIdentity, percentAmount, some } from '@metaplex-foundation/umi'
import bs58 from "bs58";
import {
  createAssociatedTokenAccount, createAssociatedTokenAccountInstruction,
  createMintToCheckedInstruction,
  getAssociatedTokenAddress,
  mintToChecked
} from "@solana/spl-token";

export default {
  name: "MetadataToken",
  data() {
    return {
      address: 'GtYb7ZesTrMYGCcGHj5viWTFdBQFVe1F1tBB2SX4aLUC',
      privateKey: '2nQKdYmXMq2x5SS8DN7Vk7qNBQv5Si96pYPGfGQizrUcLkv2GiXnAuyj8RqTtSTsASK6CSKi6j9g8GFnQV7iFrWx',

      mintPubKey: 'H6eVsMr7fqM8GeEKQL67dJHbszn12ZiQqDuWMM2dba6K',
      tokenAccount: '6TyFkmGqbNQd1CgPUBvqnUS6vcHgW5tEAoJXLoUKNWX4',

      proMintPubKey: 'HLo4jQsVVoXhpkQeoCH3eU3UY76JGEu27HZAZf94MN6c',
      proTokenAccount: '5LZdfVTC3tChMRTCa6BjqudR4ZkTgcxJpYj295rBMqwn',

      proTokenAccount2: 'FowiFH6ar17pzrWz57jqqGbqJtzTvMV13AZWY2zL3LDw',
      proTokenAccount3: '7im64ZGPxNjjgRy4W9MQ7m1y1Th9BMfDtRbmnv2XUPEc',
      proTokenAccount4: 'FowiFH6ar17pzrWz57jqqGbqJtzTvMV13AZWY2zL3LDw'
    }
  },
  methods: {
    async transferToken() {
      const rpcUrl = "https://solana-mainnet.api.syndica.io/api-key/8n9dteTVCvEWru8bgBrWYPkEJBhBV71PgXz3MAcNgzZELtvkA9LvD7CuAMge3ydCxZh1wsk787VfPTzCmgtR1aKXYWcoQhrogx";
      // const rpcUrl = clusterApiUrl("testnet");
      const umi = createUmi(rpcUrl);

      const privateKey = Keypair.fromSecretKey(
          bs58.decode(
              this.privateKey,
          ),
      );

      const keypair = umi.eddsa.createKeypairFromSecretKey(
          privateKey.secretKey
      );

      // Use keypairIdentity to set the keypair as the signer
      const signer = keypairIdentity(keypair);
      umi.use(signer);
      umi.use(mplTokenMetadata());

      const mint = new PublicKey(
          this.proMintPubKey
      );

      const tokenAccountPubkey = new PublicKey(
          this.proTokenAccount
      );

      const newTokenAccountPubkey = new PublicKey(
          this.proTokenAccount2
      );

      await transferV1(umi, {
        mint,
        authority: keypair,
        tokenOwner: tokenAccountPubkey,
        destinationOwner: newTokenAccountPubkey,
        tokenStandard: TokenStandard.Fungible,
      }).sendAndConfirm(umi)
    },
    async createNFT() {
      const umi = createUmi(clusterApiUrl("devnet"));

      const privateKey = Keypair.fromSecretKey(
          bs58.decode(
              this.privateKey,
          ),
      );

      const keypair = umi.eddsa.createKeypairFromSecretKey(
          privateKey.secretKey
      );

      // Use keypairIdentity to set the keypair as the signer
      const signer = keypairIdentity(keypair);
      umi.use(signer);
      umi.use(mplTokenMetadata());

      const mint = generateSigner(umi)
      console.log('nft address:', mint.publicKey)
      await createNft(umi, {
        mint,
        name: 'My NFT',
        uri: 'https://yfcdn.imnotai.com/test/metadata-v2.json',
        sellerFeeBasisPoints: percentAmount(0),
      }).sendAndConfirm(umi)

      const asset = await fetchDigitalAsset(umi, mint.publicKey)
      console.log('metadata:', asset)
    },
    async createToken() {
      const rpcUrl = "https://solana-mainnet.api.syndica.io/api-key/8n9dteTVCvEWru8bgBrWYPkEJBhBV71PgXz3MAcNgzZELtvkA9LvD7CuAMge3ydCxZh1wsk787VfPTzCmgtR1aKXYWcoQhrogx";
      // const rpcUrl = clusterApiUrl("testnet");
      const umi = createUmi(rpcUrl);

      const privateKey = Keypair.fromSecretKey(
          bs58.decode(
              this.privateKey,
          ),
      );

      const keypair = umi.eddsa.createKeypairFromSecretKey(
          privateKey.secretKey
      );

      // Use keypairIdentity to set the keypair as the signer
      const signer = keypairIdentity(keypair);
      umi.use(signer);
      umi.use(mplTokenMetadata());

      const mint = generateSigner(umi)
      console.log('Mint address:', mint.publicKey);
      await createFungible(umi, {
        mint,
        name: 'Girl\'s Foot Attack',
        uri: 'https://yfcdn.imnotai.com/test/metadata-v5.json',
        sellerFeeBasisPoints: percentAmount(0),
        decimals: some(2), // for 0 decimals use some(0)
      }).sendAndConfirm(umi)
    },
    async mintToken() {
      const rpcUrl = "https://solana-mainnet.api.syndica.io/api-key/8n9dteTVCvEWru8bgBrWYPkEJBhBV71PgXz3MAcNgzZELtvkA9LvD7CuAMge3ydCxZh1wsk787VfPTzCmgtR1aKXYWcoQhrogx";
      // const rpcUrl = clusterApiUrl("testnet");
      const umi = createUmi(rpcUrl);

      const mintPubKey = new PublicKey(
          this.proMintPubKey
      );

      const privateKey = Keypair.fromSecretKey(
          bs58.decode(
              this.privateKey,
          ),
      );

      const keypair = umi.eddsa.createKeypairFromSecretKey(
          privateKey.secretKey
      );

      // Use keypairIdentity to set the keypair as the signer
      const signer = keypairIdentity(keypair);
      umi.use(signer);
      umi.use(mplTokenMetadata());

      const tokenAccountPubkey = new PublicKey(
          this.address
      );

      await mintV1(umi, {
        mint: mintPubKey,
        authority: keypair.publicKey,
        amount: 1000000000,
        tokenOwner: tokenAccountPubkey,
        tokenStandard: TokenStandard.Fungible,
      }).sendAndConfirm(umi)
    },
    async mintToken2(type) {
      // connection
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      const feePayer = Keypair.fromSecretKey(
          bs58.decode(
              this.privateKey
          ),
      );

      const alice = Keypair.fromSecretKey(
          bs58.decode(
              this.privateKey
          ),
      );

      const mintPubkey = new PublicKey(
          this.mintPubKey
      );

      const tokenAccountPubkey = new PublicKey(
          this.tokenAccount
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
    },
    async createTokenAccount(type) {
      // connection
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      const feePayer = Keypair.fromSecretKey(
          bs58.decode(
              this.privateKey
          ),
      );

      const alice = Keypair.fromSecretKey(
          bs58.decode(
              this.privateKey
          ),
      );

      const mintPubkey = new PublicKey(
          this.mintPubKey
      );

      // 1) use build-in function
      let ata = await createAssociatedTokenAccount(
          connection, // connection
          feePayer, // fee payer
          mintPubkey, // mint
          alice.publicKey, // owner,
      );
      console.log('Token Account:', ata.toBase58())

      // or

      // 2) composed by yourself
      if (type === 2) {
        // calculate ATA
        let ata = await getAssociatedTokenAddress(
            mintPubkey, // mint
            alice.publicKey, // owner
        );
        console.log(`ATA: ${ata.toBase58()}`);

        // if your wallet is off-curve, you should use
        // let ata = await getAssociatedTokenAddress(
        //   mintPubkey, // mint
        //   alice.publicKey // owner
        //   true, // allowOwnerOffCurve
        // );

        let transaction = new Transaction().add(
            createAssociatedTokenAccountInstruction(
                feePayer.publicKey, // payer
                ata, // ata
                alice.publicKey, // owner
                mintPubkey, // mint
            ),
        );

        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [feePayer], // Signers
        );

        console.log(`txhash: ${await signature}`);
      }
    },
  }
}
</script>

<style scoped>

</style>
