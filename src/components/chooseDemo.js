import { Select, Input, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {ref, useState, useRef, useEffect} from 'react';
import Instruction from '@/components/instruction.js'
export default function ChooseDemo({imgs, chooseDemo, backToPrevious}) {
  let [showInstruction, setShowInstruction] = useState(false)
  useEffect(() => {
     // console.log('进入ChooseDemo', imgs)
  }, [imgs])
  const selectDemo = e => {
     // console.log('选择demo', e)
    chooseDemo(e)
  }
  const closeModal = () => {
    setShowInstruction(false)
  }
  return (
    <div className='flex content-box flex-col'>
      <div className='flex items-center'>
        Below are the DEMO images. Choose the one you like:
        <Button className='w-36 help-btn ml-6' type="primary" onClick={() => setShowInstruction(true)}>Help</Button>
      </div>
     
      <div className='mt-6'>
        {
          imgs ? imgs.map((item, index) => {
            return (
              <img className='w-44 mr-4 cursor-pointer' key={index} src={item.mjPhotoUrl} onClick={() => selectDemo(item)} />
            )
          }) : ''
        }
      </div>
      {
        showInstruction ? 
        (<Instruction index={2} closeModal={closeModal}></Instruction>)
         : 
        ""
      }
    </div>
  )
}