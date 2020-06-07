<template>
  <view class="pocketbook-groups">
    <view class="header" @click="isShow = !isShow">
      <view class="lt">
        <view class="date">
          <text class="month">{{ month | zeroPadding }}月</text>
          <text class="year">{{ year }}年</text>
        </view>
        <view class="details">
          <text>流入：{{ inTotal | amount }}</text>
          <text>流出：{{ outTotal | amount }}</text>
        </view>
      </view>
      <view class="rt">
        <view class="total">
          <text v-if="isPositiveInteger">+</text>
          <text>{{ total | amount }}</text>
          <text class="small-text">月结余</text>
        </view>
        <view class="arrow" :class="isShow ? 'rotate-0' : 'rotate-180'">
          <text class="lg text-gray cuIcon-triangledownfill"></text>
        </view>
      </view>
    </view>
    <view class="pocketbook-list" :class="isShow ? 'height-auto': 'height-0'">
      <account-pocketbook-group
        class="list-item"
        :total="pocketbook.total"
        :date="pocketbook.date"
        :list="pocketbook.list"
        v-for="pocketbook in list"
        :key="pocketbook.date">
      </account-pocketbook-group>
    </view>
  </view>
</template>
<script>
import AccountPocketbookGroup from '@/components/account-pocketbook-group/AccountPocketbookGroup'
import { zeroPadding } from '@/utils/index'

export default {
  name: 'account-pocketbook-groups',
  components: { AccountPocketbookGroup },
  filters: { zeroPadding },
  props: {
    month: Number,
    year: Number,
    inTotal: Number,
    outTotal: Number,
    list: Array,
    defaultShow: Boolean,
  },
  computed: {
    total() {
      return this.inTotal - this.outTotal
    },
    isPositiveInteger() {
      return this.total > 0
    }
  },
  data() {
    return {
      isShow: true
    }
  },
  created() {
    this.isShow = !!this.defaultShow
  }
}
</script>

<style lang="scss" scoped>
.pocketbook-groups {
  border-bottom: 1px solid $light-grey;
}

.pocketbook-list {
  max-height: 0;
  transition: .3s max-height ease-in-out;
  overflow: auto;
}

.height-0 {
  max-height: 0 !important;
}

.height-auto {
  max-height: 270px !important;
}

.header {
  padding: 10px 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $white;

  .date {
    width: 50px;
    display: inline-block;

    & > text {
      display: block;

      &.month {
        font-size: 18px;
        color: $primary-text;
      }

      &.year {
        font-size: 12px;
        color: $regular-text;
      }
    }
  }

  .details {
    font-size: 14px;
    color: $regular-text;
    display: inline-block;

    & > text {
      display: block;
    }
  }

  .rt {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .total {
    font-size: 22px;
    color: $primary-text;

    .small-text {
      text-align: right;
      color: $regular-text;
      display: block;
    }

  }
  .lg {
    font-size: 24px;
  }

  .arrow {
    transition: .3s all ease-in-out;

    &.rotate-0 {
      transform: rotate(0deg);
    }

    &.rotate-180 {
      transform: rotate(180deg);
    }
  }
}

.list-item {
  border-bottom: 1px solid $grey;

  &:last-of-type {
    border-bottom: 0;
  }
}
</style>