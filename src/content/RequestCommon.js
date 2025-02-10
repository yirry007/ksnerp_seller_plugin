/*global chrome*/
export const RequestCommon = (config) => {
    if (chrome && chrome.runtime) {
        let host = 'https://api.kesunuo.com';

        config['url'] = host + config['url'];
        config['method'] = config['method'] ? config['method'] : 'get';
        config['headers'] = {
            Authorization: '739B23E844946D9EAFD8B3850C1C54d0',
        };

        chrome.runtime.sendMessage(
            {
                // 带上标识，让background script接收消息时知道此消息是用于请求API
                contentRequest: 'apiRequest',
                config: config,
            },
            (result) => config.callback && config.callback(result)
        );
    }
};