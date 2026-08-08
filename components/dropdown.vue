<template>
    <div ref="dropdown" class="dropdown" @keydown.esc.stop.prevent="closeOnEscape">
        <div ref="toggle" @click="toggle"><slot name="toggle" :show="show"></slot></div>
        <div v-if="show" @click="hide" class="open" :class="{ 'dropdown-fixed': fixed }" :style="menuStyle"><slot></slot></div>
    </div>
</template>

<script>
export default {
    props: {
        fixed: { type: Boolean, default: false }
    },
    data() {
        return {
            show: false,
            menuStyle: null,
        }
    },
    methods: {
        toggle() {
            this.show ? this.hide() : this.open();
        },
        open() {
            if (this.fixed) {
                this.updatePosition();
                window.addEventListener('scroll', this.hide, true);
                window.addEventListener('resize', this.hide);
            }
            this.show = true;
        },
        hide() {
            if (!this.show) return;
            this.show = false;
            this.menuStyle = null;
            if (this.fixed) {
                window.removeEventListener('scroll', this.hide, true);
                window.removeEventListener('resize', this.hide);
            }
        },
        updatePosition() {
            const rect = this.$refs.toggle.getBoundingClientRect();
            this.menuStyle = {
                position: 'fixed',
                top: `${rect.bottom}px`,
                right: `${window.innerWidth - rect.right}px`,
            };
        },
        backdrop(e) {
            if (this.show && !this.$refs.dropdown.contains(e.target)) this.hide();
        },
        closeOnEscape() {
            if (!this.show) return;
            this.hide();
            this.$nextTick(() => {
                this.$refs.toggle?.querySelector('button, a[href]')?.focus();
            });
        },
    },
    mounted() {
        document.addEventListener('click', this.backdrop);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.backdrop);
        if (this.fixed) {
            window.removeEventListener('scroll', this.hide, true);
            window.removeEventListener('resize', this.hide);
        }
    }
}
</script>
