import React from "react";

import { Link, Outlet } from "react-router-dom";
import { Layout, Menu } from 'antd';

import logo from "./assets/crehana.png";
import './assets/styles.css';

export default function Home() {
    const { Header, Content, Footer } = Layout;

    return (
        <Layout className="layout">
            <Header>
                <Link to="/">
                    <div className="logo">
                        <img src={logo} alt="Logo" width={130}/>
                    </div>
                </Link>
                <Menu mode="horizontal">
                    <Menu.Item key={1}>
                        <Link to="countries">
                            Paises
                        </Link>
                    </Menu.Item>
                    <Menu.Item key={2}>
                        <Link to="tickets">
                            Venta de boletos
                        </Link>
                    </Menu.Item>
                </Menu>
            </Header>
            <Content style={{ padding: '0 50px', marginTop: '50px' }}>
                <div className="site-layout-content">
                    <Outlet />
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Crehana ©2022 Created by <a href="https://github.com/angeldavidhf" target="_blank" rel="noopener noreferrer">Angel David</a></Footer>
        </Layout>
    )
}