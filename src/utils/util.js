import Config from './config'

export function wxLogin () {
    return new Promise((resolve, reject) => {
        wx.login({
            success: (res) => {
                if (res.code) {
                    resolve(res.code)
                } else {
                    showModal('失败','获取code失败')
                    reject(res)
                }
            }
        })
    })
}

export function get (url, data) {
    return request(url, 'GET', data)
}

export function post (url, data) {
    return request(url, 'POST', data)
}

function request (url, method, data, header = {}) {
    return new Promise((resolve, reject) => {
        wx.request({
            data,
            method,
            header,
            url: Config['service'] + url,
            success: function (res) {
                if (res.data.code === 1) {
                    resolve(res.data.data)
                } else {
                    showModal('失败', res.data.msg)
                    reject(res.data)
                }
            }
        })
    })
}

export function showModal (title, content) {
    wx.showModal({
        title,
        content,
        showCancel: false
    })
}

export function showSuccess (text) {
    wx.showToast({
        title: text,
        icon: 'success'
    })
}

export function getNowDate () {
    let newDate = new Date();
    let year = newDate.getFullYear();
    let month = String(newDate.getMonth() + 1).length === 1 ? '0' + (newDate.getMonth() + 1) : (newDate.getMonth() + 1);
    let day = String(newDate.getDate()).length === 1 ? '0' + newDate.getDate() : newDate.getDate();

    let nowDate = year + '-' + month + '-' + day;

    return nowDate;


export function getPreDate () {
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
