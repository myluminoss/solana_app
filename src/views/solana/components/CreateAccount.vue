<template>
  <div>
    <div>
      <el-button type="primary" @click="requestAirdrop()" :disabled="false">Request Airdrop</el-button>
      <el-button type="primary" @click="createAccount()" :disabled="true">create Account</el-button>
      <el-button type="primary" @click="createTokenAccount()" :disabled="false">Create a Token Account</el-button>
    </div>
    <div>
      <el-input v-model="address" style="width: 640px" readonly :rows="1" type="textarea" placeholder="Please input"/>
    </div>
    <div>
      <el-input v-model="privateKey" style="width: 640px" readonly :rows="2" type="textarea" placeholder="Please input"/>
    </div>
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
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import {
  createAssociatedTokenAccount,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import bs58 from "bs58";

export default {
  name: "CreateAccount",
  data() {
    return {
      address: '',
      privateKey: '',

      feePayerAddress: 'GtYb7ZesTrMYGCcGHj5viWTFdBQFVe1F1tBB2SX4aLUC',
      feePayerPrivateKey: '2nQKdYmXMq2x5SS8DN7Vk7qNBQv5Si96pYPGfGQizrUcLkv2GiXnAuyj8RqTtSTsASK6CSKi6j9g8GFnQV7iFrWx',

      mintPubKey: '2CoZD4ctQMo64mH37YFQCjZ5kE4mfPzoMbGqzqxoYsD1',

      ownerAddress: '2P5XX2yhRbAtTmb8PguukjZAJ2TKXq1r8UZ9orAxmoX5',
      ownerPrivateKey: 'VVv7XJ1Z6KpJKjFnNmfKxKoA9j5LWETf5k7FZ5aij5sV7QXyiQZAvaSGfFeHv4uJaeVx8L7ZBK9rD15LjD9XdMq',

      tokenAccount: 'HJStMjhNa1TdWBHXcxEbwmTCdtfUBDXbhc6rdSwBDRd1',

      ownerAddress2: '3WJSSwpwheJXMoLSmo3x9mQWbibWxQbxU5Pfo73CHPvp',
      ownerPrivateKey2: '2QoSGfsQLjmENXN8bUq7RHGZr6GS4AbSgfMg3dQdWovzN3JDrw6ArSEmMfJ36kuvSRPNDZ89o2iU8kmGSzj5DmqA',

      tokenAccount2: '3TbfZuDqtHcCbHKgyo7rMqRkyoN96bhWHUvTGRTh2vaV',

      nftPubKey: 'G9yj7mZeDsnXxacYPqCpP6vs6noAx22EFb3WAKH6Bjyt',
      nftAccount: 'C6i1zLi61u2sUWXRgnkXMkHA4dF4jHGDZEtbs8vtrmG6',
      nftAccount2: '6PMnfU2RKV4ksgYMw9w4nVf1peQXcGavsw4TjqB5HNHH',

      proMetadataToken: 'HLo4jQsVVoXhpkQeoCH3eU3UY76JGEu27HZAZf94MN6c'
    }
  },
  methods: {
    async requestAirdrop() {
      const mintPubkey = new PublicKey(
          this.feePayerAddress
      );
      // connection
      const connection = new Connection(clusterApiUrl("testnet"), "confirmed");

      const signature = await connection.requestAirdrop(
          mintPubkey,
          LAMPORTS_PER_SOL,
      );
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });
    },
    async createTokenAccount(type) {
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
              this.ownerPrivateKey
          ),
      );

      const mintPubkey = new PublicKey(
          this.proMetadataToken
      );

      // 1) use build-in function
      let ata = await createAssociatedTokenAccount(
          connection, // connection
          feePayer, // fee payer
          mintPubkey, // mint
          alice.publicKey, // owner,
      );
      this.address = ata.toBase58();

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
    createAccount() {
      // 1. Connecting to the Solana Network
      // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

      // 2. Create a new key pair (i.e. a new account)
      const newAccount = Keypair.generate();

      const publicKey = newAccount.publicKey;
      const privateKey = newAccount.secretKey;

      this.address = publicKey.toBase58();

      this.privateKey = bs58.encode(privateKey);

      /* connection.getAccountInfo(publicKey)
          .then((accountInfo) => {
              console.log('Account Information:', accountInfo);
          })
          .catch((err) => {
              console.error('Error getting account information:', err);
          }); */
    }
  }
}
</script>

<style scoped>

</style>
