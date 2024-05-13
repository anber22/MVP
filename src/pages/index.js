import { Button, Input, Space, Table, Tag, Modal } from 'antd';
import {ref, useState, useRef, useEffect} from 'react';
import Canvas from '@/components/canvas';
import CreateProduct from '@/components/product/createProduct.js';
import EditProduct from '@/components/product/editImage.js';

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
      render: (productId, productName) => <div className='flex'>
          <p className='underline cursor-pointer mr-6' onClick={($event) => editProduct($event, productId, productName)}>Edit</p>
          <p className='underline cursor-pointer' onClick={($event) => deleteProduct($event, productId, productName)}>Delete</p>
        </div>
    }
  ]
  let [curPage, setCurPage] = useState(1)
  let [showCreateProduct, setShowCreateProduct] = useState(false)
  let [showEditProduct, setShowEditProduct] = useState(false)
  let [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [currentProduct, setCurrentProduct] = useState([])
  useEffect(() => {
    getProducts()
  }, [])
  const editProduct = (e, productId) => {
    e.stopPropagation() // 阻止冒泡
    setCurrentProduct(productId)
    setShowEditProduct(true)
  }
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
    if(showCreateProduct) setShowCreateProduct(false)
    if(showEditProduct) setShowEditProduct(false)
    if(reload) getProducts()
  }
  const deleteProduct = async (e, id, product) => {
    e.stopPropagation() // 阻止冒泡
    modal.confirm({
      title: '',
      icon: null,
      centered: true,
      content: `Delete Product ${product.productName}?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
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
        if(delRes.code === 200){
          getProducts()
        }
      },
      onCancel: () => {}
    })
  }
  const showProductOption = () => {
    if(showCreateProduct){
      return <CreateProduct backToList={(e) => {backToList(e)}} />
    }else if(showEditProduct) {
      return <EditProduct backToList={(e) => {backToList(e)}} productId = {currentProduct}/>
    }else{
      return false
    }
  }
  return (
    <div className='flex-grow overflow-y-auto'>
      {showProductOption() ? showProductOption()  : (
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
                      id: record.productId,
                      name: record.productName
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
