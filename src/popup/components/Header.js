import { Space } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { MARKETS } from '../../Markets';

function Header() {
    return (
        <div className="header">
            <Link to="/" className="logo">
                <img src="/favicon.png" alt="Logo" />
                <h1>科速诺采购助手</h1>
            </Link>
            <Space>
                {MARKETS.map(v => (
                    <a href={v.main_url} target='_blank' rel="noreferrer" className="markets">
                        <img src={v.logo} alt="" />
                    </a>
                ))}
            </Space>
        </div>
    );
}

export default Header;