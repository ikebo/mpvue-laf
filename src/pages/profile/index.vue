<template lang="html">
<div id='container' :style="{height: height + 'px'}">

    <div id='userInfo'>
        <div v-show='userInfo && canUseInfo' class='userInfo-left'>
            <img :src='userInfo && userInfo.avatarUrl' @click='onImgPreview(userInfo.avatarUrl)'/>
            <p v-show='userInfo && canUseInfo'>{{userInfo && userInfo.nickName}}</p>
        </div>

        <div v-if='canUseInfo===false' class="userInfo-left">
            <button size='mini' id='authBtn' v-if="canUseInfo === false" open-type="getUserInfo" type='primary' :plain='true' @getuserinfo="onGotUserInfo" class="iconfont">
                <!-- <p class="iconfont">Click</p> -->
                <!-- <p>&#xe70f;</p> -->
                <p>&#xe652;</p>
            </button>
        </div>

        <div id='userInfo-right'>
            <p>
                <button @click='onAuthClick' type="primary" size='mini' :plain='true'><span>.未认证</span></button>
            </p>
            <p>
                <span class="iconfont about-icon">&#xe760;</span>
                <span class="about" @click='onAboutClick'>关于</span>
            </p>
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
                <span class="iconfont setting-icon">&#xe6a1;</span>
                <span @tap='onClickAdvice'>反馈</span>
            </p>
        </div>
    </div>
</div>
</template>

<script>
import {showModal,navigate,hasInfoAuth,post} from '@/utils/util'

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
        onImgPreview (src) {
            wx.previewImage({
                urls: [src]
            })
        },
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
            navigate(`/pages/advice/main?id=${this.user.id}`)
        },

        onTapPostControl: function() {
            let user_id = this.user.id;
        },

        onGotUserInfo: function (e) {
            if(e.mp.detail.userInfo) {
                this.userInfo = e.mp.detail.userInfo
                this.canUseInfo = true
                this.update_avatar()
            }
            console.log('userinfo', e.mp.detail)
        },

        async isAuth () {
            let infoOrFalse = await hasInfoAuth()
            console.log('infoOrfalse', infoOrFalse)
            this.userInfo = infoOrFalse ? infoOrFalse : this.userInfo
            this.canUseInfo = Boolean(infoOrFalse) ? this.update_avatar() : false
            console.log('this.canUseInfo', this.canUseInfo)
        },

        onAboutClick () {
            wx.showModal({
                title: '关于',
                content: '"武院失物招领"是由武院信息中心网技团开发的公益项目,开源地址:"https://github.com/ikebo/small-laf",联系邮箱:"k_1043@126.com"',
                confirmText: 'OK',
                confirmColor: '#2489cd',
                showCancel: false
            })
        },

        onAuthClick () {
            navigate(`/pages/auth/main?id=${this.user.id}`)
        }
    },

    created() {
        wx.getSystemInfo({
            success: res => {
                console.log(res.windowHeight)
                this.height = res.windowHeight
            }
        })
    },

    beforeMount (options) {
        // 获得全局数据：用户id
        const user = wx.getStorageSync('userData')
        this.user = user
        console.log('in profile, user', user)
        this.isAuth()
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
    font-size: .9em;
    color: #2c2c2c;
    padding: .5em 0;
    padding-left: .5em;
    font-weight: 400;
}

.setting {
    background-color: #fff;
    font-size: .9em;
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
    font-size: .8em;
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

#userInfo-right button {
    width: 4em;
    height: 2em;
    font-size: .8em;
    padding: 0 !important;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2rpx;
    color: #fff;
    border-color: #fff;
    margin-right: 1em;
}

</style>
