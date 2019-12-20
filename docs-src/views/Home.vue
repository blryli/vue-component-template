<template>
  <div class="page-home page">
    <section class="demo">
      <div class="section-content">
        <h2>Reactive content</h2>
        <v-component />
      </div>
    </section>

    <section class="snippets">
      <Collapse title="Show code">
        <div class="section-content">
          <CodeSnippet class="snippet" :code="mainSnippet" lang="js" />
          <div class="plus">+</div>
          <CodeSnippet class="snippet" :code="componentSnippet1" lang="html" />
        </div>
      </Collapse>
    </section>
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'
import ExampleComponent from '../components/ExampleComponent.vue'

const mainSnippet = `
import Vue from 'vue'
import VTooltip from 'v-tooltip'

Vue.use(VTooltip)

new Vue({
  data: {
    msg: 'This is a button.'
  }
})
`

const componentSnippet1 = `
<button v-tooltip.top-center="msg">Hover me</button>
`

export default {
  name: 'Home',
  components: {
    CodeSnippet,
    Collapse,
    ExampleComponent
  },

  data() {
    return {
      msg: `This is a button.`,
      placement: 'bottom-center',
      isAutoHiding: false,
      isEnabled: true,
      isVisible: true,
      isOpen: false,
      offset: 16,
      mainSnippet,
      componentSnippet1
    }
  }
}
</script>
