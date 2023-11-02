import { Select, Input, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Mj from '@/components/mj';
import {ref, useState, useRef, useEffect} from 'react';
import Canvas from '@/components/canvas';

export default function HasMask({imgs, masks, gotMjImg}) {
  const { TextArea } = Input;
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
  const mj = new Mj()
  let [description, setDescription] = useState()
  let [position, setPosition] = useState()
  useEffect(() => {
     // console.log('进入hasmask', imgs, masks)
  }, [])
  const handleChange = e => {
     // console.log('eeee', e)
    setPosition(e)
  }
  const createMjImgToImg = () => {
    mj.imgToImg(imgs.photoUrl, options[position].label, description, getMjImg)
  }
  const getMjImg = e => {
     // console.log('拿到mj的图片', e)
    gotMjImg(e)
  }
  return (
    <div className='flex content-box'>
      <div className='w-80 flex flex-col'>
        <div className='flex h-10 items-center'>
          Your Image
        </div>
        <div className='flex w-full justify-start'>
          <img className='w-9/12' src={imgs.photoUrl} />
        </div>
      </div>
      <div className='w-80 flex flex-col'>
        <div className='flex h-10 items-start'>
          Product Selected 
          <Button className='w-16 ml-4' type="primary">Reset</Button>
        </div>
        <img className='w-9/12' src={imgs.maskShowUrl}/>
      </div>
      <div className='flex flex-col'>
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
          <TextArea className='w-370 mt-4' onChange={e => setDescription(e.target.value)} rows={4} placeholder="on a luxury marble coutertop kitchen island." maxLength={50} />
        <div className='w-full flex mt-4'>
          <Button className='w-36' type="primary">Black</Button>
          <Button className='w-36 ml-6' type="primary" onClick={() => createMjImgToImg()}>Next</Button>
        </div>
      </div>
    </div>
  )
}