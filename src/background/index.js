/*global chrome*/

import { RequestFecth } from "./RequestFetch";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 接受来自content-script的消息，requset里不允许传递function和file类型的参数
    chrome.tabs.query({ currentWindow: true, active: true }, async (tabs) => {
        const { contentRequest } = request;
        let { config } = request;
        // 接收来自content的api请求
        if (contentRequest === 'apiRequest') {
            config.callback = (data) => {
                sendResponse(data);
            }

            RequestFecth(config);
        }
    });

    return true;
});