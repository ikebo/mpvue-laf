<template>
<div id="container">
    <Item :item='item' v-for='item of items' :key='item.id'></Item>
</div>
</template>

<script>
import Config from '@/utils/config'
import {get} from '@/utils/util'
import Item from '@/components/Item'

export default {
  data () {
      return {
          items: null,
          service: Config['service']
      }
  },

  components: {
      Item
  },

  methods: {
      async getItems () {
        const items = await get('/api/v1/item')
        console.log('index items', items)
        this.items = items
        wx.setStorageSync('itemData',this.items)
        console.log('物品数据已缓存')
      }
  },

  beforeMount () {
      this.getItems()
  }
}
</script>

<style scoped>
#container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  background-color: #eee;
}
</style>
