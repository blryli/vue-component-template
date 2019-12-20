<template>
  <div class="page-Start page">
    <section class="snippets">
      <div class="section-content">
        <CodeSnippet class="snippet" :code="mainSnippet" lang="js" />
        <div class="plus">+</div>
        <CodeSnippet class="snippet" :code="componentSnippet" lang="html" />
        <div class="plus">+</div>
        <CodeSnippet class="snippet" :code="styleSnippet" lang="scss" />
      </div>
    </section>
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import { config } from '../config'

const nameToUpperCase = config.name.split('-').reduce((acc, cur) => acc + cur.replace(cur[0], cur[0].toUpperCase()), '')

const mainSnippet = `
import Vue from 'vue'
import ${nameToUpperCase} from '${config.name}'

Vue.use(${nameToUpperCase})
`
const componentSnippet = `
<template>
  <v-component />
</template>
`

const styleSnippet = ``

export default {
  name: 'Start',
  linkName: '上手',
  order: 2,
  components: {
    CodeSnippet
  },
  data() {
    return {
      mainSnippet,
      componentSnippet,
      styleSnippet
    }
  }
}
</script>
