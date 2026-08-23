<template>
  <setting class="risu-setting">
    <setting-item-select label="사이드바 설정" ckey="risu.sidebar" :default="sidebar">
      <option value="right">우측 표시</option>
      <option value="hide">숨김</option>
      <option value="footer">하단 표시</option>
    </setting-item-select>
    <setting-item-select label="색상" ckey="risu.color" default="">
      <option value="">기본 (위키 설정)</option>
      <option value="pink">핑크</option>
      <option value="lavender">라벤더</option>
      <option value="mint">민트</option>
      <option value="sky">하늘</option>
      <option value="peach">복숭아</option>
      <option value="custom">직접 입력</option>
    </setting-item-select>
    <setting-item-input v-if="$store.state.localConfig['risu.color'] === 'custom'" label="색상 코드" note="#RRGGBB" ckey="risu.color_custom" />
    <setting-item-select label="글꼴" ckey="risu.font" default="">
      <option value="">시스템 기본</option>
      <option value="pretendard">Pretendard</option>
      <option value="noto">Noto Sans KR</option>
      <option value="custom">직접 입력</option>
    </setting-item-select>
    <setting-item-input v-if="$store.state.localConfig['risu.font'] === 'custom'" label="글꼴" note="설치된 글꼴 이름, 폰트 파일 주소, 또는 스타일시트 주소" ckey="risu.font_custom" />
    <setting-item-input v-if="needsFontFamily" label="글꼴 이름" note="스타일시트에 정의된 이름 (예: Noto Serif KR). 스타일시트는 문서 모양을 바꿀 수 있으니 믿을 수 있는 주소만 넣으세요." ckey="risu.font_custom_family" />
    <setting-item-checkbox label="떠 있는 내비게이션 바" ckey="risu.floating_navbar" :default="true" />
    <setting-item-checkbox label="페이지 이동 시 검색 창 초기화" ckey="risu.reset_search_on_move" :default="true" />
    <setting-item-checkbox label="넓은 화면 모드" ckey="risu.wide_mode" />
    <setting-item-checkbox v-if="canHideAds" label="광고 표시" ckey="risu.ads" :default="true" />
    <template v-if="$store.state.session.quick_block">
      <hr />
      <setting-item-checkbox label="[ADMIN] 관리 편의성 개선" ckey="risu.admin_convenience" :default="true" />
    </template>
  </setting>
</template>

<script>
import Common from '~/mixins/common'

import Setting from '~/components/setting'
import SettingItemCheckbox from '~/components/settingItemCheckbox'
import SettingItemInput from '~/components/settingItemInput'
import SettingItemSelect from '~/components/settingItemSelect'

import { isMobile } from '~/utils'

export default {
  mixins: [Common],
  components: {
    Setting,
    SettingItemCheckbox,
    SettingItemInput,
    SettingItemSelect,
  },
  computed: {
    sidebar() {
      return isMobile ? 'hide' : 'right'
    },
    needsFontFamily() {
      if (this.$store.state.localConfig['risu.font'] !== 'custom') return false
      const value = (this.$store.state.localConfig['risu.font_custom'] ?? '').trim()
      if (!/^https:\/\//i.test(value)) return false
      return !/\.(woff2|woff|ttf|otf)$/i.test(value.split('?')[0])
    },
    canHideAds() {
      return !!this.$store.state.config['skin.risu.ad_client']
        && this.$store.state.session.account.type !== 0
    },
  },
}
</script>
