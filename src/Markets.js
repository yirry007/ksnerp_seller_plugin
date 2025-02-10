import { Alibaba } from './content/markets/Alibaba';
import { Taobao } from './content/markets/Taobao';
import { Tmall } from './content/markets/Tmall';

/** 所有可操作采购平台 */
export const MARKETS = [
    {
        market: 'taobao',
        name: '淘宝',
        handle: Taobao,
        main_url: 'https://www.taobao.com/',
        logo: require('./asset/img/taobao.png')
    },
    {
        market: 'tmall',
        name: '天猫',
        handle: Tmall,
        main_url: 'https://www.tmall.com/',
        logo: require('./asset/img/tmall.png')
    },
    {
        market: '1688',
        name: '1688',
        handle: Alibaba,
        main_url: 'https://www.1688.com/',
        logo: require('./asset/img/1688.png')
    }
];

/** 当前平台对象（句柄） */
export const MARKET_HANDLE = () => {
    const currentUrl = window.location.href;

    for (let i=0;i<MARKETS.length;i++) {
        if (currentUrl.indexOf(MARKETS[i]['market']) > -1) {
            return MARKETS[i]['handle'];
        }
    }

    return null;
}
