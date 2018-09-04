<script>
export default {
  data () {
    return {
        userData: null,
        service: 'http://127.0.0.1:3000/service'
    }
  },


  created () {
    // 登录
    wx.login({
      success: res => {
        console.log('in App.vue')
        if (res.code) {
          wx.request({
            url: this.service + '/api/v1/user/' + res.code,
            header: {
              'content-type': 'application/json'
            },
            method: 'GET',
            dataType: 'json',
            success: res => {
              let data = JSON.parse(res.data)
              this.userData = JSON.parse(data.userData)
              console.log('用户数据', this.userData)
              wx.setStorageSync('userData', this.userData)
              console.log('用户数据缓存成功')
            }
          })
        }
      }
    })

    // 检查session是否过期
    wx.checkSession({
      success: function() {
        console.log('session_key is ok')
      },
      fail: function() {
        console.log('session_key out of date')
        wx.login({
          success: res => {
            if (res.code) {
              wx.request({
                url: this.service + '/api/v1/user/' + res.code,
                header: {
                  'content-type': 'application/json'
                },
                success: res => {
                  console.log(res.data)
                }
              })
            }
        },
        fail: res => {
            console.log('login fail')
            console.log('login res', res)
        }
        })
      }
    })

  }
}
</script>
