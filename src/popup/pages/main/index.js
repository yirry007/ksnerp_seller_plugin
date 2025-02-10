import { Button, Card, Col, Row, Space, Spin, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header';
import { LoginAction } from '../../../actions/LoginAction';
import { MainAction } from '../../../actions/MainAction';

function Main() {
    const [sourcingItemData, setSourcingItemData] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getMainData();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const getMainData = async () => {
        setLoading(true);

        const res = await MainAction.mainData();
        res.code === '' && setSourcingItemData(res.result);

        setLoading(false);
    }

    const logout = async () => {
        await LoginAction.logout();
        navigate('/login');
    }

    return (
        <div className="popup">
            <Header />
            <Spin spinning={loading}>
                <div style={{minHeight: 392, paddingTop: 8}}>
                    <Row gutter={[12, 12]}>
                        {sourcingItemData.map((v, k)=>(
                            <Col span={12} key={k}>
                                <Card
                                    size="small"
                                    title={v.market ? <img src={require(`../../../asset/img/${v.market}.png`)} alt="" height={12} /> : '所有店铺'}
                                    extra={<Link to={`/items/${v.id}`} style={{fontSize:12,color:'rgba(0,0,0,0.45)',textDecoration:'underline'}}>详细</Link>}
                                    bodyStyle={{textAlign: "center"}}
                                >
                                    <Statistic title={v.shop_id} value={v.quantity} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Spin>
            <Row gutter={[12, 12]} className="mt12">
                <Col span={12}>
                    <Button type="primary" style={{backgroundColor: '#ff5000'}} block onClick={() => {window.open('https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm')}}>查看淘宝/天猫订单</Button>
                </Col>
                <Col span={12}>
                    <Button type="primary" style={{backgroundColor: '#ff4000'}} block onClick={() => {window.open('https://trade.1688.com/order/buyer_order_list.htm')}}>查看1688订单</Button>
                </Col>
            </Row>
            <Button type="primary" danger block onClick={logout} className="mt12">退出登录</Button>
        </div>
    );
}

export default Main;