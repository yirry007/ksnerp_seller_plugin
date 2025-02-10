import { Button, Card, Col, Collapse, ConfigProvider, Divider, Empty, Input, Popconfirm, Row, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './items.module.css';
import { RequestBackground } from '../RequestBackground';
import { Api } from '../../utils/api';
import { connect } from 'react-redux';
import { addComma, windowOpen } from '../../utils/functions';
import { store } from '../../redux/store';
import { MARKETS } from '../../Markets';

function SourcingItems(props) {
    const [sourcingItems, setSourcingItems] = useState([]);//待采购商品原始数据
    const [filteredSourcingItems, setFilteredSourcingItems] = useState([]);//待采购商品筛选渲染数据
    const [unitySupplyInput, setUnitySupplyInput] = useState({});//待修改的统一采购信息（淘宝，天猫，1688等平台名称和订单ID）
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getSourcingItems(res => {
            setSourcingItems(res.result);
            setFilteredSourcingItems(res.result);
        });
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        itemFilter();
    }, [props.search_keyword]);// eslint-disable-line react-hooks/exhaustive-deps

    /** 获取待采购订单和商品 */
    const getSourcingItems = (cb) => {
        setLoading(true);
        RequestBackground({
            url: Api.sourcing_items,
            callback: res => {
                cb(res);
                setLoading(false);
            }
        });
    }

    /** 筛选过滤订单商品列表 */
    const itemFilter = () => {
        if (!props.search_keyword || props.search_keyword === '') {
            setFilteredSourcingItems(sourcingItems);
            return false;
        }

        const _keyword = props.search_keyword;

        setFilteredSourcingItems(sourcingItems.filter(v => (
            v.sh_shop_id.indexOf(_keyword) > -1
            || v.item_id.indexOf(_keyword) > -1
            || v.item_name.indexOf(_keyword) > -1
            || v.item_options.indexOf(_keyword) > -1
            || v.supply_market.indexOf(_keyword) > -1
            || v.supply_name.indexOf(_keyword) > -1
            || v.supply_options.indexOf(_keyword) > -1
            || v.oid.indexOf(_keyword) > -1
        )));
    }

    /** 更新订单商品的采购信息 */
    const updateOrderItem = (id, supplyData) => {
        setLoading(true);
        RequestBackground({
            url: Api.update_order_item(id),
            method: 'post',
            datas: supplyData,
            callback: res => {
                console.log(res);
                setLoading(false);

                store.dispatch({
                    type: 'set_item_count_changed',
                    payload: Math.random()
                });
            }
        });
    }

    /** 设置统一采购数据 */
    const setUnityData = (oid, obj) => {
        const _data = {...unitySupplyInput[oid], ...obj};
        setUnitySupplyInput({...unitySupplyInput, [oid]: _data});
    }

    /** 统一更新订单商品的采购，快递信息 */
    const unityUpdateOrderItem = (oid) => {
        const _unitySupplyInput = unitySupplyInput[oid];

        if (!_unitySupplyInput || !_unitySupplyInput.unity_supply_market || !_unitySupplyInput.unity_supply_order_id) {
            message.error('缺少参数，数据更新失败');
            return false;
        }

        setLoading(true);
        RequestBackground({
            url: Api.unity_update_order_item(oid),
            method: 'post',
            datas: _unitySupplyInput,
            callback: res => {
                console.log(res);
                setLoading(false);

                store.dispatch({
                    type: 'set_item_count_changed',
                    payload: Math.random()
                });
            }
        });
    }

    const orderInfos = (order_item_id, orders) => {
        return (
            <>
                <Card size="small" style={{ marginBottom: 12 }}>
                    <ul className={styles['ksn-info-line']}>
                        <li>
                            <b>统一采购平台</b>
                            <select onChange={(e) => { setUnityData(order_item_id, {unity_supply_market: e.target.value}) }}>
                                <option value="">平台</option>
                                {MARKETS.map((m, index) => (
                                    <option key={index} value={m.market}>{m.name}</option>
                                ))}
                            </select>
                        </li>
                        <li>
                            <b>统一采购订单ID</b>
                            <Input size="small" style={{ width: 200, textAlign: 'right' }} placeholder="请输入统一采购订单ID" onInput={(e) => { setUnityData(order_item_id, {unity_supply_order_id: e.target.value}) }} />
                        </li>
                        <li>
                            <Popconfirm
                                placement="topRight"
                                title="确定要统一修改吗？"
                                description={<div>统一修改后，所有包含该商品的<br />订单的采购平台和采购订单ID<br />全部更新为统一输入的信息</div>}
                                onConfirm={() => {unityUpdateOrderItem(order_item_id)}}
                                okText="确认"
                                cancelText="取消"
                                style={{ width: 200 }}
                            >
                                <Button block size="small">全部修改</Button>
                            </Popconfirm>
                        </li>
                    </ul>
                </Card>
                {orders.map((v, k) => (
                    <Card size="small" style={{ marginBottom: 12 }} key={k}>
                        <ul className={styles['ksn-info-line']}>
                            <li>
                                <b>店铺类型</b>
                                <i>{v.market}</i>
                            </li>
                            <li>
                                <b>店铺ID</b>
                                <i>{v.shop_id}</i>
                            </li>
                            <li>
                                <b>店铺名称</b>
                                <i>{v.shop_name}</i>
                            </li>
                            <li>
                                <b>订单编号</b>
                                <i>{v.order_id}</i>
                            </li>
                            <li>
                                <b>购买数量</b>
                                <i>{v.quantity}</i>
                            </li>
                            {/*
                                以下的 li 标签必须带 key 属性，
                                被 li 包含的 Input 带有 defaultValue 属性，
                                默认情况下 state 变换时 defaultValue 不会重新赋值，
                                除非包含 Input 的 li 的 key 属性有变化
                                * 添加 Math.random() 是因为有相同 key 时渲染冲突
                            */}
                            <li key={v.supply_order_id + Math.random()}>
                                <b>采购平台</b>
                                <select onChange={e=>updateOrderItem(v.id, {supply_market: e.target.value})}>
                                    <option value="" selected={v.supply_market === '' ? 'selected' : ''}>平台</option>
                                    {MARKETS.map((m, index) => (
                                        <option key={index} value={m.market} selected={v.supply_market === m.market ? 'selected' : ''}>{m.name}</option>
                                    ))}
                                </select>
                            </li>
                            <li key={v.supply_order_id + Math.random()}>
                                <b>采购订单ID</b>
                                <Input size="small" style={{ width: 200, textAlign: 'right' }} placeholder="请输入采购订单ID" defaultValue={v.supply_order_id} onBlur={e=>updateOrderItem(v.id, {supply_order_id: e.target.value})} />
                            </li>
                        </ul>
                    </Card>
                ))}
            </>
        );
    }

    const sourcingItemList = items => {
        return items.length > 0
            ? (
                items.map((v, k) => (
                    <Card
                        key={k}
                        size="small"
                        style={{ width: '100%', marginBottom: 8 }}
                    >
                        <Row gutter={8}>
                            <Col span={4} style={{ textAlign: 'center' }}>
                                {
                                    v.supply_image !== ''
                                        ? <img src={v.supply_image} alt="" style={{ width: '100%' }} />
                                        : <img src={require('../../asset/img/gift.png')} alt="" style={{ width: '75%' }} />
                                }
                            </Col>
                            <Col span={20}>
                                <strong
                                    target='_blank'
                                    rel="noreferrer"
                                    className={styles['ksn-order-item-title']}
                                    title={v.supply_name !== '' ? v.supply_name : v.item_name}
                                    onClick={() => {windowOpen(v.supply_url !== '' ? v.supply_url : v.item_url)}}
                                >{v.supply_name !== '' ? v.supply_name : v.item_name}</strong>
                                <div className={styles['ksn-order-item-info']}>
                                    <div
                                        className={styles['ksn-order-item-option']}
                                        title={v.supply_options !== '' ? v.supply_options : v.item_options}
                                    >{v.supply_options !== '' ? v.supply_options : v.item_options}</div>
                                    <div className={styles['ksn-order-item-price']}>
                                        <b>
                                            {v.supply_price > 0 ? '￥' + addComma(v.supply_price) : addComma(v.item_price) + '円'}
                                        </b>
                                        <b>x {v.total_count}</b>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '8px 0' }} />
                        <ConfigProvider
                            theme={{
                                components: {
                                    Collapse: {
                                        headerPadding: 0,
                                        contentPadding: 0
                                    },
                                },
                            }}
                        >
                            <Collapse ghost items={[{ key: 1, label: '查看订单详细...', children: orderInfos(v.id, v.orders) }]} style={{ fontSize: 12 }} />
                        </ConfigProvider>
                    </Card>
                ))
            )
            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }

    return <Spin spinning={loading}>{sourcingItemList(filteredSourcingItems)}</Spin>;
}

const mapStateToProps = ({
    searchKeywordReducer: { search_keyword },
}) => {
    /** 以下属性挂载到 props 参数 */
    return {
        search_keyword,
    }
}

export default connect(mapStateToProps)(SourcingItems);