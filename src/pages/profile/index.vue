<template lang="html">
<div id='container' :style="{height: height + 'px'}">

    <div id='userInfo'>
        <div v-show='userInfo' class='userInfo-left'>
            <img :src='userInfo && userInfo.avatarUrl' />
            <p v-show='userInfo'>{{userInfo && userInfo.nickName}}</p>
        </div>

        <div v-if='canUseInfo===false' class="userInfo-left">
            <button size='mini' id='authBtn' v-if="canUseInfo === false" open-type="getUserInfo" type='primary' :plain='true' @getuserinfo="onGotUserInfo" class="iconfont">
                <p>&#xe97b;</p>
            </button>
        </div>

        <div id='userInfo-right'>
            <p class="iconfont about-icon">&#xe760;</p>
            <p class="about">关于</p>
        </div>
    </div>

    <div id="bottom-container">
        <div class="item-control">
            <p>
                <span class="iconfont item-icon">&#xe79c;</span>
                <span @tap='onClickPosts'>我的发布</span>
            </p>
        </div>

        <div class="setting">
            <p>
                <span class="iconfont setting-icon">&#xe79d;</span>
                <span @tap='onClickAdvice'>反馈</span>
            </p>
        </div>
    </div>


</div>
</template>

<script>
import {navigate,hasInfoAuth,post} from '@/utils/util'

export default {
    data () {
        return {
            userInfo: null,
            user: null,
            canUseInfo: true,
            height: 0
        }
    },

    methods: {
        async update_avatar () {
            // 将用户头像，用户名发送到服务器
            let data = {
                avatarUrl: this.userInfo.avatarUrl,
                nickName: this.userInfo.nickName
            }
            await post(`/api/v1/user/avatar/${this.user.id}`, data)
        },

        onClickPosts () {
            navigate(`/pages/itemsControl/main?id=${this.user.id}`)
        },

        onClickAdvice () {
            navigateTo(`/pages/advie/main?id=${this.user.id}`)
        },

        onTapPostControl: function() {
            let user_id = this.user.id;
        },

        onGotUserInfo: function (e) {
            this.userInfo = e.mp.detail.userInfo
            this.canUseInfo = true
            this.update_avatar()
        },

        async isAuth () {
            let infoOrFalse = await hasInfoAuth()
            console.log('infoOrfalse', infoOrFalse)
            this.userInfo = infoOrFalse ? infoOrFalse : this.userInfo
            this.canUseInfo = Boolean(infoOrFalse) ? this.update_avatar() : false
            console.log('this.canUseInfo', this.canUseInfo)
        },

    },

    beforeMount (options) {
        // 获得全局数据：用户id
        const user = wx.getStorageSync('userData')
        this.user = user
        console.log('in profile, user', user)
        this.isAuth()

        wx.getSystemInfo({
            success: res => {
                console.log(res.windowHeight)
                this.height = res.windowHeight
            }
        })
    }

}
</script>

<style lang="css">

#container {
    background-color: #eee;
}

#bottom-container {
    padding: .5em 0;
}

.item-control {
    background-color: #fff;
    font-size: .8em;
    color: #2c2c2c;
    padding: .5em 0;
    padding-left: .5em;
    font-weight: 400;
}

.setting {
    background-color: #fff;
    font-size: .8em;
    color: #2c2c2c;
    margin: .5em 0;
    padding: .5em 0;
    padding-left: .5em;
    font-weight:400;
}

.item-icon, .setting-icon {
    font-size: 1em;
    color: #2c2c2c;
    margin-right: .5em;
    font-weight: bolder;
}

.about-icon {
    font-size: .75em;
    margin-right: 8rpx;
}

.about {
    font-size: .9em;
}

#userInfo {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding-left: 20rpx;
  background-color: #2489cd;
  padding-bottom: 20rpx;
  color: #fff;
  font-size: 0.9em;
  position: relative;
}

.userInfo-left {
    font-size: .9em;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
}

.userInfo-left img {
    width: 110rpx;
    height: 110rpx;
    border-radius: 50%;
    margin-right: 20rpx;
}

#userInfo-right {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    padding-right: 20rpx;
    align-items: center;
}

#authBtn {
    font-size: 55rpx;
    width: 110rpx;
    height: 110rpx;
    padding: 0 !important;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    color: #999;
    border-color: #999;
}

</style>
