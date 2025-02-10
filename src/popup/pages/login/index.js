import React, { useEffect, useState } from 'react';
import { Row, Form, Input, Button, Space } from 'antd';
import styles from './login.module.css';
import { LoginAction } from '../../../actions/LoginAction';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/loading';

function Login(props) {
    const [loading, setLoading] = useState('none');//加载转圈圈

    const navigate = useNavigate();

    useEffect(() => {
        //打开页面后如果有登录信息，则跳转到首页
        const token = localStorage.getItem('token');
        if (token) {
            props.set_auth(token);
            navigate('/');
        } else {
            props.set_auth(null);
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    /**表单提交成功 */
    const onFinish = async (values) => {
        setLoading('block');
        const res = await LoginAction.auth(values);
        if (res) {
            props.set_auth(res.result);
            navigate('/');
        }
        setLoading('none');
    }

    return (
        <div className="popup">
            <Row justify="center" className={styles.logo}>
                <Space direction="vertical" align="center">
                    <img src="/favicon.png" alt="" />
                    <h2>科速诺采购助手</h2>
                </Space>
            </Row>

            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名' }]}
                >
                    <Input placeholder="请输入用户名" autoComplete="off" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="密码"
                    rules={[{ required: true, message: '请输入密码'}]}
                >
                    <Input.Password placeholder="请输入密码" autoComplete="off" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" block={true} htmlType="submit">登录</Button>
                </Form.Item>
            </Form>

            <Loading loading={loading} tip="数据验证中..." />
        </div>
    );
}

export default Login;