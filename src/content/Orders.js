/*global chrome*/
import { useEffect, useState } from 'react';
import { ShoppingCartOutlined, GiftOutlined, CloseOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import Sourced from './components/Sourced';
import Sourcing from './components/Sourcing';
import { connect } from 'react-redux';
import { RequestBackground } from './RequestBackground';
import { Api } from '../utils/api';
import { MARKET_HANDLE } from '../Markets';

function Orders(props) {
    const [auth, setAuth] = useState(null);//授权验证标识
    const [sourcingItemCount, setSourcingItemCount] = useState(0);//待采购商品
    const [sourcedItemCount, setSourcedItemCount] = useState(0);//已采购商品
    const [modalView, setModalView] = useState('none');//是否显示content窗口外层组件
    const [modalTitle, setModalTitle] = useState('');//content窗口标题
    const [modalBody, setModalBody] = useState(null);//content窗口内容

    /** 检测用户登录，显示嵌入按钮 */
    useEffect(() => {
        chrome.storage.local.get(['token'], (result) => {
            setAuth(result.token);
        });

        chrome.storage.onChanged.addListener((changes, namespace) => {//监听用户登录，登录后展示 content 嵌入组件
            for (let key in changes) {
                if (key !== 'token') continue;

                let storageChange = changes[key];
                setAuth(storageChange.newValue);
            }
        });
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        getItemCount((res) => {
            setSourcingItemCount(res.result.sourcing_item_count);
            setSourcedItemCount(res.result.sourced_item_count);
        });
    }, [auth, props.item_count_changed]);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        autoOpenSourcing();
    }, [auth]);// eslint-disable-line react-hooks/exhaustive-deps

    /** 当前商品详细页是否有待采购商品 */
    const autoOpenSourcing = () => {
        if (!auth) return false;//未授权不执行

        const _handle = MARKET_HANDLE();
        
        if (!_handle) return false;

        _handle.hasMatched(res => {
            if (res === false) return false;

            if (res.code === '') {
                /** 有匹配的订单商品，则直接弹出匹配商品窗口 */
                sourcing('matched');
            } else {
                /** 没有匹配的订单商品，则直接弹出全部待采购商品窗口 */
                sourcing();
            }
        });
    }

    /** 获取待采购和已采购商品数量 */
    const getItemCount = (cb) => {
        if (!auth) return false;//未授权不执行

        RequestBackground({
            url: Api.item_count,
            callback: res => cb(res)
        });
    }

    /** 显示待采购商品 */
    const sourcing = (activeKey = 'all') => {
        setModalTitle('待采购商品');
        setModalBody(<Sourcing activeKey={activeKey} />);
        setModalView('block');
    }

    /** 显示已采购商品 */
    const sourced = () => {
        setModalTitle('已采购订单');
        setModalBody(<Sourced />);
        setModalView('block');
    }

    /** 关闭弹出层 */
    const closeModal = () => {
        setModalView('none');
        setModalTitle('');
        setModalBody(null);
    }

    if (auth) {
        return (
            <>
                <FloatButton.Group shape="circle">
                    <FloatButton tooltip="待采购商品" badge={{ count: sourcingItemCount }} icon={<ShoppingCartOutlined />} onClick={() => { sourcing() }} />
                    <FloatButton tooltip="已采购商品" badge={{ count: sourcedItemCount }} icon={<GiftOutlined />} onClick={() => { sourced() }} />
                </FloatButton.Group>
                <section className="ksn-custom-modal" style={{ display: modalView }}>
                    <div className="ksn-custom-modal-header">
                        <div className="ksn-custom-modal-title">{modalTitle}</div>
                        <CloseOutlined onClick={() => { closeModal() }} />
                    </div>
                    <div className="ksn-custom-modal-body">{modalBody}</div>
                </section>
            </>
        );
    } else {
        return <></>;
    }
}

const mapStateToProps = ({
    itemCountChangedReducer: { item_count_changed },
}) => {
    /** 以下属性挂载到 props 参数 */
    return {
        item_count_changed,
    }
}

export default connect(mapStateToProps)(Orders);