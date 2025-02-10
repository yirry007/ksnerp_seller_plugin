import { Col, Collapse, Empty, Row, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './items.module.css';
import { MARKET_HANDLE } from '../../Markets';

function SourcingMatchedItem(props) {
    const [itemInfo, setItemInfo] = useState({});//待采购商品基本信息
    const [optionInfo, setOptionInfo] = useState([]);//待采购商品选项，数量以及原始（雅虎，乐天等）订单
    const [loading, setLoading] = useState(false);

    const { Paragraph } = Typography;

    useEffect(() => {
        getMatchedItem();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    /** 获取已匹配商品 */
    const getMatchedItem = () => {
        setLoading(true);

        const _handle = MARKET_HANDLE();

        if (!_handle) {
            setLoading(false);
            return false;
        }

        _handle.getMatchedItem(res => {
            if (res && res.code === '') {
                setItemInfo(res.result.item_info);
                setOptionInfo(res.result.option_info);
            }

            setLoading(false);
        });
    }

    /** 采购商品选项以及购买数量 */
    const optionList = (options) => (
        options.map((v, k) => {
            return {
                key: k,
                label: <div className={styles['ksn-item-option']} title={v.supply_options}>{v.supply_options !== '' ? v.supply_options : '无选项'}</div>,
                extra: <div className={styles['ksn-item-option-quantity']}>x {v.quantity}</div>,
                children: orderList(v.orders),
            }
        })
    );

    /** 采购商品所属的订单信息 */
    const orderList = (orders) => (
        orders.map(v => (
            <div className={styles['ksn-order-infos']} key={v}>
                <div className={styles['ksn-order-info']}>
                    <div className={styles['ksn-order-info-key']}>店铺类型</div>
                    <div className={styles['ksn-order-info-value']}>{v.market}</div>
                </div>
                <div className={styles['ksn-order-info']}>
                    <div className={styles['ksn-order-info-key']}>店铺ID</div>
                    <div className={styles['ksn-order-info-value']}>{v.shop_id}</div>
                </div>
                <div className={styles['ksn-order-info']}>
                    <div className={styles['ksn-order-info-key']}>订单ID</div>
                    <div className={styles['ksn-order-info-value']}>{v.order_id}</div>
                </div>
                <div className={styles['ksn-order-info']}>
                    <div className={styles['ksn-order-info-key']}>订单时间</div>
                    <div className={styles['ksn-order-info-value']}>{v.order_time}</div>
                </div>
                <div className={styles['ksn-order-info']}>
                    <div className={styles['ksn-order-info-key']}>订单数量</div>
                    <div className={styles['ksn-order-info-quantity']}>x {v.quantity}</div>
                </div>
            </div>
        ))
    );

    return (
        <Spin spinning={loading}>
            {itemInfo.quantity
                ? <>
                    <Row gutter={8} style={{ margin: 0, marginBottom: 12 }}>
                        <Col span={6}>
                            <img src={itemInfo.image_url} alt="" style={{ width: '100%' }} />
                        </Col>
                        <Col span={18}>
                            <Paragraph ellipsis={{ rows: 3 }} title={itemInfo.supply_name} style={{ margin: 0, minHeight: 60, fontSize: 14, color: 'rgba(0,0,0,0.85)' }}>{itemInfo.supply_name}</Paragraph>
                            <div className={styles['ksn-item-price']}>
                                <div className={styles['ksn-item-price-range']}>￥{itemInfo.price_range}</div>
                                <div className={styles['ksn-item-quantity']}>x {itemInfo.quantity}</div>
                            </div>
                        </Col>
                    </Row>
                    <div style={{ marginBottom: 4 }}>
                        <Collapse items={optionList(optionInfo)} />
                    </div>
                </>
                : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
        </Spin>
    );
}

export default SourcingMatchedItem;