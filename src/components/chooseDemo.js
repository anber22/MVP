import { Select, Input, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {ref, useState, useRef, useEffect} from 'react';

export default function ChooseDemo({imgs, chooseDemo, backToPrevious}) {
  useEffect(() => {
     // console.log('进入ChooseDemo', imgs)
  }, [imgs])
  const selectDemo = e => {
     // console.log('选择demo', e)
    chooseDemo(e)
  }
  return (
    <div className='flex content-box flex-col'>
      Below are the DEMO images. Choose the one you like:
      <div className='mt-6'>
        {
          imgs ? imgs.map((item, index) => {
            return (
              <img className='w-44 mr-4 cursor-pointer' key={index} src={item.mjPhotoUrl} onClick={() => selectDemo(item)} />
            )
          }) : ''
        }
      </div>
    </div>
  )
}