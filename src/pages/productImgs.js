import { Button, Input, Select, Space, Table, Tag, message } from 'antd';
import {ref, useState, useRef, useEffect} from 'react';
import Canvas from '@/components/canvas';
import { useRouter } from 'next/router';
import Router from "next/router"
import Cookies from 'js-cookie';

function Index (){
  const router = useRouter();
  const [imgs, setImgs] = useState([])
  const [productId, setProductId] = useState([])
  const [showControlIndex, setShowControlIndex] = useState(-1)
  const [messageApi, contextHolder] = message.useMessage();
  let myInput = useRef()
  useEffect(() => {
    const { id } = router.query;
     // console.log(id)
    setProductId(id)
    getProductImgs(id)
  }, [])
  const getProductImgs = async id => {
    const products = await fetch(
      `/mvp/ai/product/${id}/photo`,
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
    setImgs(products.data)
  }
  const toPainting = current => {
    Router.push({
      pathname: '/createImage', 
      query: {
        hasMask: true,
        photoId: current.photoId,
        productId: productId,
      }
    })
  }
  const deleteImg = async (item, index) => {
    console.log(item)
    const result = await fetch(
      `/mvp/product/photo/${item.photoId}`,
      {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Cookies.get('token')
        }
      }
    ).then((response) => response.json());
    if(result.code === 401){
      Router.push({
        pathname: '/login', 
      })
    }
    console.log('删除图片结果', result)
    if(result.code === 401){
      Router.push({
        pathname: '/login', 
      })
    }
    if(result.code === 200){
      let imgsRes = imgs
      imgsRes.splice(index, 1)

      setImgs(imgsRes)
    }
  }
  const showSelectImg = () => {
    myInput.click()
    myInput.addEventListener('change', getFile, false)
  }
  const getFile = async e => {
    const resultArr = await e.target.files
    // uploadImg(e.target.files[0])
    var reader = new FileReader();
    console.log('拿到文件', imgs)
    for(let item of resultArr){
      console.log('size', item)
      reader.readAsDataURL(item);
      reader.onload = function (evt) {
          var replaceSrc = evt.target.result;
          var imageObj = new Image();
          imageObj.src = replaceSrc;
          imageObj.onload =  async () => {
            console.log(imageObj.width + imageObj.height);
            if(imageObj.width !== imageObj.height || imageObj.width < 1024 || imageObj.height < 1024){
              messageApi.open({
                type: 'error',
                content: 'Minimum 1024 x 1024, Square Size, JPG or PNG'
              });
            }else if((item.size / (1024 * 1024)) > 3){
              messageApi.open({
                type: 'error',
                content: 'The size of the uploaded image cannot exceed 3M'
              });
            } else {
              let url = await uploadImg(item)
              await addProductImg(url)
              await getProductImgs(productId)
            }
          };
      };
      
    }
    e.target.value = ''
    getProductImgs(productId)
  }
  const uploadImg = async (file) => {
    const data = new FormData()
    data.append('file', file, 'aa.jpg')
    const uploadImg = await fetch(
      "/mvp/ai/product/file",
      {
        method: "POST",
        headers: {
          'Authorization': Cookies.get('token')
        },
        body: data
      }
    ).then((response) => response.json());
    if(uploadImg.code === 401){
      Router.push({
        pathname: '/login', 
      })
    }
    return uploadImg.data.fileUrl
  }
  const addProductImg = async e => {
    let data = {
      photoUrl: e
    }
    const result = await fetch(
      `/mvp/product/${productId}/photo`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Cookies.get('token')
        },
        body: JSON.stringify(data)
      }
    ).then((response) => response.json());
    if(result.code === 401){
      Router.push({
        pathname: '/login', 
      })
    }
  }
  return (
    <div className='flex-col grow content-box mb-12'>
      {contextHolder}
      <div className='flex'>
        <div className='mb-4'>Select an image to start AI: </div>
        <div className='mb-4 ml-12 mr-4 underline cursor-pointer' onClick={() => showSelectImg()}> (or Upload New Photo) </div>
        <span>Minimum 1024 x 1024, Square Size, JPG or PNG</span>
      </div>
      <div className='flex'>
        {
          imgs ? imgs.map((item, index) => {
            return (
              <div key={index} className='flex mr-4 relative'  onMouseEnter={() => setShowControlIndex(index) } onMouseLeave={() => setShowControlIndex(-1)}>
                <img 
                  className='product-img-detail cursor-pointer' 
                  src={item.photoUrl} 
                />
                {
                  <div className={'flex absolute img-mask' + (showControlIndex === index ? '' : ' hidden')}>
                    <Button className='w-20' type="primary" onClick={() => toPainting(item)}>Select</Button>
                    <Button className='w-20 mt-2 remove-btn' onClick={() => deleteImg(item, index)}>Delete</Button>
                  </div>
                }
               
              </div>
            )
          }) : ''
        }
      </div>
     
      <input ref={(ref)=>{myInput = ref}} type="file" className='hidden' id="file_input" multiple />
    </div>
  )
}

export default function ProductImgs() {
  return <Index></Index>
}
