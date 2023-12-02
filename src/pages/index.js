import { Button, Input, Space, Table, Tag, Modal } from 'antd';
import {ref, useState, useRef, useEffect} from 'react';
import Canvas from '@/components/canvas';
import CreateProduct from '@/components/product/createProduct.js';
import Router from "next/router"
import Cookies from 'js-cookie';
function Index (){
  const [modal, contextHolder] = Modal.useModal();
  let columns = [
    {
      title: 'Product',
      dataIndex: 'productCoverUrl',
      key: 'productCoverUrl',
      render: (productCoverUrl) => <img className='product-img' src={!productCoverUrl ? '/product-default-img.png' : productCoverUrl} />
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
    },
    {
      title: '',
      dataIndex: 'productId',
      key: 'productId',
      render: (productId, productName) => <p className='underline cursor-pointer' onClick={($event) => deleteProduct($event, productId, productName)}>Delete</p>
    }
  ]
  let [curPage, setCurPage] = useState(1)
  let [showCreateProduct, setShowCreateProduct] = useState(false)
  let [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  useEffect(() => {
    getProducts()
  }, [])
  const getProducts = async () => {
    setLoading(true)
    const products = await fetch(
      "/mvp/ai/home/product?pageSize=9999&pageNum=1",
      {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Cookies.get('token')
        }
      }
    ).then((response) => response.json());
    if(products.code === 401){
      Router.push({
        pathname: '/login', 
      })
    }
    setLoading(false)
     // console.log('获取商品列表', products)
     let temp = products.rows.map(item => {
      item.createDate = getDate(item.createDate)
      return item
     })
    setData(temp)
  }
  const appendZero = (obj) => {
    if (obj < 10) {
      return '0' + obj
    } else {
      return obj
    }
  }
  const getDate = (input) => {
    let dt = new Date(Number(input + '000'))
    const y = dt.getFullYear()
    const m = appendZero((dt.getMonth() + 1).toString())
    const d = appendZero(dt.getDate().toString())
    return `${y}-${m}-${d}`
  }
  const createProduct = () => {
    setShowCreateProduct(true)
  }
  const backToList = (reload) => {
    console.log('reload', reload)
    setShowCreateProduct(false)
    if(reload) getProducts()
  }
  const deleteProduct = async (e, id, product) => {
    e.stopPropagation() // 阻止冒泡
    console.log('delete', e, id, product)
    modal.confirm({
      title: '',
      icon: null,
      centered: true,
      content: `Delete Product ${product.productName}?`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const delRes = await fetch(
          `/mvp/ai/product/${id}`,
          {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': Cookies.get('token')
            }
          }
        ).then((response) => response.json());
        console.log('res', delRes)
        if(delRes.code === 200){
          getProducts()
        }
      },
      onCancel: () => {}
    })
  }
  return (
    <div className='flex-grow overflow-y-auto'>
      {showCreateProduct ? (<CreateProduct backToList={(e) => {backToList(e)}}/>)  : (
        <div>
          <div className='flex items-center text-2xl'>
            My Products
            <Button type="primary ml-6" onClick={() => createProduct()}>+ New Product</Button>
          </div>
          <div className='flex items-center mt-6 mb-6'>
            <Input className='h-8 mt-4 w-2/5' placeholder="Search by product name" />
            {/* <Button className='mt-4 ml-2' type="primary" onClick={() => {Router.push('/createImage')}}>to generate</Button> */}
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
            loading={loading}
            className='mt-4' 
            columns={columns} 
            dataSource={data}
          />
        </div>
      )}
    {contextHolder}
    </div>
    
  )
}

export default function Home() {
  return <Index></Index>
}
