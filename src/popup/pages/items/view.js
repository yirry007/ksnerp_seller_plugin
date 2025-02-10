import { Card, Col, Divider, Empty, Image, Row, Spin, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './items.module.css';
import { addComma } from '../../../utils/functions';
import { ItemAction } from '../../../actions/ItemAction';

function ItemView(props) {
    const [itemData, setItemData] = useState({});//订单商品信息
    const [supplyData, setSupplyData] = useState(null);//采购商品
    const [orders, setOrders] = useState([]);//订单商品所属的订单列表
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getItemInfo();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    /** 获取订单详细数据 */
    const getItemInfo = async () => {
        setLoading(true);

        const res = await ItemAction.itemInfo({ids: props.ids});
        if (res)  {
            setItemData(res.result.item);
            setSupplyData(res.result.supply);
            setOrders(res.result.orders);
        }

        setLoading(false);
    }

    const { Paragraph } = Typography;

    return (
        <Spin spinning={loading}>
            <div className={styles['item']}>
                <Divider orientation="left" style={{ fontSize: 14, color: 'rgba(0,0,0,0.65)' }}>采购商品</Divider>
                {supplyData
                    ? (
                        <div className={styles['info']}>
                            <Row gutter={8} style={{ marginBottom: 12 }}>
                                <Col span={6}>
                                    <Image src={supplyData.supply_image} />
                                </Col>
                                <Col span={18}>
                                    <Paragraph ellipsis={{ rows: 4 }} title={supplyData.supply_name} style={{ margin: 0, minHeight: 70 }}>
                                        {supplyData.supply_name}
                                    </Paragraph>
                                    <div className={styles['item-price']}>￥{addComma(supplyData.supply_price)}</div>
                                </Col>
                            </Row>
                            <ul className={styles['info-line']}>
                                <li>
                                    <b>购买数量</b>
                                    <i className={styles['item-quantity']}>x {itemData.quantity ? itemData.quantity : '-'}</i>
                                </li>
                                <li>
                                    <b>商品选项</b>
                                    <Tooltip placement="topRight" title={supplyData.supply_options}>
                                        <i>{supplyData.supply_options}</i>
                                    </Tooltip>
                                </li>
                                <li>
                                    <b>商品URL</b>
                                    <a className={styles['item-url']} href={supplyData.supply_url} target='_blank' rel="noreferrer">{supplyData.supply_url}</a>
                                </li>
                            </ul>
                        </div>
                    )
                    : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无匹配的采购商品" />
                }

                <Divider orientation="left" style={{ fontSize: 14, color: 'rgba(0,0,0,0.65)' }}>订单商品</Divider>
                <div className={styles['info']}>
                    <Row gutter={8} style={{ marginBottom: 12 }}>
                        <Col span={6}>
                            <Image src={itemData.item_image !== '' ? itemData.item_image : require('../../../asset/img/gift.png')} />
                        </Col>
                        <Col span={18}>
                            <Paragraph ellipsis={{ rows: 4 }} title={itemData.item_name} style={{ margin: 0, minHeight: 70 }}>
                                {itemData.item_name}
                            </Paragraph>
                            <div className={styles['item-price']}>{addComma(itemData.item_price)}円</div>
                        </Col>
                    </Row>
                    <ul className={styles['info-line']}>
                        <li>
                            <b>购买数量</b>
                            <i className={styles['item-quantity']}>x {itemData.quantity}</i>
                        </li>
                        <li>
                            <b>商品选项</b>
                            <Tooltip placement="topRight" title={itemData.item_options}>
                                <i>{itemData.item_options}</i>
                            </Tooltip>
                        </li>
                        <li>
                            <b>商品URL</b>
                            <a className={styles['item-url']} href={itemData.item_url} target='_blank' rel="noreferrer">{itemData.item_url}</a>
                        </li>
                    </ul>
                </div>

                <Divider orientation="left" style={{ fontSize: 14, color: 'rgba(0,0,0,0.65)' }}>订单信息</Divider>
                {orders.map((v, k)=>(
                    <Card size="small" style={{marginBottom:12}} key={k}>
                        <ul className={styles['info-line']}>
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
                        </ul>
                    </Card>
                ))}
            </div>
        </Spin>
    );
}

export default ItemView;