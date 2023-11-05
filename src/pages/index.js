import { Button, Input, Space, Table, Tag } from 'antd';
import {ref, useState, useRef, useEffect} from 'react';
import Canvas from '@/components/canvas';
import Router from "next/router"
function Index (){
  let columns = [
    {
      title: 'Product',
      dataIndex: 'productCoverUrl',
      key: 'productCoverUrl',
      render: (productCoverUrl) => <img className='product-img' src={productCoverUrl} />
    },
    {
      title: 'Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Created Date',
      dataIndex: 'createDate',
      key: 'createDate',
    }
  ]
  const [data, setData] = useState([])
  useEffect(() => {
    getProducts()
  }, [])
  const getProducts = async () => {
    const products = await fetch(
      "/mvp/ai/home/product",
      {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImE0OWIzNzlkLTQyN2UtNDRiMC04ZWE5LThiOWFjNDI4YTk3NiJ9.u1i4Z1OJl04Skfq_sL8v_u92MdKxt3xzU2mboF4XKSas7hGpBPXvxu6ZG41d2ZVc1YiNMUJn8gZcUhj_fzZLPw'
        }
      }
    ).then((response) => response.json());
     // console.log('获取商品列表', products)
    setData(products.rows)
  }
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
      <Table 
        onRow={(record) => {
          return {
            onClick: (event) => {
              Router.push({
                pathname: '/productImgs', 
                query: {
                  id: record.productId
                }
              })}, // 点击行
          };
        }} 
        className='mt-4' 
        columns={columns} 
        dataSource={data}
      />
    </div>
    
  )
}

export default function Home() {
  return <Index></Index>
}
