import { Col, Drawer, Input, Row, Space, Spin, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import styles from './items.module.css';
import ItemView from './view';
import { ItemAction } from '../../../actions/ItemAction';

function Items() {
    const [itemList, setItemList] = useState([]);//采购商品详细Modal
    const [filteredItemList, setFilteredItemList] = useState([]);
    const [itemViewModal, setItemViewModal] = useState(false);//采购商品详细Modal
    const [itemViewComponent, setItemViewComponent] = useState(null);//采购商品详细组件
    const [loading, setLoading] = useState(false);
    
    const params = useParams();

    const { Search } = Input;
    const { Paragraph } = Typography;

    useEffect(() => {
        getItemList();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    /** 获取待采购商品列表 */
    const getItemList = async () => {
        setLoading(true);

        const res = await ItemAction.itemList({shop_id: params.shop_id});
        if (res) {
            setItemList(res.result);
            setFilteredItemList(res.result);
        }

        setLoading(false);
    }

    /** 筛选过滤商品 */
    const filterItem = (e) => {
        setFilteredItemList(itemList.filter(v=>(
            v.item_id.indexOf(e) > -1
            || v.item_name.indexOf(e) > -1
            || v.supply_name.indexOf(e) > -1
        )));
    }

    /** 打开商品详细弹窗 */
    const itemView = (ids) => {
        setItemViewComponent(<ItemView ids={ids} />);
        setItemViewModal(true);
    }

    /** 关闭抽屉 */
    const closeDraw = () => {
        setItemViewModal(false);
        setItemViewComponent(null);
    }

    return (
        <div className="popup">
            <Header />
            <Spin spinning={loading}>
                <dl className={styles['items']}>
                    <dt>
                        <Search
                            placeholder="请输入商品ID，商品中文名或日文名"
                            allowClear
                            onSearch={filterItem}
                        />
                    </dt>
                    {filteredItemList.map((v, k) => (
                        <dd key={k}>
                            <Row gutter={8}>
                                <Col span={5} style={{textAlign:'center'}}>
                                    {
                                        v.item_image !== ''
                                        ? <img src={v.item_image} alt="" />
                                        : (v.supply_image !== ''
                                            ? <img src={v.supply_image} alt="" />
                                            : <img src={require('../../../asset/img/gift.png')} alt="" style={{width:'75%'}} />
                                            )
                                    }
                                </Col>
                                <Col span={19}>
                                    <Paragraph ellipsis={{ rows: 2 }} title={v.supply_name !== '' ? v.supply_name : v.item_name} style={{ marginBottom: 12 }}>
                                        {v.supply_id > 0
                                        ? <Tag color="success">已匹配</Tag>
                                        : <Tag color="error">未匹配</Tag>}
                                        {v.supply_name !== '' ? v.supply_name : v.item_name}
                                    </Paragraph>
                                    <section className={styles['options']}>
                                        <Space>
                                            <p title={v.supply_options !== '' ? v.supply_options : v.item_options}>{v.supply_options !== '' ? v.supply_options : v.item_options}</p>
                                            <b>x{v.quantity}</b>
                                        </Space>
                                        <Space>
                                            {v.supply_url !== '' &&
                                            <Tag
                                                bordered={false}
                                                color="processing"
                                                className="pointer"
                                                style={{ margin: 0 }}
                                                onClick={()=>{window.open(v.supply_url)}}
                                            >采购</Tag>}
                                            <Tag bordered={false} color="processing" className="pointer" style={{ margin: 0 }} onClick={()=>{itemView(v.ids)}}>详细</Tag>
                                        </Space>
                                    </section>
                                </Col>
                            </Row>
                        </dd>
                    ))}
                </dl>
            </Spin>

            <Drawer
                placement="bottom"
                closeIcon={false}
                onClose={closeDraw}
                open={itemViewModal}
                styles={{body:{padding:0}}}
            >
                {itemViewComponent}
            </Drawer>
        </div>
    );
}

export default Items;