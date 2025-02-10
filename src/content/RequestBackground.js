import { message } from "antd";

/*global chrome*/
export const RequestBackground = (config) => {
    if (chrome && chrome.runtime) {
        chrome.storage.local.get(['token'], (result) => {
            let token;
            try {
                token = JSON.parse(result.token);
            } catch (e) {
                console.log(e);
                return false;
            }

            /** 动态获取主机地址 */
            let host = 'http://beta.ksnerp.com';
            if (token && token['host']) {
                host = token['host'].endsWith('/') ? token['host'].slice(0, -1) : token['host'];
            }

            config['url'] = host + config['url'];
            config['headers'] = {
                'Authorization': 'Bearer ' + token.access_token
            };
            config['method'] = config['method'] ? config['method'] : 'get';

            chrome.runtime.sendMessage(
                {
                    // 带上标识，让background script接收消息时知道此消息是用于请求API
                    contentRequest: 'apiRequest',
                    config: config,
                },
                (result) => {
                    /** 处理token过期 */
                    if (result.code === 'E409014') {
                        message.error('授权失效，点开谷歌插件“科速诺采购助手”进行登录（已登录则无需再次登录仅点开一次即可）后，再次刷新当前页面', 7);
                        return false;
                    }

                    config.callback && config.callback(result);
                }
            );
        });
    } else {
        console.log('Chrome API Not Found');
    }
};