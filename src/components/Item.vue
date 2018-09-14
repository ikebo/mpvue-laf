<template lang="html">
<div class="item" v-if='hasDel === false'>
    <div class="header">
        <img :src="user.avatarUrl" />
        <p class="header-middle">
            <span class="nickname">{{user.nickName}}</span>
            <span class="time">{{month}}月{{day}}日</span>
        </p>
        <div class="header-right">
            <button v-if='!isControl' @click='bindContact' type="warn" size='mini' :plain='true'>联系Ta</button>
            <button v-else @click='onDelete' :data-id='item.id' type='warn' size='mini' :plain='true'>删除</button>
        </div>
    </div>

    <div class="middle">
        <p>
            <span class="title" v-if="item.type === 1">#失物招领#&nbsp;</span>
            <span class="title" v-else>#寻物启事#&nbsp;</span>
            <span class="des">{{item.des}}</span>
        </p>
        <div class="display">
            <img :src="src" v-for='(src, index) of srcs' :key='index'  />
        </div>
    </div>
</div>

</template>

<script>
import {getSrcs,delConfirm,del} from '@/utils/util'

export default {
    props: ['item', 'isControl'],
    data () {
        return {
            user: this.item.user,
            srcs: getSrcs(this.item.srcs),
            hasDel: false
        }
    },
    computed: {
        month () {
            let arr = this.item.time.split('-')
            return Number(arr[0])
        },
        day() {
            let arr = this.item.time.split('-')
            return Number(arr[1])
        }
    },
    methods: {
        bindContact () {
            wx.makePhoneCall({
              phoneNumber: this.user.phoneNumber
            });
        },

        async onDelete (e) {
            console.log(e.mp.target)
            let item_id = e.mp.target.dataset.id
            let res = await delConfirm() ? await del(`/api/v1/item/${item_id}`) : ''
            console.log('res', res)
            res ? this.hasDel = true : ''
            console.log('hasDel', this.hasDel)
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
    margin-right: 2rpx;
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
