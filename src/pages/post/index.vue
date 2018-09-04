<template lang="html">
<div id="container">
    <form @submit='formSubmit'>

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

    </form>
</div>

</template>

<script>
import Config from '@/utils/config'

export default {
    data: {
        date: null,  // 日期
        preDate: null,
        endDate: null,
        itemType: 0,   // 类型
        imgTempPath: null,  // 图片
        service: Config['service'],
        user_id: null
    },

    created (options) {
        this.user_id = wx.getStorageSync('userData').id || ''
        if (this.user_id) {
            console.log('use_id', this.user_id)
        }

        this.date = this.getNowDate()
        this.preDate = this.getPreDate()
        this.endDate = this.getNowDate()
        console.log(this.date);
        console.log(this.preDate);
    },

    methods: {
        checkData (postData) {
            if(!postData.date || !postData.des || !postData.img || !postData.itemName || !postData.place) {
                return false;
            } else {
                return true;
            }
        },
        formSubmit (e) {

            let postData = {};
            postData.date = this.date;
            postData.itemType = this.itemType;
            postData.imgTempPath = this.imgTempPath;

            postData.itemName = e.mp.detail.value.itemName;
            postData.place = e.mp.detail.value.place;
            postData.des = e.mp.detail.value.des;

            console.log(postData);

            if (postData.imgTempPath === null) {
                wx.showToast({
                    title: '所有字段不能为空',
                    icon: 'none'
                });
                return ;
            }

            // 将图片上传到服务器
            wx.uploadFile({
                url: this.service + '/api/v1/item/upload_img',
                filePath: postData.imgTempPath,
                name: 'img',
                success: res => {
                    let data = JSON.parse(res.data);
                    console.log(typeof(data));
                    console.log('res.data', data)
                    if (data.code === 1) {
                        console.log('res.data', data)
                        postData.img = data.userData.imgServerPath;
                        console.log('postData', postData)
                        if (this.checkData(postData) === false) {
                            wx.showToast({
                            title: '所有字段不能为空',
                            icon: 'none'
                            });
                            return ;
                        }
                        // 将整个item post到服务器
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
                        });
                } else {
                wx.showToast({
                    title: '上传图片失败',
                    icon: 'none'
                });
                }
            }
            })
        },
        uploadImg () {
            wx.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                success: res => {
                    console.log(res);
                    console.log(res.tempFilePaths[0]);
                    this.imgTempPath =res.tempFilePaths[0]
                }
            });
        },
        bindDateChange (e) {
            this.date = e.mp.detail.value
        },
        radioChange (e) {
            console.log('e', e);
            this.itemType = e.mp.detail.value
        },
        getNowDate () {
            let newDate = new Date();
            let year = newDate.getFullYear();
            let month = String(newDate.getMonth() + 1).length === 1 ? '0' + (newDate.getMonth() + 1) : (newDate.getMonth() + 1);
            let day = String(newDate.getDate()).length === 1 ? '0' + newDate.getDate() : newDate.getDate();

            let nowDate = year + '-' + month + '-' + day;

            return nowDate;
        },

        getPreDate () {
            let nowDate = this.getNowDate();
            let dateArr = nowDate.split('-');
            let nowMonth = Number(dateArr[1]);
            let preYear = Number(dateArr[0]); //number
            let preMonth = nowMonth-1;  // number
            let preDay = dateArr[2]; //string
            if(nowMonth === 1) {
                preYear = preYear - 1;
                preMonth = 12;
            }

            preMonth = String(preMonth).length === 1 ? '0' + String(preMonth) : String(preMonth);

            preYear = String(preYear);

            let preDate = preYear + '-' + preMonth + '-' + preDay;
            return preDate;
        }
    }

}
</script>

<style lang="css">
</style>
