<template>
  <div class="component">
    <div class="component-content">{{ msg }}</div>
  </div>
</template>

<script>
export default {
  name: 'VComponent',
  props: {
    msg: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
.component{
  font-size: 14px;
  .component-content{
    color: #40b883;
  }
}
</style>
