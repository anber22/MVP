import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PushpinTwoTone,
  ShoppingTwoTone,
  ThunderboltTwoTone,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
const { Header, Sider, Content } = Layout;
export default function Template (props) {
  const [collapsed, setCollapsed] = useState(true);
  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();
  return (
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
          items={[
            {
              key: '1',
              icon: <ShoppingTwoTone />,
              label: 'My Product',
            }
          ]}
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
          <div className='mr-10'>
            Anber
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
  );
};