<template>
  <view class="pocketbook-list v-line" v-if="list.length">
    <view class="pocketbook-list-item"
      v-for="pocketbook in list"
      :key="pocketbook.date">
      <view class="pocketbook-list-total" :class="{'actived': isToday(pocketbook.date)}">
        <text>{{ pocketbook.date | formatDate }}</text>
        <text>{{ pocketbook.total | amount }}</text>
      </view>
      <view
        class="pocketbook-item-container"
        :class="{ 'ltr': pocket.type === '支出'}"
        v-for="pocket in pocketbook.list"
        :key="pocket._id"
        @click="navigateToEdit(pocket)">
        <pocketbook-item
          class="pocketbook-item"
          :iconPath="pocket.path"
          :color="pocket.color"
          :typeName="pocket.type_name"
          :amount="pocket.amount"
          :description="pocket.description"
          :automatic="pocket.automatic"
          :showDirection="pocket.type ==='支出' ? 'ltr': 'rtl'">
        </pocketbook-item>
      </view>
    </view>
  </view>
  <view v-else class="empty-text">你本月还没有开始记录哦!</view>
</template>
<script>
import { mapMutations } from 'vuex'
import PocketbookItem from '@/components/pocketbook-item/PocketbookItem'
import { formatDate } from '@/utils/index'

export default {
  name: 'pocketbook-list',
  components: { PocketbookItem },
  filters: { formatDate },
  props: {
    list: {
      type: Array
    }
  },
  methods: {
    navigateToPocketbook() {
      uni.navigateTo({
        url: '/pages/pocket-book/pocketBook',
      })
    },
    navigateToEdit(pocketbook) {
      this.setCurrentPocketbook(pocketbook)
      this.navigateToPocketbook()
    },
    ...mapMutations({
      setCurrentPocketbook: 'setCurrentPocketbook',
    }),
    isToday(date) {
      return new Date().setHours(0,0,0,0) === new Date(date).getTime()
    }
  }
}
</script>
<style lang="scss" scoped>
.pocketbook-list {
  padding-top: 20px;
  margin-bottom: 35px;

  &-item {
    padding-top: 20px;

    &:first-of-type {
      padding-top: 0;
    }
  }

  &-total {
    padding: 5px 0;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $white;

    &.actived {
      &:after {
        border-color: $primary-color;
      }
    }

    &:after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-45%, -50%);
      width: 6px;
      height: 6px;
      border: 4px solid $grey;
      border-radius: 100%;
      background-color: $white;
      display: block;
    }

    & > text {
      padding: 0 1em;
      color: $secondary-text;
      font-size: 14px;
      flex: 1;

      &:first-of-type {
        text-align: right;
      }

      &:last-of-type {
        text-align: left;
      }
    }
  }

  .pocketbook-item-container {
    margin-top: 20px;
    padding: 3px 0;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: $white;

    &.ltr {
      justify-content: flex-end;
    }

    .pocketbook-item {
      width: calc(50% + 17.5px);
    }
  }

  .empty-text {
    width: 100%;
    height: 100%;
    background-color: $white;
  }
}

</style>