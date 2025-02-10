import { Input, Tabs } from 'antd';
import React from 'react';
import styles from './items.module.css';
import SourcingItems from './SourcingItems';
import SourcingMatchedItem from './SourcingMatchedItem';
import { connect } from 'react-redux';

function Sourcing(props) {
    const items = [
        {
            label: <div style={{ fontSize: 12 }}>全部商品</div>,
            key: 'all',
            children: <div className={styles['ksn-order-wrap']}>{<SourcingItems />}</div>
        },
        {
            label: <div style={{ fontSize: 12 }}>匹配商品</div>,
            key: 'matched',
            children: <div className={styles['ksn-order-wrap']}>{<SourcingMatchedItem />}</div>
        }
    ];

    return (
        <div className="ksn-sourcing">
            <Tabs
                size="small"
                type="card"
                defaultActiveKey={props.activeKey}
                tabBarExtraContent={{ right: <Input onInput={(e)=>{props.setSearchKeyword(e.target.value)}} placeholder="商品ID，中文名或日文名" /> }}
                items={items}
            />
        </div>
    );
}

const mapStateToProps = ({
    searchKeywordReducer: { search_keyword },
}) => {
    /** 以下属性挂载到 props 参数 */
    return {
        search_keyword,
    }
}

const mapDispatchToProps = {
    setSearchKeyword(keyword) {
        return {
            type: 'set_search_keyword',
            payload: keyword
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sourcing);