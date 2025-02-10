/** 动态获取主机地址 */
const API_HOST = (path) => {
    let token;
    let host = 'http://beta.ksnerp.com';

    try {
        token = JSON.parse(localStorage.getItem('token'));

        if (token && token['host']) {
            host = token['host'].endsWith('/') ? token['host'].slice(0, -1) : token['host'];
        }
    } catch (e) {
        console.log(e);
    }

    return host + path;
};

export const Api = {
    /** 用户登录（授权） */
    auth: 'http://beta.ksnerp.com/api/v1/auth',//post
    refresh_token: API_HOST('/api/v1/refresh_token'),//post
    logout: API_HOST('/api/v1/logout'),//post


    /** popup */
    main_data: API_HOST('/api/chrome/main_data'),//get
    item_list: API_HOST('/api/chrome/item_list'),//get
    item_info: API_HOST('/api/chrome/item_info'),//get


    /** content */
    item_count: '/api/chrome/item_count',//get
    sourcing_items: '/api/chrome/get_sourcing_items',//get
    update_order_item: id => `/api/chrome/update_order_item/${id}`,//post
    has_matched: supply_code => `/api/chrome/has_matched/${supply_code}`,//get
    get_matched_item: supply_code => `/api/chrome/get_matched_item/${supply_code}`,//get
    sourced_items: '/api/chrome/get_sourced_items',//get
    update_order: '/api/chrome/update_order',//post
    item_match: '/api/chrome/item_match',//post
    unity_update_order_item: id => `/api/chrome/unity_update_order_item/${id}`,//post

    /** 图片搜索商品 */
    image_save: '/api/image_save',//post
    image_upload: '/api/image_upload',//post
    image_search: '/api/image_search',//post
};