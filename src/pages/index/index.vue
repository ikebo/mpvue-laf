<template>
<div id="container">
    <div class="item" v-for="(item, index) of itemData" :key="index">
        <div class="item-left">
            <img :src="item.img" />
        </div>
        <div class="item-right">
            <p v-if="item.itemType === 1">类型：招领</p>
            <p v-else>类型：失物</p>
            <p>时间：{{item.date}}</p>
            <p>地点：{{item.place}}</p>
            <p>描述: {{item.des}}</p>
            <button :data-itemid='item.id' @tap='onLookClick' type='primary' size='mini' :plain='true'>查看</button>
        </div>
    </div>
</div>
</template>

<script>
import Config from '@/utils/config'

export default {
  data () {
      return {
          itemData: null,
          service: Config['service']
      }
  },

  methods: {
      onLookClick: function(event) {
          console.log('e', event)
          let itemId = event.target.dataset.itemid;
          console.log(event.target.dataset.itemid);
          wx.navigateTo({
            url: '/pages/itemDetail/main?itemId=' + itemId
          })
      }
  },


  created () {
      wx.request({
          url: this.service + '/api/v1/item',
          method: 'GET',
          success: res => {
            console.log('in index.vue')
            let data = res.data;
            console.log(res.data.userData);
            if (data.code === 1) {
              // 获取数据成功
              console.log('获取物品数据成功')
              this.itemData = data.userData;
              console.log('item_data: ', this.itemData);

            // 缓存数据
            wx.setStorage({
              key: 'itemData',
              data: this.itemData,
              success: ()  => {
                console.log('物品数据缓存成功');
              }
            });

          } else {
            wx.showToast({
              title: '获取数据失败',
              icon: 'none'
            });
          }
        }
      });
  }
}
</script>

<style scoped>
#container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  padding-left: 20rpx;
  padding-top: 20rpx;
}

.item {
  display: flex;
  flex-flow: row nowrap;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.item-left {
  width: 200rpx;
  box-sizing: border-box;
}

.item-left img {
  width: 100%;
  height: 100%;
  border-radius: 5rpx;
}

.item-right {
  display: flex;
  flex-flow: column nowrap;
  width: 550rpx;
  box-sizing: border-box;
  justify-content: space-between;
  margin-left: 20rpx;
  position: relative;
}

.item-right p {
  font-size: 0.8em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
}

.item-right button {
  position: absolute;
  top: 0rpx;
  right: 25rpx;
}

#bottom {
  z-index: 2;
  position: fixed;
  bottom: 0rpx;
  left: 50%;
  transform: translateX(-50%);
}

#bottom button {
  display: block;
  color: #fff;
  font-size: 0.8em;
  border-radius: 50%;
  background-color: #1195da;
}

</style>
