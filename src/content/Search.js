import { Drawer } from 'antd';
import { useState } from 'react';
import Compiling from './components/search/compiling';

function Search() {
    const [drawOpen, setDrawOpen] = useState(false);
    const [imgUrl, setImgUrl] = useState(null);

    const openSearch = () => {
        const dom = document.querySelector('#KSN-IMAGE-SEARCH');
        const imageSrc = dom.getAttribute('data-src');

        setImgUrl(imageSrc);
        setDrawOpen(true);
    }

    return (
        <>
            <div className="ksn-search ksn-wrap" onClick={openSearch}>
                <img className="ksn-search" src={require('../asset/img/search.png')} alt="" />
                <span className="ksn-search">1688</span>
            </div>
            <Drawer
                title="科速诺商品图片搜索"
                placement="left"
                size="large"
                onClose={() => {setDrawOpen(false)}}
                open={drawOpen}
                zIndex={99999999}
                destroyOnClose={true}
            >
                <Compiling imgUrl={imgUrl} />
            </Drawer>
        </>
    );
}

export default Search;