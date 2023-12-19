import { Select, Input, Button , Popover } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {ref, useState, useRef} from 'react';
import Canvas from '@/components/canvas';
import Router from "next/router"
import Cookies from 'js-cookie';
export default function SegmentAnything({getMask, picture, photoId}) {
  const actionType = 'dot'
  let [endResult, setEndResult] = useState()
  const { TextArea } = Input;
  let [loading, setLoading] = useState(false)
  const options = [
    {
      value: '0',
      label: 'on'
    },
    {
      value: '1',
      label: 'at'
    },
    {
      value: '2',
      label: 'in'
    },
    {
      value: '3',
      label: 'next to'
    },
    {
      value: '4',
      label: 'above'
    },
    {
      value: '5',
      label: 'below'
    }
  ]
  const content = (
    <div>
      <p>Example:</p>
      <img className='logo-img' src='/logo-white.png'/>
    </div>
  );
  const step1 = async (img, points) => {
    setLoading(true)
    const reviewsResponse = await fetch(
      "api/sam/heartbeat"
    ).then((response) => response.json());
    const samModels = await fetch(
      "api/sam/sam-model"
    ).then((response) => response.json());
    let data = {
      "sam_model_name": samModels[0],
      "input_image": img,
      "sam_positive_points": points,
      "dino_enabled": false,
      "dino_model_name": "GroundingDINO_SwinT_OGC (694MB)",
      "dino_box_threshold": 0.3,
      "dino_preview_checkbox": false
    }
    const result = await fetch(
      "api/sam/sam-predict",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    ).then((response) => response.json(), (rej) => {setLoading(false)});
    setLoading(false)
    const controlMaskRes = await uploadImg(result.masks[1])
    const showMaskRes = await uploadImg(result.blended_images[2])
    submitMask(controlMaskRes, showMaskRes)
  }

  const dataURLtoBlob = (dataurl) => { 
    var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  //将blob转换为file
  const blobToFile = (theBlob, fileName) => {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }
  const submitMask = async (controlMaskRes, showMaskRes, mask) => {
    const data = {
      'maskControlUrl': controlMaskRes,
      'maskShowPhotoUrl': showMaskRes
    }
    const result = await fetch(
      `/mvp/product/photo/${photoId}/mask`,
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
    if(result.code === 200){
      getMasks(data)
    }
  }
  const uploadImg = async (mask) => {
    const data = new FormData()
    var blob = dataURLtoBlob('data:image/png;base64,' + mask);
    const file = blobToFile(blob, 'xxxx');
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
  const getMasks = e => {
    getMask(e)
  }
  return (
    <div className='flex flex-col content-box'>
      <div className='flex'>
        <div className='flex flex-col'>
          <div className='mb-4'>
            Help AI identify your product.
          </div>
          <div className='mb-4'>
            Left click to create 2 - 5 BLACK dots on your product.
            <Popover content={content} title="Tips">
              <QuestionCircleOutlined className='ml-4'/>
            </Popover>
          </div>
          <Canvas className='flex' actionType={actionType} step1={step1} picture={picture.photoUrl} loading={loading}/>
        </div>
        <div className='flex flex-col mt-12 ml-6'>
          {/* <img className='relative hidden result-img mt-14' ref={(ref)=> setEndResult(ref)}/>
          <div className='flex h-10 items-center'>
            I want to see my product
          </div>
          <Select
            className='mt-12'
            style={{
              width: 220,
            }}
            onChange={handleChange}
            options={options}
          />
          <TextArea className='w-370 mt-4' value={description} rows={4} placeholder="on a luxury marble coutertop kitchen island." maxLength={6} /> */}
          {/* <div className='w-full flex mt-4'>
            <Button className='w-36' type="primary">Black</Button>
            <Button className='w-36 ml-6' type="primary">Next</Button>
          </div> */}
        </div>
      </div>
    </div>
  )
}