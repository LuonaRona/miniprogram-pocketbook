<template>
  <view>
    <view class="history-list">
      <view class="pocket-book"
        v-for="item in list"
        :key="item._id">
        <view class="pocket-book-icon"
          :style="'color:' + item.pocketbook.color">
          <image :src="item.pocketbook.path"></image>
        </view>
        <view class="pocket-book-info">
          <text class="type">{{ item.pocketbook.type_name }}</text>
          <text class="amount">{{ item.pocketbook.amount | amount }}</text>
          <text class="sub-text">
            <text>{{ item.pocketbook.account_name }}</text>
            <text>{{ item.pocketbook.type }}</text>
            <text>{{ item.pocketbook.description }}</text>
          </text>
        </view>
        <view class="switch">
          <switch
            style="transform: scale(0.7)"
            :checked="!item.disable"
            @change="onChange($event, item)" />
          <text class="sub-text" v-if="!item.disable">{{ item.pocketbook._description }}</text>
          <text class="small-text text-red" v-else>已关闭</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'timed-auto-record-list',
  props: {
    list: Array
  },
  methods: {
    onChange({ target: { value }}, item) {
      this.$emit('onSwitchChange', {
        ...item, checked: value
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.history-list {
  padding: 0 10px;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;

  .pocket-book {
    padding-bottom: 5px;
    margin: 5px 0;
    border-bottom: 1px dashed $light-grey;
    display: flex;
    align-items: center;

    &:last-of-type {
      border-bottom: 0;
    }

    &-icon {
      margin-right: 10px;
      width: 36px;
      height: 36px;
      min-width: 36px;
      min-height: 36px;
      border-radius: 100%;
      border: 1px solid;

      & > image {
        width: 100%;
        height: 100%;
        display: inline-block;
      }
    }

    &-info {
      font-size: 14px;
      flex: 1 1 auto;
      text-align: left;

      .amount {
        margin-left: .5em;
      }

      .sub-text {
        color: inherit;
        font-size: 12px;
        display: block;

        text + text {
          margin-left: .5em;
        }

        text:last-of-type {
          color: $secondary-text;
        }
      }
    }
  }
  
  .switch {
    width: 52px;
    min-width: 52px;
    text-align: center;

    .sub-text {
      text-align: center;
      font-size: 12px;
      color: $secondary-text;
      display: block;
    }
  }
}

</style>