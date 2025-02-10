import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../redux/store';
import './content.css';
import Orders from './Orders';
import Search from './Search';
import { getElementPagePosition } from '../utils/functions';
import Marking from './Marking';

function OrderSourcing() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Orders />
            </PersistGate>
        </Provider>
    );
}

// document.addEventListener('DOMContentLoaded', () => {
//     const insertDOM = document.querySelector('body');
//     if (insertDOM) insertDOM.appendChild(app);
// });

window.onload = () => {
    const currentUrl = window.location.href;
    const insertDOM = document.querySelector('body');

    /** 指定页面中嵌入订单操作DOM */
    let injectable = false;
    const injectionWebSite = [
        'taobao.com',
        'tmall.com',
        '1688.com'
    ];

    for (let i = 0; i < injectionWebSite.length; i++) {
        if (currentUrl.indexOf(injectionWebSite[i]) > -1) {
            injectable = true;
            break;
        }
    }

    if (injectable) {
        //创建 id 为 KSN-SOURCING 的 div
        const app = document.createElement('div');
        app.id = 'KSN-SOURCING';

        if (insertDOM) insertDOM.appendChild(app);

        //将 reactDOM 插入刚创建的 div
        ReactDOM.render(<OrderSourcing />, app);
    }


    /*===============================================================================================*/


    /** 指定页面中嵌入图片搜索DOM */
    let injectable2 = false;
    const injectionWebSite2 = [
        'rakuten.co.jp',
        'shopping.yahoo.co.jp',
        'wowma.jp',
        'qoo10.jp',
    ];

    for (let i = 0; i < injectionWebSite2.length; i++) {
        if (currentUrl.indexOf(injectionWebSite2[i]) > -1) {
            injectable2 = true;
            break;
        }
    }

    if (injectable2) {
        /** 创建搜索按钮 div */
        const app2 = document.createElement('div');
        app2.id = 'KSN-IMAGE-SEARCH';
        app2.style.position = 'absolute';
        app2.style.zIndex = 2147483647;
        app2.style.display = 'none';

        document.documentElement.onmousemove = (e) => {
            const x = e.clientX;
            const y = e.clientY;
            const currentDOM = document.elementFromPoint(x, y);

            if (currentDOM && typeof currentDOM.className === 'string' && currentDOM.className.indexOf('ksn-search') > -1) return false;

            /** 鼠标停留在图片上，显示搜索按钮 */
            if (currentDOM && currentDOM.nodeName.toUpperCase() === 'IMG') {
                /** 太小的图片也跳过 */
                if (currentDOM.offsetWidth < 80 || currentDOM.offsetHeight < 60) return false;

                const position = getElementPagePosition(currentDOM);

                app2.style.display = 'block';
                app2.style.left = position.x + 'px';
                app2.style.top = position.y + 'px';

                /** DOM中添加图片地址 */
                app2.setAttribute('data-src', currentDOM.getAttribute('src'));

                return false;
            }

            if (currentDOM && currentDOM.nodeName.toUpperCase() !== 'IMG') {
                app2.style.display = 'none';
                return false;
            }
        }

        if (insertDOM) insertDOM.appendChild(app2);

        //将 reactDOM 插入刚创建的 div
        ReactDOM.render(<Search />, app2);
    }


    /*===============================================================================================*/


    /** 1688 商品详细和购物车页面下单时添加参数，标记订单来源 */
    let injectable3 = false;
    const injectionWebSite3 = [
        'detail.1688.com',
        'cart.1688.com',
    ];

    for (let i = 0; i < injectionWebSite3.length; i++) {
        if (currentUrl.indexOf(injectionWebSite3[i]) > -1) {
            injectable3 = true;
            break;
        }
    }

    if (injectable3) {
        const app3 = document.createElement('div');
        app3.id = 'KSN-MARKING';
        
        if (insertDOM) insertDOM.appendChild(app3);

        ReactDOM.render(<Marking />, app3);
    }
}