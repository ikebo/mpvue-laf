<template lang="html">
<div id='container'>

    <div id='userInfo'>
        <div id='userInfo-left'>
            <img :src='userInfo.avatarUrl' />
            <p>{{userInfo.nickName}}</p>
        </div>

        <div id='userInfo-right'>
            <p>i</p>
            <p>关于我们</p>
        </div>
    </div>

    <div id='profile'>
    <div @tap='onTapContactControl' id='contact-control' class='profile-control'>
        <p>联系方式</p>
        <p>></p>
    </div>

    <div id='phoneNumber' class='contact-item'>
        <p>手机号</p>
        <p v-if='userInfo.userContact && userInfo.userContact.phoneNumber'>{{userInfo.userContact.phoneNumber}}</p>
        <p v-else></p>
    </div>

    <div id='qqNumber' class='contact-item'>
        <p>QQ</p>
        <p v-if='userInfo.userContact && userInfo.userContact.qqNumber'>{{userInfo.userContact.qqNumber}}</p>
        <p v-else></p>
    </div>

    <div id='weixinNumber' class='contact-item'>
        <p>微信</p>
        <p v-if='userInfo.userContact && userInfo.userContact.weixinNumber'>{{userInfo.userContact.weixinNumber}}</p>
        <p v-else></p>
    </div>

    <div id='userPosts' @tap='onTapPostControl'>
        <p>我的发布</p>
        <p>></p>
    </div>
    <button v-if="canUseInfo === false" open-type="getUserInfo" type='primary' @getuserinfo="onGotUserInfo">授权个人信息</button>
    </div>

</div>
</template>

<script>
import Config from '@/utils/config'

export default {
    data () {
        return {
            userInfo: {},
            canUseInfo: true,
            service: Config['service']
        }
    },

    methods: {
        update_avatar: function() {
            console.log('update_avatar')
            // 将用户头像，用户名发送到服务器
            wx.request({
                url: this.service +  '/api/v1/user/avatar/' + this.userInfo.id,
                method: 'POST',
                data: {
                    avatarUrl: this.userInfo.avatarUrl,
                    nickName: this.userInfo.nickName
                },
                success: res => {
                    console.log(res);
                    let data = JSON.parse(res.data);
                    console.log(data.userData);
                    let userContact = JSON.parse(data.userData);

                    this.userInfo['userContact'] = userContact;
                    console.log('this.userInfo', this.userInfo);
                }
            });
        },

        onTapContactControl: function() {
            let query = 'phoneNumber=' + this.userInfo.userContact.phoneNumber + '&qqNumber=' + this.userInfo.userContact.qqNumber + '&weixinNumber=' + this.userInfo.userContact.weixinNumber;
            console.log(query);
            wx.navigateTo({
                url: '/pages/changeContact/main?' + query
            });
        },

        onTapPostControl: function() {
            let user_id = this.userInfo['id'];
            if (!user_id) {
                wx.showToast({
                    title: '获取用户信息失败',
                    icon: 'none'
                });
            }
            wx.request({
                url: this.service +  '/api/v1/item/' + user_id,
                method: 'GET',
                success: res => {
                    console.log(res);
                    if(res.data.code !== 1) {
                        wx.showToast({
                            title: '服务器发生错误',
                            icon: 'none'
                        });
                        return ;
                    }
                    // 缓存数据
                    wx.setStorageSync('userItems', res.data.userData);
                    wx.navigateTo({
                        url: '/pages/itemsControl/main'
                    });
                }
            });
        },
        onGotUserInfo: function (e) {
            console.log('in onGotUserInfo')
            let userInfo = e.mp.detail.userInfo
            this.userInfo['avatarUrl'] = userInfo.avatarUrl;
            this.userInfo['nickName'] = userInfo.nickName;
            this.canUseInfo = true
            this.update_avatar();
        }
    },

    created (options) {
        // 获得全局数据：用户id
        const userData = wx.getStorageSync('userData')
        if (userData) {
            console.log('获得缓存数据：userData', userData)
            this.userInfo['id'] = userData.id
        } else {
            console.log('got userData failed')
        }

        wx.getSetting({
            // 查看是否授权
            success: res => {
                if(res.authSetting['scope.userInfo']) {
                    // 已经授权， 可以直接调用getUserInfo获取头像昵称
                    // 获取用户信息
                    wx.getUserInfo({
                        success: res => {
                            console.log('in getUserInfo');
                            this.userInfo['avatarUrl'] = res.userInfo.avatarUrl;
                            this.userInfo['nickName'] = res.userInfo.nickName;

                            console.log('this.userInfo', this.userInfo);

                            this.update_avatar();

                        }
                    });
                } else {
                    console.log('未授权');
                    this.canUseInfo = false
                    wx.showToast({
                        title: '请先点击按钮授权个人基本信息(昵称，头像)',
                        icon: 'none'
                    });
                }
            }
        });
    }

}
</script>

<style lang="css">
#userInfo {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding-left: 20rpx;
  background-color: #2489cd;
  padding-bottom: 20rpx;
  color: #fff;
  font-size: 0.8em;
  position: relative;
}

#userInfo-left {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

#userInfo-left img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

#userInfo-right {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  margin-right: 20rpx;
  align-items: center;
}

#userInfo-right img {
  width: 30rpx;
  height: 30rpx;
}
</style>
