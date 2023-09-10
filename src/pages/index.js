import { Button, Input, Space, Table, Tag } from 'antd';
import {ref, useState, useRef} from 'react';
import Canvas from '@/components/canvas';
import Router from "next/router"
function Index (){
  const columns = [
    {
      title: 'Product',
      dataIndex: 'Product',
      key: 'Product',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Created Date',
      dataIndex: 'Created Date',
      key: 'Created Date',
    }
  ]
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser']
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher']
    }
  ]
  return (
    <div className='flex-grow overflow-y-auto'>
      <div className='flex justify-between'>
        My Product
        <Button type="primary">+ New Product</Button>
      </div>
      <div className='flex items-center'>
        <Input className='h-8 mt-4 w-96' placeholder="Search by product name" />
        <Button className='mt-4 ml-2' type="primary" onClick={() => {Router.push('/createImage')}}>to generate</Button>
      </div>
      <Table className='mt-4' columns={columns} dataSource={data} />
    </div>
    
  )
}

export default function Home() {
  return <Index></Index>
}
