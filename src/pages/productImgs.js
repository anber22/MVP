import { Button, Input, Space, Table, Tag } from 'antd';
import {ref, useState, useRef, useEffect} from 'react';
import Canvas from '@/components/canvas';
import { useRouter } from 'next/router';
import Router from "next/router"
function Index (){
  const router = useRouter();
  const [imgs, setImgs] = useState([])
  useEffect(() => {
    const { id } = router.query;
     // console.log(id)
    getProductImgs(id)
  }, [])
  const getProductImgs = async id => {
    const products = await fetch(
      `/mvp/ai/product/${id}/photo`,
      {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImI0ZjE4YTY3LTFjZWMtNGU1My1hMDYyLWI3OWUwZDE3YmMwNCJ9.-Kwmpg96C9jGqqv9Vf0vC_aAcrV1IALdpzMkGmc5jcpovD3oVgGQWXzZBftTEBRFtf34iUlA5tnqAEHj-vx_cA'
        }
      }
    ).then((response) => response.json());
    setImgs(products.data)
  }
  const toPainting = current => {
     // console.log('当前选中的图片', current)
    Router.push({
      pathname: '/createImage', 
      query: {
        hasMask: true,
        photoId: current.photoId
      }
    })
  }
  return (
    <div className='flex-col grow content-box mb-12'>
      <div className='flex'>
        <div className='mb-4'>Select an image to start AI: </div>
        <div className='mb-4 ml-12'> (or Upload New Photo) </div>
      </div>
      {
        imgs ? imgs.map((item, index) => {
          return (<img className='product-img-detail mr-4 cursor-pointer' src={item.photoUrl} key={index} onClick={() => toPainting(item)}/>)
        }) : ''
      }
    </div>
  )
}

export default function ProductImgs() {
  return <Index></Index>
}
