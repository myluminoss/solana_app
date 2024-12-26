<template>
  <div class="center-container">
    <div style="margin-bottom: 20px; ">
      <el-button type="primary" @click="connectCoinbase()">Connect to wallet</el-button>
      <el-button type="primary" @click="addNetwork()">Add network configuration</el-button>
    </div>
    <div style="margin-bottom: 20px; ">
      <el-button type="primary" @click="deployCollection()">Deploy NFTs</el-button>
    </div>
    <div style="margin-bottom: 20px; ">
      <el-button type="primary" @click="getBalance()">Get Balance</el-button>
      <el-button type="primary" @click="getTPS()">Get TPS</el-button>
    </div>
    <div style="margin-bottom: 20px; ">
      <el-button type="primary" @click="launchPumpFunToken()">Issuing PumpFunToken</el-button>
    </div>
  </div>
</template>

<script>
import { Keypair, PublicKey } from "@solana/web3.js";
import { SolanaAgentKit, createSolanaTools } from 'solana-agent-kit';
// import { deploy_collection } from 'solana-agent-kit/dist/tools/deploy_collection.js';
import { useAppStore } from '@/store/app';
import bs58 from "bs58";

export default {
  name: 'SolanaIndex',
  data() {
    return {
      address: 'GtYb7ZesTrMYGCcGHj5viWTFdBQFVe1F1tBB2SX4aLUC',
      agent: null,
      solanaTools: null,
      appStore: useAppStore()
    }
  },
  mounted() {
    this.initSolanaAgentKit();
  },
  methods: {
    async launchPumpFunToken() {
      const r1 = await this.agent.registerDomain('http://solana.test.com')
      console.log(r1)
      const opt = {
        initialLiquiditySOL: 1000,
        priorityFee: 100,
        slippageBps: 9,
        telegram: 'https://me.foija',
        twitter: 'https://me.foija',
        website: 'https://me.foija'
      };
      const r = await this.agent.launchPumpFunToken(
          'My Test Token', 'Lmtt', 'xi xi ha ha', 'https://cyaa.woodii.cn/upload/9a109f95-1744-493e-b7a2-da3c68a2fae0.png?x-oss-process=image/resize,m_fill,w_200,h_200',
          opt
      );
      console.log(r)
    },
    async getTPS() {
      const tps = await this.agent.getTPS();
      console.log(tps)
    },
    async getBalance() {
      const publicKey = new PublicKey('FqL7iHymjcYRMimPvPZezCgK2iv2LVXzF171QUfcRbU4');
      const balance = await this.agent.getBalance(publicKey);
      console.log(balance)
    },
    async connectCoinbase() {
      try {
        await window.coinbaseSolana.connect();
      } catch (err) {
        console.log(err)
        // { method: 'connect', message: 'Connection error' }
      }
    },
    initSolanaAgentKit() {
      // new publicKey: GtYb7ZesTrMYGCcGHj5viWTFdBQFVe1F1tBB2SX4aLUC
      // new privateKey: 2nQKdYmXMq2x5SS8DN7Vk7qNBQv5Si96pYPGfGQizrUcLkv2GiXnAuyj8RqTtSTsASK6CSKi6j9g8GFnQV7iFrWx
      // const privateKey = '6addb4277538addf9f2f3b3cc08a4ab90cfe517e66dace59de48875f5afee39c';

      const privateKey = '2nQKdYmXMq2x5SS8DN7Vk7qNBQv5Si96pYPGfGQizrUcLkv2GiXnAuyj8RqTtSTsASK6CSKi6j9g8GFnQV7iFrWx';
      // Initialize with private key and optional RPC URL
      this.agent = new SolanaAgentKit(
          privateKey,
          "https://api.devnet.solana.com"
      );

      // Create LangChain tools
      this.solanaTools = createSolanaTools(this.agent);
    },
    async deployCollection() {
      const nftData = {
        name: "My Awesome NFT",
        uri: "https://ipfs.io/ipfs/QmdDepQkRUQk51PURdmhQyzmsratULwviMEH4d48J48Ysq",
        royaltyBasisPoints: 5,
        creators: [
          {
            address: this.address,
            percentage: 100
          }
        ]
      };

      try {
        const nftAddress = await this.agent.deployCollection(nftData);
        console.log(`NFT successfully deployed at address: ${nftAddress}`);
      } catch (error) {
        console.error('Error deploying NFT:', error);
      }

      /* const collection = await deploy_collection(this.agent, {
        name: "My NFT Collection",
        uri: "https://arweave.net/metadata.json",
        royaltyBasisPoints: 500, // 5%
        creators: [
          {
            address: "creator-wallet-address",
            percentage: 100
          }
        ]
      });
      console.log(collection) */

      /* const publicKey = new PublicKey("");
      const signatureArray = new Uint8Array([1, 2, 3]);
      const deployment = new CollectionDeploymentImpl(publicKey, signatureArray);
      console.log(deployment.collectionAddress.toBase58());
      console.log(deployment.signature); */

      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // Create LangChain tools
      // const tools = createSolanaTools(agent);
      // console.log('Tool Object：', tools)
    },
    createAccount() {
      // 1. Connecting to the Solana Network
      // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

      // 2. Create a new key pair (i.e. a new account)
      const newAccount = Keypair.generate();

      const publicKey = newAccount.publicKey;
      const privateKey = newAccount.secretKey;

      console.log('New account public key:', publicKey.toBase58());

      const privateKeyHexString = bs58.encode(privateKey);
      console.log('New account private key:', privateKeyHexString);

      /* connection.getAccountInfo(publicKey)
          .then((accountInfo) => {
              console.log('Account Information:', accountInfo);
          })
          .catch((err) => {
              console.error('Error getting account information:', err);
          }); */
    },
    deployToken() {
      // deploy token ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      /* const result = await deploy_token(
          agent,
          9, // decimals
          1000000 // initial supply
      );

      console.log('Token Mint Address:', result.mint.toString());
      // Token Mint Address: FqL7iHymjcYRMimPvPZezCgK2iv2LVXzF171QUfcRbU4 */
    },
    isCoinbaseInstalled() {
      return !!window.coinbaseSolana;
    },
    addNetwork() {

    },
    async addSolanaNetwork() {
      if (this.isCoinbaseInstalled()) {
        try {
          const solanaNetworkParams = {
            networkName: "Solana Devnet",
            rpcUrl: "https://api.devnet.solana.com",
            chainId: 103,
            nativeCurrency: {
              symbol: "SOL",
              decimals: 9
            }
          };
          await window.coinbaseSolana._request({
            method: "addSolanaNetwork",
            params: [solanaNetworkParams]
          });
        } catch (error) {
          console.error("error：", error);
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
