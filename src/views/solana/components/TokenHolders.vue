<template>
  <div>
    <el-button type="primary" @click="getHolders()" :disabled="false">Get holder</el-button>
    <el-button type="primary" @click="getHolders2()" :disabled="false">Get Holder 2</el-button>
  </div>
</template>

<script>
import { fetchAllDigitalAssetWithTokenByMint } from '@metaplex-foundation/mpl-token-metadata'
import {createUmi} from "@metaplex-foundation/umi-bundle-defaults";
import {clusterApiUrl, PublicKey} from "@solana/web3.js";

export default {
  name: "TokenHolders",
  data() {
    return {
      mintPubKey: 'H6eVsMr7fqM8GeEKQL67dJHbszn12ZiQqDuWMM2dba6K',
      mintPubKey2: 'ADotF9jDuxrBrtwZdxSMrMqGCLTeaJ4rJC63PF1zpump',
    }
  },
  methods: {
    async getHolders() {
      const umi = createUmi(clusterApiUrl("devnet"));
      const mintPubKey = new PublicKey(
          this.mintPubKey
      );

      const assets = await fetchAllDigitalAssetWithTokenByMint(umi, mintPubKey)
      console.log(assets)
    },
    async getHolders2() {
      // const url = clusterApiUrl("mainnet-beta");
      const url = "https://solana-mainnet.api.syndica.io/api-key/8n9dteTVCvEWru8bgBrWYPkEJBhBV71PgXz3MAcNgzZELtvkA9LvD7CuAMge3ydCxZh1wsk787VfPTzCmgtR1aKXYWcoQhrogx";
      console.log(url);
      const umi = createUmi(url);
      const mintPubKey = new PublicKey(
          this.mintPubKey2
      );

      const assets = await fetchAllDigitalAssetWithTokenByMint(umi, mintPubKey)
      console.log(assets)
    }
  }
}
</script>

<style scoped>

</style>
