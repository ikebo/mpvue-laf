<template lang="html">
    <div id="container" :style="{height: height + 'px'}">
        <p class="title">武汉学院身份认证</p>
        <input v-model='stu_id' placeholder="请输入学号" />
        <input v-model='stu_pwd' :password='true' placeholder="请输入密码" />
        <button @click='onSubmit' :disabled='disable' :class="[disable ? 'disable': '']" type="primary" size='default'>提交</button>
    </div>
</template>

<script>
import {post} from '@/utils/util'

export default {
    data () {
        return {
            stu_id: '',
            stu_pwd: '',
            height: 0,
            user_id: null
        }
    },

    computed: {
        disable () {
            return this.stu_id === '' || this.stu_pwd === ''
        }
    },

    methods: {
        async onSubmit () {
            let data = {
                user_id: this.user_id,
                stu_id: this.stu_id,
                stu_pwd: this.stu_pwd
            }
            console.log(data)
            let res = await post('/api/v1/user/auth', data)
            console.log(res)
        }
    },

    onLoad() {
        wx.getSystemInfo({
            success: res => {
                this.height =  res.windowHeight
            }
        })
    },

    onUnload() {
        this.stu_id = ''
        this.stu_pwd = ''
    },

    beforeMount () {
        this.user_id = Number(this.$root.$mp.query.id)
        console.log('this.user_id', this.user_id)
    }

}
</script>

<style lang="css">

#container {
    background-color: #eee;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
}

.title {
    font-size: 1.2em;
    color: #333;
    margin-top: 2em;
    margin: 2em;
}

input {
    width: 80%;
    height: 2em;
    border: 1px solid #999;
    margin-bottom: 1.8em;
    font-size: .8em;
    border-radius: 2rpx;
    padding-left: 1em;
}

button {
    width: 60%;
    background-color: #2489cd !important;
}

.disable {
    background-color: #999 !important;
}



</style>
