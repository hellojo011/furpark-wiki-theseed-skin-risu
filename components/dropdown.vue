<template>
  <FloatingDropdown v-if="fixed" v-model:shown="show" class="dropdown" strategy="fixed" placement="bottom-end"
                    :distance="8" :overflow-padding="8" :triggers="['click']" auto-hide container=".risu"
                    popper-class="risu-dropdown-popper">
    <div ref="toggle"><slot name="toggle" :show="show"></slot></div>
    <template #popper>
      <div @click="hide"><slot></slot></div>
    </template>
  </FloatingDropdown>
  <div v-else ref="dropdown" class="dropdown">
    <div ref="toggle" @click="toggle"><slot name="toggle" :show="show"></slot></div>
    <div v-if="show" @click="hide" class="open"><slot></slot></div>
  </div>
</template>

<script>
import { Dropdown as FloatingDropdown } from 'floating-vue'

export default {
  components: { FloatingDropdown },
  props: {
    fixed: { type: Boolean, default: false },
  },
  data() {
    return {
      show: false,
    }
  },
  methods: {
    toggle() {
      this.show = !this.show
    },
    hide() {
      this.show = false
    },
    backdrop(e) {
      if (this.fixed) return
      if (this.show && !this.$refs.dropdown?.contains(e.target)) this.hide()
    },
    onKeydown(e) {
      if (e.key !== 'Escape' || !this.show) return
      this.hide()
      this.$nextTick(() => {
        this.$refs.toggle?.querySelector('button, a[href]')?.focus()
      })
    },
  },
  mounted() {
    document.addEventListener('click', this.backdrop)
    document.addEventListener('keydown', this.onKeydown)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.backdrop)
    document.removeEventListener('keydown', this.onKeydown)
  },
}
</script>
