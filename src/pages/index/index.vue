<template>
<div id="container">
    <Item :item='item' :isControl='false' v-for='item of items' :key='item.id'></Item>
    <p class="footer" v-if='!more'>没有更多数据</p>
</div>
</template>

<script>
import Config from '@/utils/config'
import {get} from '@/utils/util'
import Item from '@/components/Item'

export default {
  data () {
      return {
          items: [],
          page: 0,
          more: true
      }
  },

  components: {
      Item
  },

  methods: {
      async getItems (init) {
        if (init) {
            this.page = 0
            this.more = true
        }
        wx.showNavigationBarLoading()
        const items = await get('/api/v1/item', {page:this.page})
        console.log('index items', items)
        if (items.length < 8 && this.page > 0) {
            this.more = false
        }
        if (init) {
            this.items = items
            console.log('this.items', this.items)
            wx.stopPullDownRefresh()
        } else {
            this.items = this.items.concat(items)
            console.log('concat', this.items)
        }
        wx.hideNavigationBarLoading()
      }
  },

  beforeMount () {
      this.getItems(true)
  },

  onPullDownRefresh () {
      this.getItems(true)
  },

  onReachBottom() {
      if (!this.more) {
          return false
      }
      this.page +=  1
      console.log('this.page', this.page)
      this.getItems(false)
  }
}
</script>

<style scoped>

* {
    margin: 0;
    padding: 0;
}

#container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  background-color: #eee;
}

.footer {
    width: 100%;
    text-align: center;
    color: #999;
    font-size: .7em;
    margin-top: -10rpx;
    margin-bottom: 10rpx;
}

</style>
