<template lang="html">
<div class="item">
    <div class="header">
        <img :src="user.avatarUrl" />
        <p class="header-middle">
            <span class="nickname">{{user.nickName}}</span>
            <span class="time">{{month}}月{{day}}日</span>
        </p>
        <div class="header-right">
            <button @click='bindContact' type="warn" size='mini' :plain='true'>联系Ta</button>
        </div>
    </div>

    <div class="middle">
        <p>
            <span class="title" v-if="item.itemType === 1">#失物招领#&nbsp;</span>
            <span class="title" v-else>#寻物启事#&nbsp;</span>
            <span class="des">{{item.des}}</span>
        </p>
        <div class="display">
            <img :src="item.img" />
        </div>
    </div>
</div>

</template>

<script>
export default {
    props: ['item'],
    data () {
        return {
            user: this.item.user
        }
    },
    computed: {
        month () {
            let arr = this.item.date.split('-')
            return Number(arr[1])
        },
        day() {
            let arr = this.item.date.split('-')
            return Number(arr[2])
        }
    },
    methods: {
        bindContact () {
            wx.makePhoneCall({
              phoneNumber: this.user.phoneNumber
            });
        }
    }
}
</script>

<style lang="css">

* {
    margin: 0;
    bottom: 0;
}

.item {
    margin-bottom: .2rem;
    background-color: #fff;
    padding: .2rem;
}


.middle {
    margin: .1rem 0;
    font-size: .8em;
}

.middle .title {
    color: red;
}

.middle img {
    width: 220rpx;
    height: 200rpx;
    border-radius: .05rem;
    margin-top: .2rem;
}

.header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
}

.header-middle {
    margin-left: .2rem;
    display: flex;
    flex-flow: column nowrap;
}

.header-middle .nickname {
    font-size: .8em;
    font-weight:400;
}

.header-middle .time {
    font-size: .7em;
}

.header img {
    display: inline-block;
    height: 1rem;
    width: 1rem;
    border-radius: .5rem;
}

.header {
    position: relative;
}

.header-right  button {
    border-radius: 0.05rem;
    width: 1.2rem;
    padding: 0;
    font-size: .65em;
    position: absolute;
    right: 0;
}

</style>

/* .item {
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
} */
<!-- <div class="item-left">
    <img :src="item.img" />
</div>
<div class="item-right">
    <p v-if="item.itemType === 1">类型：招领</p>
    <p v-else>类型：失物</p>
    <p>时间：{{item.date}}</p>
    <p>地点：{{item.place}}</p>
    <p>描述: {{item.des}}</p>
    <button :data-itemid='item.id' @tap='onLookClick' type='primary' size='mini' :plain='true'>查看</button>
</div> -->
