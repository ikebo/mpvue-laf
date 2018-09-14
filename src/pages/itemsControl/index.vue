<template lang="html">
    <div id="container">
        <Item :item='item' :isControl='true' v-for='item of items' :key='item.id'></Item>
    </div>
</template>

<script>
import {get} from '@/utils/util'
import Item from '@/components/Item'

export default {
    data: {
        items: [],
        page: 0,
        more: true,
        user_id: null
    },

    components: {
        Item
    },

    methods: {
        editItem (e) {
            let item_id = e.target.dataset.itemid;
            console.log('item_id', item_id);
            wx.redirectTo({
              url: '/pages/editItem/main?item_id=' + item_id
            });
        },

        async getItems() {
            let items = await get(`/api/v1/item/${this.user_id}`)
            this.items = items
            wx.stopPullDownRefresh()
            console.log('this.items', this.items)
        }
    },

    // mounted 之后才能调用methods中的方法
    mounted () {
        console.log('itemsControl', this.$root.$mp.query)
        this.user_id = Number(this.$root.$mp.query.id)
        this.getItems()
    },

    onPullDownRefresh () {
        this.getItems()
    }
}
</script>

<style lang="css">
#container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  background-color: #eee;
}

</style>
