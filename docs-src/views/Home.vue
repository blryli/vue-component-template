<template>
  <div class="home">
    <div class="container">
      <h2>home</h2>
      <v-component />
    </div>
  </div>
</template>

<script>
export default {
  linkName: '主页',
  data() {
    return {
      radio: null
    }
  }
}
</script>

<style lang="scss">
.home{
  padding: 20px 40px;
}
.container{
  padding: 20px;
  background-color: lighten($primary-color, 50%);
}
</style>
