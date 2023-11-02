import { Select, Input, Image } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {ref, useState, useRef, useEffect} from 'react';

export default function Done({imgs, chooseSdImg}) {
  const [sdImgs, setSdImgs] = useState('')
  useEffect(() => {
    //  // console.log('进入Done', imgs)
    setSdImgs(imgs())
  }, [imgs])
  const selectDemo = e => {
     // console.log('选择demo', e)
    chooseSdImg(e)
  }
  return (
    <div className='flex flex-col content-box'>
      <div>
        Done! See the images below:
      </div>
      <div className='flex mt-6'>
        {
          sdImgs ? sdImgs.map((item, index) => {
            return (
              // <img className='w-44 mr-4 cursor-pointer' key={index} src={item} onClick={() => selectDemo(item)} />
              <Image
                key="index"
                width={200}
                src={item}
              />
            )
          }) : ''
        }
      </div>
     
    </div>
  )
}