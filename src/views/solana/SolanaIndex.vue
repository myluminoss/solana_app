<template>
  <div class="center-container">
    <div style="margin-bottom: 20px; ">
      <ApiAccount></ApiAccount>
    </div>
    <div style="margin-bottom: 20px; ">
      <CreateAccount></CreateAccount>
    </div>
    <div style="margin-bottom: 20px; ">
      <CreateToken></CreateToken>
    </div>
    <div style="margin-bottom: 20px; ">
      <MintToken></MintToken>
    </div>
    <div style="margin-bottom: 20px; ">
      <NFTTest></NFTTest>
    </div>
    <div style="margin-bottom: 20px; ">
      <MetadataToken></MetadataToken>
    </div>
    <div style="margin-bottom: 20px; ">
      <TokenHolders></TokenHolders>
    </div>
    <div style="margin-bottom: 20px; ">
      <RaydiumTest></RaydiumTest>
    </div>
  </div>
</template>

<script>
import CreateToken from "@/views/solana/components/CreateToken.vue";
import CreateAccount from "@/views/solana/components/CreateAccount.vue";
import MintToken from "@/views/solana/components/MintToken.vue";
import NFTTest from "@/views/solana/components/NFTTest.vue";
import MetadataToken from "@/views/solana/components/MetadataToken.vue";
import TokenHolders from "@/views/solana/components/TokenHolders.vue";
import RaydiumTest from "@/views/solana/components/RaydiumTest.vue";
import ApiAccount from "@/views/solana/components/ApiAccount.vue";

export default {
  name: "SolanaIndex",
  components: {ApiAccount, RaydiumTest, TokenHolders, MetadataToken, NFTTest, MintToken, CreateAccount, CreateToken},
  data() {
    return {}
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
