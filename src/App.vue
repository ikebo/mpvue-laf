<script>
import {get, wxLogin} from '@/utils/util'

export default {
  data () {
    return {
        user: null
    }
  },

  methods: {
      async login() {
          const code = await wxLogin()
          const user = await get(`/api/v1/user/${code}`)
          this.user = user
          console.log('user',user)
          wx.setStorageSync('userData', this.user)
          console.log('用户数据缓存成功')
      }
  },

  created () {
      this.login()
  }
}
</script>
