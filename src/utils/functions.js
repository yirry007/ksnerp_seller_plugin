// 把对象转换为url参数
export const jsonToUrlParam = json => Object.keys(json).map(key => key + '=' + json[key]).join('&');

/**
 * 获取某个时间的年月日
 * @param String|int mode 
 * @returns Object
 */
export const getDate = (mode = 0) => {
    const datetime = new Date();

    if (mode.toString() === 'yesterday') {
        datetime.setDate(datetime.getDate() - 1);
    } else if (mode.toString() === 'lastMonth') {
        datetime.setDate(datetime.getMonth() - 1);
    } else if (mode.toString() === 'lastYear') {
        datetime.setDate(datetime.getYear() - 1);
    } else {
        datetime.setDate(datetime.getDate() - parseInt(mode));
    }

    const y = datetime.getFullYear();
    const m = datetime.getMonth() + 1;//获取当前月份的日期 
    const d = datetime.getDate();

    return { y, m, d }
}

/**
* 小于10数字前补0
* @param {*} num 
* @returns 
*/
export const fillZero = (num) => {
    return num < 10 ? '0' + num : num + '';
}

/**
 * 数字添加千位分隔符
 * @param {*} num 
 * @returns 
 */
export const addComma = (num) => {
    var symbol = num >= 0 ? 1 : -1;
    num = Math.abs(num);

    var initNum = (num || 0).toString(), result = '', formatNum = '';
    if (initNum.indexOf('.') > -1) formatNum = (num || 0).toString().split('.')
    var _num = formatNum ? formatNum[0] : initNum;
    while (_num.length > 3) {
        result = ',' + _num.slice(-3) + result;
        _num = _num.slice(0, _num.length - 3);
    }
    if (_num) { result = formatNum ? _num + result + '.' + formatNum[1] : _num + result; }

    return symbol === -1 ? '-' + result : result;
}

/**
 * 根据时间戳返回日期
 * @param int timestamp 
 * @param int mode 返回数据模式
 * @returns 
 */
export const timeFormat = (timestamp, mode = 1) => {
    if (!timestamp) return '-';

    let _timestamp = timestamp < 9999999999 ? timestamp * 1000 : timestamp;
    let time = new Date(_timestamp);

    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let mm = time.getMinutes();
    let s = time.getSeconds();

    let datas;
    if (mode === 1) {
        datas = y + '-' + fillZero(m) + '-' + fillZero(d);
    } else if (mode === 2) {
        datas = y + '-' + fillZero(m) + '-' + fillZero(d) + ' ' + fillZero(h) + ':' + fillZero(mm) + ':' + fillZero(s);
    }

    return datas;
}

/**
 * 获取URL参数，不传name返回所有值，否则返回对应值
 * @param {*} url 
 * @param {*} name 
 * @returns 
 */
export const getUrlParams = (url, name) => {
    if (url.indexOf('?') === -1) { return false; }
    url = url.split('?')[1];
    url = url.split('&');
    let _name = name || '';
    let nameres;
    // 获取全部参数及其值
    for(var i=0;i<url.length;i++) {
        let info = url[i].split('=');
        let obj = {};
        obj[info[0]] = decodeURI(info[1]);
        url[i] = obj;
    }
    // 如果传入一个参数名称，就匹配其值
    if (_name) {
        for(let i=0;i<url.length;i++) {
            for (const key in url[i]) {
                if (key === _name) {
                    nameres = url[i][key];
                }
            }
        }
    } else {
        nameres = url;
    }
    // 返回结果
    return nameres;
}

/**
 * 打开新的窗口
 * @param {*} url 
 */
export const windowOpen = (url) => {
    window.open (
        url,
        '科速诺采购助手',
        `
            height=720,
            width=1200,
            top=30,
            left=30,
            toolbar=no,
            menubar=no,
            scrollbars=no,
            resizable=no,
            location=no,
            status=no
        `
    );
}

/**
 * 获取DOM元素坐标
 * @param {*} element 
 * @returns 
 */
export const getElementPagePosition = (element) => {
    //计算x坐标，元素到窗口左侧距离 + x轴滚动距离
    const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    const actualLeft = element.getBoundingClientRect().left + scrollLeft;

    //计算y坐标，元素到窗口顶部距离 + y轴滚动距离
    const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;
    const actualTop = element.getBoundingClientRect().top + scrollHeight;

    //返回结果
    return { x: actualLeft, y: actualTop }
}

/**
 * 字符串key:value;key:value转json格式
 * @param {*} str 
 * @returns 
 */
export const transformToJson = (str) => {
    if (str === '') return str;

    const skus = str.split(';');
    const skuJson = {};
    skus.forEach(v => {
        const sku = v.replace('：', ':');
        const keyValArr = sku.split(':');

        skuJson[keyValArr[0]] = keyValArr[1];
    });

    return JSON.stringify(skuJson);
}