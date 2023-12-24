import { Select, Input, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Mj from '@/components/mj';
import {ref, useState, useRef, useEffect} from 'react';
import Canvas from '@/components/canvas';

export default function HasMask({imgs, masks, gotMjImg, backToPrevious, getPrompt}) {
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
  const createMjImgToImg = async () => {
    setLoading(true)
    await mj.imgToImg(imgs.photoUrl, options[position].label, description, getMjImg)
  }
  const getMjImg = e => {
     // console.log('拿到mj的图片', e)
    setLoading(false)

    gotMjImg(e)
    getPrompt(options[position].label + ' ' + description)
  }
  const back = () => {
    console.log('返回')
    backToPrevious()
  }
  return (
    <div className='flex content-box'>
      {/* <div className='w-80 flex flex-col'>
        <div className='flex h-10 items-center'>
          Your Image
        </div>
        <div className='flex w-full justify-start'>
          <img className='w-9/12 mt-6' src={imgs.photoUrl} />
        </div>
      </div> */}
      <div className='w-80 flex flex-col'>
        <div className='flex h-10 items-center'>
          Product Selected 
        </div>
        <img className='w-9/12 mt-6' src={imgs.maskShowUrl}/>
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
          <TextArea className='w-370 mt-4' onChange={e => setDescription(e.target.value)} rows={4} placeholder="a luxury marble coutertop kitchen island." maxLength={2000} />
        <div className='w-full flex mt-4'>
          <Button className='w-36' type="primary" onClick={() => {back()}}>Back</Button>
          <Button className='w-36 ml-6' type="primary" loading={loading} onClick={() => createMjImgToImg()}>Next</Button>
        </div>
      </div>
    </div>
  )
}