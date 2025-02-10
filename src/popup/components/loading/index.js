import { Spin } from 'antd';
import styles from './loading.module.css';

function Loading (props) {
    return (
        <div className={styles.loading} style={{display: props.loading}}>
            <Spin spinning={true} tip={props.tip} size="large" className={styles.loading_spin}></Spin>
        </div>
    );
}

export default Loading;