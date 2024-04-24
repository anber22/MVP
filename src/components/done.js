import { Select, Input, Image, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {ref, useState, useRef, useEffect} from 'react';
import Instruction from '@/components/instruction.js'
export default function Done({imgs, chooseSdImg}) {
  const [sdImgs, setSdImgs] = useState('')
  let [showInstruction, setShowInstruction] = useState(false)
  useEffect(() => {
    //  // console.log('进入Done', imgs)
    setSdImgs(imgs())
  }, [imgs])
  const selectDemo = e => {
     // console.log('选择demo', e)
    chooseSdImg(e)
  }
  const closeModal = () => {
    setShowInstruction(false)
  }
  return (
    <div className='flex flex-col content-box'>
      <div className='flex flex-row items-center'>
        <div>Done! See the images below:</div>
        <div className='w-36 help-btn ml-6 flex items-center justify-center' onClick={() => setShowInstruction(true)}>Help</div>
      </div>
      <div className='flex mt-6'>
        {
          sdImgs ? sdImgs.map((item, index) => {
            return (
              index === sdImgs.length - 1 ? '' :
              // <img className='w-44 mr-4 cursor-pointer' key={index} src={item} onClick={() => selectDemo(item)} />
             ( <Image
                key="index"
                width={200}
                src={item}
              />)
            )
          }) : ''
        }
      </div>
      {
        showInstruction ? 
        (<Instruction index={4} closeModal={closeModal}></Instruction>)
         : 
        ""
      }
    </div>
  )
}