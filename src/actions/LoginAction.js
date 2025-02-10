/*global chrome*/
import { message } from 'antd';
import { Api } from '../utils/api';
import { Request } from '../utils/Request';

export const LoginAction = {
    /**
     * 用户登录
     * @param {*} params {username, password}
     * @returns 
     */
    auth: async (params) => {
        let username = params.username;
        let password = params.password;

        if (username === '') {
            message.error('请输入用户名');
            return false;
        }

        if (password === '') {
            message.error('请输入密码');
            return false;
        }

        const response = await Request.post({
            url: Api.auth,
            datas: {username, password}
        });

        if (response.code !== '') {
            message.error(response.message);
            return false;
        }

        localStorage.setItem('token', JSON.stringify(response.result.token));
        chrome.storage.local.set({ token: JSON.stringify(response.result.token) });

        return response;
    },

    /**
     * 退出登录
     */
    logout: async () => {
        await Request.post({
            url: Api.logout,
            withAuth: true
        });
        
        localStorage.removeItem('token');
        chrome.storage.local.remove('token');
    }
};