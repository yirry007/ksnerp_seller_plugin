export function RequestFecth(config) {
    if (config.datas === undefined) {
        config.datas = {}
    }

    config.method = config.method ? config.method : 'get';

    let headers = {
        ...config.headers,
        'Content-Type': 'application/json;charset=UTF-8'
    };
    let datas = JSON.stringify(config.datas)

    // 准备好请求的全部数据
    let fetchConfig;

    if (config.method === 'get') {
        fetchConfig = {
            method: config.method,
            headers,
        }
    } else {
        fetchConfig = {
            method: config.method,
            headers,
            body: datas,
        }
    }

    // 发起请求
    fetch(config.url, fetchConfig)
        .then((res) => res.json())
        .then((result) => {
            config.callback && config.callback(result)
        })
        .catch((err) => {
            console.log(err);
        });
}