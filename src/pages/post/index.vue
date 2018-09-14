<template lang="html">
<div id="container">
    <div class="get-type" v-if="got_type === false">
        <div class="lost">
            <button @tap='onLostClick' type="warn" size='mini' :plain='true'>寻物启事</button>
        </div>
        <div class="found">
            <button @tap='onFoundClick' type="primary" size='mini' :plain='true'>失物招领</button>
        </div>
    </div>

    <div class="form" v-else>
        <div id="des">
            <textarea placeholder='请输入要发布的内容'  v-model='des'></textarea>
        </div>

        <div class="union">
            <div class="imgs" v-if='imgs.length'>
                <img v-for='(src,index) of srcs' :src="service+src" :key='index'/>
            </div>

            <div class="add" @tap='chooseImg'>
                <span class="iconfont add-icon">&#xe692;</span>
            </div>
        </div>

        <div class="tel">
            <span class="iconfont tel-icon">&#xe771;</span>
            <input v-model='tel' placeholder="请输入您的电话号码" style='display: inline-block;' >
        </div>

        <div class="btn-submit">
            <button class="btn-submit" type='primary' @tap='formSubmit'>立即发布</button>
        </div>
    </div>
</div>

</template>

<script>
import Config from '@/utils/config'
import {getSrcs,uploadImg,post,switchTab,showModal,showMsg} from '@/utils/util'
import {checkTel} from '@/utils/util'

export default {
    data: {
        user: null,
        got_type: false,
        type: null,
        des: '',
        tel: '',
        isChoosing: false,
        imgs: [],
        srcs: [],
        service: Config['service'],
    },
    // 处理选择图片触发onHide问题
    onHide () {
        if(!this.isChoosing) {
            this.got_type = false
            this.imgs = []
            this.srcs = []
            this.des = ''
        } else {
            this.isChoosing = false
        }
    },

    beforeMount (options) {
        this.got_type = false
        this.user = wx.getStorageSync('userData') || null
        this.tel = this.user.phoneNumber || ''
    },

    methods: {
        async uploadImgs() {
            console.log('in uploadImgs')
            this.imgs.forEach(async (img) => {
                let src = await uploadImg(img)
                this.srcs.push(src)
            })
        },

        onLostClick () {
            this.got_type = true
            this.type = 0
        },

        onFoundClick () {
            this.got_type = true
            this.type = 1
        },

        chooseImg () {
            this.isChoosing = true
            console.log('this.srcs', this.srcs)
            if (this.srcs.length >=3 ) {
                showMsg('最多三张图片')
                return false
            }
            wx.chooseImage({
                count: 3,
                sizeType: ['compressed'],
                success: res => {
                    this.imgs = []
                    res.tempFilePaths.forEach((item)=> {
                        this.imgs.push(item)
                    })
                    this.uploadImgs()
                }
            });
        },

        async formSubmit (e) {
            if (!this.des) {
                showMsg('内容不能为空')
                return false
            }
            if (!checkTel(this.tel)) {
                showMsg('请填写正确的手机号码')
                return false
            }
            let data = {
                type: this.type,
                des: this.des,
                tel: this.tel,
                srcs: this.srcs.join('|')
            }
            console.log('postData', data)
            await post(`/api/v1/item/${this.user.id}`, data)
            await switchTab('/pages/index/main')
        }
    }

}
</script>

<style lang="css">

#container {
    padding:.2rem;
}


#des {
    font-size: .8em;
}

textarea {
    height: 250rpx;
}

.union {
    display: flex;
    flex-flow: row wrap;
}

.imgs img {
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 2rpx;
    margin-right: 2rpx;
}

.btn-submit {
    padding: 0 .1rem;
    color: #fff;
}

.btn-submit button {
    background-color: #2489cd;
    border-radius: .05rem;
    font-size: .85em;
    height: .8rem;
}

.tel {
    font-size: .8em;
    color: #666;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin: .25rem 0;
}

.add {
    width: 1.3rem;
    height: 1.3rem;
    border: 1.5rpx dashed #666;
    border-radius: 2rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}

.add-icon {
    color: #666;
    font-weight: lighter;
    font-size: .8rem !important;
}


.get-type {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
}

.lost {
    margin-bottom: .5rem;
}

</style>
