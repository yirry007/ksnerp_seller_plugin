import { Col, Row, Steps, Typography } from 'antd';
import { LoadingOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { RequestCommon } from '../../RequestCommon';
import { Api } from '../../../utils/api';

function Compiling(props) {
    const [saveStatus, setSaveStatus] = useState({
        status: 'process',
        icons: <LoadingOutlined />
    });
    const [uploadStatus, setUploadStatus] = useState({
        status: 'wait',
        icons: <ClockCircleOutlined />
    });
    const [searchStatus, setSearchStatus] = useState({
        status: 'wait',
        icons: <ClockCircleOutlined />
    });
    const [imageId, setImageId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [items, setItems] = useState([]);

    const { Paragraph } = Typography;

    const pageSize = 20;
    const country = 'en';

    useEffect(() => {
        imageSearch();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const imageSearch = () => {
        /** 本地服务器保存图片 */
        RequestCommon({
            url: Api.image_save,
            method: 'post',
            datas: { image_url: props.imgUrl },
            callback: res => {
                if (res.code !== '') {
                    setSaveStatus({
                        status: 'error',
                        icons: <CloseCircleOutlined />
                    });
                    console.log(res.code);
                    return false;
                }

                setSaveStatus({
                    status: 'finish',
                    icons: <CheckCircleOutlined />
                });
                setUploadStatus({
                    status: 'process',
                    icons: <LoadingOutlined />
                });

                /** 图片上传到1688服务器，获取image_id */
                RequestCommon({
                    url: Api.image_upload,
                    method: 'post',
                    datas: { image_path: res.result.image_path },
                    callback: res1 => {
                        if (res1.code !== '') {
                            setUploadStatus({
                                status: 'error',
                                icons: <CloseCircleOutlined />
                            });
                            console.log(res1.code);
                            return false;
                        }

                        setUploadStatus({
                            status: 'finish',
                            icons: <CheckCircleOutlined />
                        });
                        setSearchStatus({
                            status: 'process',
                            icons: <LoadingOutlined />
                        });

                        /** 设置 image_id，用于之后的加载更多请求 */
                        setImageId(res1.result.imageId);

                        /** 根据 image_id，搜索商品 */
                        getItems(res1.result.imageId);
                    }
                });
            }
        });
    }

    /**
     * 根据 1688, image_id 获取商品列表
     * @param {*} image_id 
     * @returns 
     */
    const getItems = (image_id = imageId) => {
        if (!image_id) return false;

        RequestCommon({
            url: Api.image_search,
            method: 'post',
            datas: {
                image_id: image_id,
                page_num: currentPage,
                page_size: pageSize,
                country: country
            },
            callback: res => {
                if (res.code !== '') {
                    setSearchStatus({
                        status: 'error',
                        icons: <CloseCircleOutlined />
                    });
                    console.log(res);
                    return false;
                }

                setSearchStatus({
                    status: 'finish',
                    icons: <CheckCircleOutlined />
                });

                /** 当前页 + 1 */
                setCurrentPage(res.result.currentPage + 1);

                /** 商品数据追加 */
                setItems([...items, ...res.result.data]);
            }
        });
    }

    return (
        <>
            <Steps
                size="small"
                current={1}
                style={{marginBottom: 24}}
                items={[
                    {
                        title: '图片上传',
                        status: saveStatus.status,
                        icon: saveStatus.icons,
                    },
                    {
                        title: '图片解析',
                        status: uploadStatus.status,
                        icon: uploadStatus.icons,
                    },
                    {
                        title: '搜索商品',
                        status: searchStatus.status,
                        icon: searchStatus.icons,
                    },
                ]}
            />
            <Row gutter={[16, 16]}>
                {items.map(v => (
                    <Col span={8}>
                        <div onClick={() => {window.open(`https://detail.1688.com/offer/${v.offerId}.html?kj_agent_plugin=kesunuo`)}} className="ksn-image-search-item">
                            <img src={v.imageUrl} alt={v.subject} />
                            <Paragraph ellipsis={{ rows: 2 }} style={{ fontSize: '14px', color: 'rgba(0,0,0,0.65)', marginBottom: '8px' }}>{v.subject}</Paragraph>
                            <p>
                                <strong>￥{v.priceInfo.price}</strong>
                                <span>复购率: {v.repurchaseRate}</span>
                            </p>
                            <p>
                                <span></span>
                                <span>30天内{v.monthSold}个成交</span>
                            </p>
                        </div>
                    </Col>
                ))}
            </Row>
        </>
    );
}

export default Compiling;