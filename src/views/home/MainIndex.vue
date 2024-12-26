<template>
  <div class="center-container">
    <el-button type="primary" @click="gotoPage('base')">Base Test</el-button>
    <el-button type="primary" @click="gotoPage('pump')">Pump Test</el-button>
    <el-button type="primary" @click="gotoPage('solana')">Solana Test</el-button>
  </div>
</template>

<script>
export default {
  name: 'MainIndex',
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {
    gotoPage(path) {
      this.$router.push(path);
    }
  }
}
</script>

<style scoped>

</style>
