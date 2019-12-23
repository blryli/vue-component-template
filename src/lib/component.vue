<template>
  <div class="component">
    {{ msg }}
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

<style scoped>
.component{
  font-size: 14px;
}
</style>
