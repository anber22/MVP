import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CaretDownOutlined,
  ShoppingTwoTone,
  ThunderboltTwoTone,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Popover } from 'antd';
import Router from 'next/router';

const { Header, Sider, Content } = Layout;
export default function Template (props) {
  const [collapsed, setCollapsed] = useState(true);
  let [userInfo, setUserInfo] = useState(true);
  useEffect(() => {
    if(Cookies.get('userInfo')){
      setUserInfo(JSON.parse(Cookies.get('userInfo')))
    }
  }, [])
  function getItem (label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  const popoverContent = (
    <div>
      <p className='m-1 px-4 cursor-pointer log-out' onClick={() => logOut()}>Log out</p>
    </div>
  );
  const logOut = () => {
    Cookies.remove('userInfo')
    Cookies.remove('token')
    Router.push({
      pathname: '/login', 
    })
  }
  const items = [
    getItem('My Product', '/', <img className='w-4 h-4' src="/product.png"/>),
    // 
  ];
  const selectMenu = e => {
    Router.push({
      pathname: e.key, 
    })
  }
  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();
  return (
    <div className='font-Poppins'>
      <Layout className='layout-box flex grow'>
        <Sider  
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            background: 'white'
          }} 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
        >
          <div className="layout-logo-box text-black flex justify-center items-center">
            <img className='logo-img' src='/logo-white.png'/>
          </div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={items}
            onClick={selectMenu}
          />
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 200, height: '100vh' }}>
          <Header
            style={{
              padding: 0,
              "backgroundColor": 'white',
            }}
            className='flex justify-between'
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <div className='flex items-center'>
              <Popover className='user-popover' content={popoverContent} trigger="click">
                <div className='flex items-center mr-10 h-12 cursor-pointer user-info'>
                  {userInfo.nickName}
                  <CaretDownOutlined className='ml-2'/>
                </div>
              </Popover>
            </div>
          </Header>
          <Content
            style={{
              padding: 24,
              minHeight: 280,
              // background: colorBgContainer,
            }}
          >
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};