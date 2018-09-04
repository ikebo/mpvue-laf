<template lang="html">
<div id="container">
    <div class="item" v-for="(item, index) of items" :key="index">

        <div class="item-left">
            <img :src="item.img" />
        </div>

    <div class="item-right">
        <p v-if="item.itemType == 0">类型：失物</p>
        <p v-else>类型：招领</p>
        <p>时间：{{item.date}}</p>
        <p>地点：{{item.place}}</p>

        <div class="btn-group">
            <button @tap='editItem' :data-itemid="item.id" size="mini" type="primary" :plain="true">修改</button>
            <button @tap='deleteItem' :data-itemid="item.id" size="mini" type="warn" :plain="true">删除</button>
        </div>
    </div>

    </div>

</div>
</template>

<script>
import Config from '@/utils/config'
export default {
    data: {
        service: Config['service'],
        items: null
    },
    methods: {
        get_index (item_id) {
            let items = this.items;
            for(let i=0; i<items.length; ++i) {
                if(items[i].id === item_id) {
                    return i;
                }
            }
                return -1;
        },
        editItem (e) {
            let item_id = e.target.dataset.itemid;
            console.log('item_id', item_id);
            wx.redirectTo({
              url: '/pages/editItem/main?item_id=' + item_id
            });
        },
        deleteItem (e) {
          let item_id = e.mp.target.dataset.itemid;
          let item_index = this.get_index(item_id);
          if (item_index === -1) {
            wx.showToast({
              title: '获取物品失败',
              icon: 'none'
            });
            return ;
          }
          console.log('item_index', item_index);
          wx.showModal({
            title: '提示',
            content: '确认删除吗',
            success: res => {
              if (res.confirm) {
                console.log('用户点击确定');
                // 请求删除
                wx.request({
                  url: this.service + '/api/v1/item/' + item_id,
                  method: 'DELETE',
                  success: res => {
                    console.log('delete res', res);
                    if(res.data.code === 1) {
                      this.items.splice(item_index, 1);
                      wx.setStorageSync("userItems",this.items);
                      console.log(wx.getStorageSync("userItems"));
                    }
                  }
                });
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          });
        }
    },

    beforeMount (options) {
        let items = wx.getStorageSync('userItems');
        this.items = items
        console.log('items', this.items);
    },

    onPullDownRefresh () {
    console.log('pull');
    let items = wx.getStorageSync('userItems');
    this.items = items
    console.log('items', this.items);
    }



}
</script>

<style lang="css">
.item {
    height: 200rpx;
    display: flex;
    flex-flow: row nowrap;
}

.item-left {
    height: 100%;
    width: 200rpx;
}

.item-left image {
    width: 100%;
    height: 100%;
}

.item-right {
    display: flex;
    flex-flow: column nowrap;
}
</style>
