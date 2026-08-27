<template>
  <dropdown v-if="available">
    <template #toggle="{ show }">
      <button type="button" class="risu-user-toggle risu-notif-toggle" aria-label="알림" :aria-expanded="show">
        <icon name="bell" />
        <span v-if="hasList && notifications.length" class="risu-notif-badge">{{ notifications.length }}</span>
        <span v-else-if="hasUnread" class="risu-notif-badge risu-notif-dot"></span>
      </button>
    </template>
    <div class="dropdown-menu dropdown-menu-right risu-notif-menu">
      <template v-if="hasList">
        <template v-if="notifications.length">
          <template v-for="item in notifications" :key="item.uuid">
            <nuxt-link v-if="linkOf(item)" :to="linkOf(item)" class="dropdown-item risu-notif-item">
              <span class="risu-notif-title">{{ titleOf(item) }}</span>
              <span v-if="previewOf(item)" class="risu-notif-preview">{{ previewOf(item) }}</span>
              <local-date class="risu-notif-date" :date="item.createdAt" relative />
            </nuxt-link>
            <div v-else class="dropdown-item risu-notif-item">
              <span class="risu-notif-title risu-notif-html" v-html="item.data" @click="onDynamicContentClick($event)"></span>
              <local-date class="risu-notif-date" :date="item.createdAt" relative />
            </div>
          </template>
        </template>
        <div v-else class="dropdown-item risu-notif-empty">새 알림이 없습니다.</div>
        <div class="dropdown-divider"></div>
        <nuxt-link to="/member/notifications" class="dropdown-item">알림 전체 보기</nuxt-link>
      </template>
      <div v-else-if="engineMenu" class="risu-notif-engine" @click.stop>
        <component :is="engineMenu" />
      </div>
      <div v-else-if="engineMenuPending" class="dropdown-item risu-notif-empty">불러오는 중…</div>
      <div v-else-if="hasUnread" class="dropdown-item risu-notif-empty">읽지 않은 알림이 있습니다.</div>
      <div v-else class="dropdown-item risu-notif-empty">새 알림이 없습니다.</div>
    </div>
  </dropdown>
</template>

<script>
import { markRaw } from 'vue'
import Common from '~/mixins/common'
import LocalDate from '~/components/localDate'
import Dropdown from './dropdown'
import Icon from './icon'

let bundledEngineMenu = null
try {
  const modules = import.meta.glob('~/components/notificationMenu.vue', { eager: true })
  bundledEngineMenu = Object.values(modules)[0]?.default ?? null
}
catch {
  bundledEngineMenu = null
}

const importEngineMenu = async () => {
  try {
    const module = await import(/* @vite-ignore */ '~/components/notificationMenu.vue')
    return module?.default ?? null
  }
  catch {
    return null
  }
}

export default {
  mixins: [Common],
  components: {
    Dropdown,
    Icon,
    LocalDate,
  },
  data() {
    return {
      importedEngineMenu: null,
      engineMenuPending: false,
    }
  },
  computed: {
    engineMenu() {
      const registered = this.$?.appContext?.components
      const found = bundledEngineMenu
        ?? this.importedEngineMenu
        ?? registered?.NotificationMenu
        ?? registered?.notificationMenu
        ?? null
      return found ? markRaw(found) : null
    },
    hasList() {
      return Array.isArray(this.$store.state.session.notifications)
    },
    hasUnreadFlag() {
      return typeof this.$store.state.session.has_unread_notifications === 'boolean'
    },
    available() {
      if (this.hasUnreadFlag) return true
      return this.$store.state.session.account.type === 1 && this.hasList
    },
    notifications() {
      return this.$store.state.session.notifications ?? []
    },
    hasUnread() {
      if (this.hasUnreadFlag) return this.$store.state.session.has_unread_notifications
      return this.notifications.length > 0
    },
  },
  async mounted() {
    if (!this.hasUnreadFlag || this.engineMenu) return
    this.engineMenuPending = true
    const module = await importEngineMenu()
    if (module) this.importedEngineMenu = markRaw(module)
    this.engineMenuPending = false
  },
  methods: {
    linkOf(item) {
      if (item.url) return item.url
      if (item.thread?.url) return `/thread/${item.thread.url}`
      return null
    },
    titleOf(item) {
      /* NotificationTypes: 0 UserDiscuss, 1 Mention */
      if (item.type === 0) return `사용자 토론: ${item.thread?.topic ?? ''}`
      if (item.type === 1) return `멘션: ${item.thread?.topic ?? ''}${item.comment?.id ? ` #${item.comment.id}` : ''}`
      return ''
    },
    previewOf(item) {
      const text = item.comment?.contentHtml
      return typeof text === 'string' ? this.removeHtmlTags(text) : ''
    },
  },
}
</script>
