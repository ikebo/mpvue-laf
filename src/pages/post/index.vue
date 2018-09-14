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
            <textarea placeholder='请输入要发布发内容'  v-model='des'></textarea>
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
import {getSrcs,uploadImg,post,switchTab,showModal} from '@/utils/util'

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
                showModal('失败', '最多三张图片')
                return
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
    margin: .2rem 0;
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


<!-- // 将整个item post到服务器
wx.request({
    url: this.service +  '/api/v1/item/' + this.user_id,
    method: 'POST',
    data: {
        postData: postData
    },
    success: res => {
    console.log(res);
    if (res.data.code === 1) {
        wx.showToast({
        title: '发布成功'
        });
        wx.reLaunch({
        url: '/pages/index/main'
        });
    } else {
        wx.showToast({
        title: '服务器发生错误',
        icon: 'none'
        });
    }
    }
}); -->


<!-- <form @submit='formSubmit'>

    <radio-group @change="radioChange">
        <label><radio value='0' checked='checked' />失物</label>
        <label><radio value='1' />招领</label>
    </radio-group>

    <label for='itemName' id='itemNameLabel'>
        名称：
        <input id='itemName' name='itemName' placeholder='输入物品名称'/>
    </label>

    <picker mode="date" @change='bindDateChange' :value="date" :start="preDate" :end="endDate">
        <p v-if="itemType == 0"> 丢失时间：{{date}} </p>
        <p v-else> 捡到时间：{{date}} </p>
    </picker>

    <label for='placeInput' id='placeLabel'>
      <p>地点：</p>
      <input id='placeInput' name='place' placeholder='输入地点' />
    </label>

    <button @tap='uploadImg' type='primary' :plain='true' size='mini'>上传图片</button>
    <img v-if="imgTempPath" :src='imgTempPath' />

    <div id="des">
        描述：
        <textarea placeholder='输入描述信息' name='des' ></textarea>
    </div>

    <button formType="submit" type='primary' size='mini'>提交</button>

</form> -->


<!-- beforeCreate () {
    console.log('beforeCreate')
},

created () {
    console.log('created')
},

mounted () {
    console.log('mounted')
},

beforeUpdate () {
    console.log('beforeUpdate')
},

updated () {
    console.log('updated')
},

activated () {
    console.log('activated')
},

deactivated () {
    console.log('deactivated')
},

beforeDestroy () {
    console.log('beforeDestroy')
},

destroyed () {
    console.log('destroyed')
},


onLoad() {
    console.log('onLoad', this)
},
onReady () {
    console.log('onReady', this)
},
onShow() {
    console.log('onShow', this)
},
onUnload() {
    console.log('onUnload', this)
},
onHide() {
    console.log('onHide', this)
}, -->
