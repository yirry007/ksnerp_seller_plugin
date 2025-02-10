import React, { useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Main from './pages/main';
import Items from './pages/items';
import './pages.css';
import ItemView from './pages/items/view';

function Router(props) {
    const [auth, setAuth] = useState(localStorage.getItem('token'));

    return (
        <HashRouter>
            <Routes>
                <Route exact path="/login" element={<Login set_auth={setAuth} />} />
                <Route path="/*" element={
                    auth
                    ?<Routes>
                        <Route exact path="/" element={<Main />} />
                        <Route exact path="/items/:shop_id" element={<Items />} />
                        <Route exact path="/item/:id" element={<ItemView />} />
                    </Routes>
                    :<Navigate to="/login" />}
                />
            </Routes>
        </HashRouter>
    );
}

export default Router;