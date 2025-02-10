import React, { useEffect, useState } from 'react';
import { SearchOutlined, ForwardOutlined, UploadOutlined, LoadingOutlined, CheckOutlined } from '@ant-design/icons';
import styles from './items.module.css';
import { Button, Checkbox, Input, Space, Tooltip, Card, Col, Row, Spin, Empty, Popconfirm } from 'antd';
import { RequestBackground } from '../RequestBackground';
import { Api } from '../../utils/api';
import { addComma, windowOpen } from '../../utils/functions';
import { MARKETS, MARKET_HANDLE } from '../../Markets';
import { store } from '../../redux/store';

function Sourced() {
    const [sourcedItems, setSourcedItems] = useState([]);//已采购的订单及他的商品的原始数据
    const [filteredSourcedItems, setFilteredSourcedItems] = useState([]);//已采购的订单及他的商品的筛选渲染数据
    const [filterCondition, setFilterCondition] = useState({
        market: '',
        delivered: '',
        keyword: '',
    });//订单列表筛选条件
    const [checkedList, setCheckedList] = useState([]);//已被勾选订单
    const [updateBtnIcon, setUpdateBtnIcon] = useState(<ForwardOutlined />);//订单状态变更为“等待出库”按钮图标
    const [collectBtnIcon, setCollectBtnIcon] = useState(<UploadOutlined />);//自动拾取订单商品数据和快递单号按钮图标
    const [collectable, setCollectable] = useState(false);//是否显示自动拾取订单商品数据和快递单号的按钮
    const [collectBtnDisable, setCollectBtnDisable] = useState(false);//自动拾取订单商品数据和快递单号的按钮是否有效
    const [loading, setLoading] = useState(false);

    const checkAll = filteredSourcedItems.length > 0 && filteredSourcedItems.length === checkedList.length;//全部勾选复选框状态
    const indeterminate = checkedList.length > 0 && checkedList.length < filteredSourcedItems.length;//勾选一部分的全部勾选复选框状态

    useEffect(() => {
        isCollectablePage();
        getSourcedItems();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    /** 选择订单 */
    const onChange = (e, order_id) => {
        setCheckedList(e.target.checked ? [...checkedList, order_id] : checkedList.filter(v => v !== order_id));
    };
    /** 点击全选 */
    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? filteredSourcedItems.map(v => v.order_id) : []);
    };

    /** 获取已采购订单和商品 */
    const getSourcedItems = () => {
        setLoading(true);
        RequestBackground({
            url: Api.sourced_items,
            callback: res => {
                setSourcedItems(res.result);
                setFilteredSourcedItems(res.result);
                setCheckedList([]);
                setLoading(false);
            }
        });
    }

    /** 筛选待采购订单或商品 */
    const filterList = () => {
        if (
            filterCondition.market === ''
            && filterCondition.delivered === ''
            && filterCondition.keyword === ''
        ) {
            setFilteredSourcedItems(sourcedItems);
            return false;
        }

        const _sourcedItems = [];
        sourcedItems.forEach(v => {
            let _orderItems = v.order_items;

            if (filterCondition.market !== '') {
                const _market = filterCondition.market;
                _orderItems = _orderItems.filter(v1 => v1.supply_market === _market);
            }

            if (filterCondition.delivered !== '') {
                const _delivered = filterCondition.delivered;
                _orderItems = _orderItems.filter(v1 => _delivered === '0' ? v1.supply_delivery_number === '' : v1.supply_delivery_number !== '');
            }

            if (filterCondition.keyword !== '') {
                const _keyword = filterCondition.keyword;
                _orderItems = _orderItems.filter(v1 => (
                    v1.order_id.indexOf(_keyword) > -1
                    || v1.sh_shop_id.indexOf(_keyword) > -1
                    || v1.item_id.indexOf(_keyword) > -1
                    || v1.item_name.indexOf(_keyword) > -1
                    || v1.supply_name.indexOf(_keyword) > -1
                    || v1.item_options.indexOf(_keyword) > -1
                    || v1.supply_options.indexOf(_keyword) > -1
                    || v1.supply_order_id.indexOf(_keyword) > -1
                    || v1.supply_delivery_number.indexOf(_keyword) > -1
                ));
            }

            if (_orderItems.length) {
                let _order = {};
                _order['order_id'] = v.order_id;
                _order['market'] = v.market;
                _order['shop_id'] = v.shop_id;
                _order['order_items'] = _orderItems;

                _sourcedItems.push(_order);
            }
        });

        setFilteredSourcedItems(_sourcedItems);
        setCheckedList([]);
    }

    /** 更新订单状态，等待采购(2) -> 等待出库(3) */
    const updateOrder = () => {
        if (checkedList.length === 0) return false;

        setUpdateBtnIcon(<LoadingOutlined />);

        RequestBackground({
            url: Api.update_order,
            method: 'post',
            datas: { order_ids: checkedList },
            callback: res => {
                setUpdateBtnIcon(<CheckOutlined />);

                /** 重新获取订单列表数据 */
                getSourcedItems();

                /** 调整浮动按钮的订单数量微标 */
                store.dispatch({
                    type: 'set_item_count_changed',
                    payload: Math.random()
                });

                setTimeout(() => {
                    setUpdateBtnIcon(<ForwardOutlined />);
                }, 2000);
            }
        });
    }

    /** 更新订单商品的采购信息（采购订单ID，快递单号等） */
    const updateOrderItem = (id, supplyData) => {
        setLoading(true);
        RequestBackground({
            url: Api.update_order_item(id),
            method: 'post',
            datas: supplyData,
            callback: res => {
                console.log(res);
                setLoading(false);

                if (supplyData.hasOwnProperty('supply_order_id')) {
                    store.dispatch({
                        type: 'set_item_count_changed',
                        payload: Math.random()
                    });
                }
            }
        });
    }

    /** 判断是否显示自动拾取快递单号按钮 */
    const isCollectablePage = () => {
        const currentUrl = window.location.href;
        const collectPageUrl = [
            'buyertrade.taobao.com',
            'trade.1688.com/order/buyer_order_list.htm'
        ];

        for (let i=0;i<collectPageUrl.length;i++) {
            if (currentUrl.indexOf(collectPageUrl[i]) === -1) continue;
            setCollectable(true);break;
        }
    }

    /** 自动拾取快递单号 */
    const collectOrders = () => {
        const _handle = MARKET_HANDLE();

        if (!_handle) return false;

        setCollectBtnIcon(<LoadingOutlined />);
        setCollectBtnDisable(true);

        _handle.collectOrder((res) => {
            setCollectBtnIcon(<CheckOutlined />);

            setTimeout(() => {
                setCollectBtnIcon(<UploadOutlined />);
            }, 2000);

            setCollectBtnDisable(false);

            res.code === '' && getSourcedItems();
        });
    }

    return (
        <div className="ksn-sourced">
            <div className={styles['ksn-sourced-header']}>
                <Checkbox
                    indeterminate={indeterminate}
                    onChange={onCheckAllChange}
                    checked={checkAll}
                >全选</Checkbox>
                <Space>
                    <select
                        style={{ width: 40 }}
                        onChange={(e) => { setFilterCondition({ ...filterCondition, market: e.target.value }) }}
                    >
                        <option value="">平台</option>
                        {MARKETS.map((v, k) => (
                            <option key={k} value={v.market}>{v.name}</option>
                        ))}
                    </select>
                    <select
                        style={{ width: 50 }}
                        onChange={(e) => { setFilterCondition({ ...filterCondition, delivered: e.target.value }) }}
                    >
                        <option value="">全部</option>
                        <option value="0">未发货</option>
                        <option value="1">已发货</option>
                    </select>
                    <Input
                        size="small"
                        style={{ width: 100 }}
                        placeholder="商品ID，中文名或日文名"
                        onInput={(e) => { setFilterCondition({ ...filterCondition, keyword: e.target.value }) }}
                    />
                    <Tooltip placement="bottomRight" title="搜索">
                        <Button size="small" icon={<SearchOutlined />} onClick={filterList} />
                    </Tooltip>
                    <Tooltip placement="bottomRight" title="采购完毕，订单状态修改为等待出库">
                        <Popconfirm
                            placement="bottomRight"
                            description={<div>确定要已勾选订单的状态<br />修改为“等待出库”吗？</div>}
                            onConfirm={updateOrder}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button size="small" icon={updateBtnIcon} />
                        </Popconfirm>
                    </Tooltip>
                    {collectable &&
                        <Tooltip placement="bottomRight" title="自动拾取快递单号，淘宝、天猫：https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm，1688：https://trade.1688.com/order/buyer_order_list.htm">
                            <Button size="small" icon={collectBtnIcon} onClick={collectOrders} disabled={collectBtnDisable} />
                        </Tooltip>
                    }
                </Space>
            </div>
            <div className={styles['ksn-order-wrap']}>
                <Spin spinning={loading}>
                    {filteredSourcedItems.length > 0
                        ? (
                            filteredSourcedItems.map((v, k) => (
                                <Card
                                    key={k}
                                    size="small"
                                    title={
                                        <div className={styles['ksn-order-head']}>
                                            <div>
                                                <Checkbox onChange={(e) => { onChange(e, v.order_id) }} checked={checkedList.includes(v.order_id)}>
                                                    <b className={styles['ksn-order-id']}>{v.order_id}</b>
                                                </Checkbox>
                                            </div>
                                            <div className={styles['ksn-order-market']}>{v.market} / {v.shop_id}</div>
                                        </div>
                                    }
                                    style={{ width: '100%', marginBottom: 8 }}
                                >
                                    {v.order_items.map((v1, k1) => (
                                        <div className={`${styles['ksn-order-item']} ${v.order_items.length === k1 + 1 ? styles['last-item'] : ''}`}>
                                            <Row gutter={8}>
                                                <Col span={4} style={{ textAlign: 'center' }}>
                                                    {
                                                        v1.supply_image !== ''
                                                        ? <img src={v1.supply_image} alt="" style={{ width: '100%' }} />
                                                        : <img src={require('../../asset/img/gift.png')} alt="" style={{ width: '75%' }} />
                                                    }
                                                </Col>
                                                <Col span={20}>
                                                    <strong
                                                        target='_blank'
                                                        rel="noreferrer"
                                                        className={styles['ksn-order-item-title']}
                                                        title={v1.supply_name !== '' ? v1.supply_name : v1.item_name}
                                                        onClick={() => {windowOpen(v1.supply_url !== '' ? v1.supply_url : v1.item_url)}}
                                                    >{v1.supply_name !== '' ? v1.supply_name : v1.item_name}</strong>
                                                    <div className={styles['ksn-order-item-info']}>
                                                        <div className={styles['ksn-order-item-option']} title={v1.supply_options !== '' ? v1.supply_options : v1.item_options}>{v1.supply_options !== '' ? v1.supply_options : v1.item_options}</div>
                                                        <div className={styles['ksn-order-item-price']}>
                                                            <b>
                                                                {v1.supply_price > 0 ? '￥' + addComma(v1.supply_price) : addComma(v1.item_price) + '円'}
                                                            </b>
                                                            <b>x {v1.quantity}</b>
                                                        </div>
                                                    </div>
                                                    <div className={styles['ksn-order-item-supplier']} style={{ marginBottom: 6 }}>
                                                        <select
                                                            onChange={e => updateOrderItem(v1.id, {
                                                                supply_market: e.target.value
                                                            })}
                                                        >
                                                            <option value="" selected={v1.supply_market === '' ? 'selected' : ''}>平台</option>
                                                            {MARKETS.map((m, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={m.market}
                                                                    selected={v1.supply_market === m.market ? 'selected' : ''}
                                                                >{m.name}</option>
                                                            ))}
                                                        </select>
                                                        <Input
                                                            size="small"
                                                            defaultValue={v1.supply_order_id}
                                                            placeholder="请输入采购订单ID"
                                                            style={{ width: 200, marginLeft: 8 }}
                                                            onBlur={e => updateOrderItem(v1.id, {
                                                                supply_order_id: e.target.value
                                                            })}
                                                        />
                                                    </div>
                                                    <div className={styles['ksn-order-item-supplier']}>
                                                        <Input
                                                            size="small"
                                                            defaultValue={v1.supply_delivery_name}
                                                            placeholder="请输入快递名称"
                                                            style={{ width: 100 }}
                                                            onBlur={e => updateOrderItem(v1.id, {
                                                                supply_delivery_name: e.target.value
                                                            })}
                                                        />
                                                        <Input
                                                            size="small"
                                                            defaultValue={v1.supply_delivery_number}
                                                            placeholder="请输入快递单号"
                                                            style={{ width: 180, marginLeft: 8 }}
                                                            onBlur={e => updateOrderItem(v1.id, {
                                                                supply_delivery_number: e.target.value
                                                            })}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    ))}
                                </Card>
                            ))
                        )
                        : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    }
                </Spin>
            </div>
        </div>
    );
}

export default Sourced;