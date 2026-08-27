<template>
  <div v-if="visible" class="risu-ads" :class="`risu-ads-${position}`">
    <ins ref="ins" class="adsbygoogle"
         :data-ad-client="client"
         :data-ad-slot="slotId"
         :data-ad-format="adFormat"
         :data-full-width-responsive="fullWidthResponsive"></ins>
  </div>
</template>

<script>
export default {
  props: {
    position: {
      type: String,
      required: true,
    },
  },
  computed: {
    client() {
      return this.$store.state.config['skin.risu.ad_client']
    },
    slotId() {
      return this.$store.state.config[`skin.risu.ad_slot_${this.position}`]
    },
    adsHidden() {
      return this.$store.state.localConfig['risu.ads'] === false
        && this.$store.state.session.account.type !== 0
    },
    visible() {
      return !!this.client && !!this.slotId && !this.adsHidden
    },
    adFormat() {
      return this.position === 'header' ? 'horizontal' : 'auto'
    },
    fullWidthResponsive() {
      return this.position === 'header' ? 'false' : 'true'
    },
  },
  mounted() {
    this.push()
  },
  watch: {
    visible(value) {
      if (value) this.$nextTick(this.push)
    },
  },
  methods: {
    push() {
      if (!this.visible || !this.$refs.ins || this.$refs.ins.dataset.adsbygoogleStatus) return
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
      catch {
        return
      }
    },
  },
}
</script>
