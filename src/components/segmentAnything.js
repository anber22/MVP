import { Button, Slider } from 'antd';
import {ref, useState, useRef} from 'react';
import Canvas from '@/components/canvas';

export default function SegmentAnything({getMask}) {
  const actionType = 'dot'
  let [endResult, setEndResult] = useState()
  console.log(getMask)
  const step1 = async (img, points) => {
    console.log('执行第一步', img, points)
    const reviewsResponse = await fetch(
      "api/sam/heartbeat"
    ).then((response) => response.json());
    console.log('服务状态', reviewsResponse) // {msg: "Success!"}
    const samModels = await fetch(
      "api/sam/sam-model"
    ).then((response) => response.json());
    console.log('sam模型列表', samModels)
    let data = {
      "sam_model_name": "sam_vit_b_01ec64.pth",
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }
    ).then((response) => response.json());
    console.log('抠图结果', result)
    endResult.src = 'data:image/png;base64,' + result.masks[1]
    getMasks(endResult.src)
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
          </div>
          <Canvas className='flex' actionType={actionType} step1={step1}/>
        </div>
        <div className='flex flex-col mt-12 ml-6'>
          <div>
            Example:
          </div>
          <img className='relative result-img mt-14' ref={(ref)=> setEndResult(ref)}/>
        </div>
      </div>
    </div>
  )
}