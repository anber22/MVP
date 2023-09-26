import { Button, Slider } from 'antd';
import {ref, useState, useRef} from 'react';
import Canvas from '@/components/canvas';

export default function ControlNet({fullMask}) {
  const actionType = 'line'
  let myInput = null
  let [endResult, setEndResult] = useState()

  let [controlNetImg, setControlNetImg] = useState()
  const step1 = async (img, mask) => {
    console.log('执行第二步', img, mask)
    let data = {
      "init_images": [
        img
      ],
      "mask": mask,
      "sampler_name": "Euler",
      "width": 400,
      "height": 400,
      "alwayson_scripts": {
        "controlnet": {
          "args": [
            {
              "module": "",
              "model": "",
              "mask": controlNetImg.src
            }
          ]
        }
      }
    }
    const result = await fetch(
      "api/sdapi/v1/img2img",{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }
    ).then((response) => response.json());
    endResult.src = 'data:image/png;base64,' + result.images[0]
    console.log('xxx', fullMask)
    let data2 = {
        "init_images": [
          img
        ],
        "mask": fullMask,
        "prompt": "Pink background and flower",
        "sampler_name": "Euler",
        "width": 512,
        "height": 512,
        "alwayson_scripts": {
            "controlnet": {
                "args": [
                    {
                        "module": "",
                        "model": "",
                        "mask": endResult.src
                    }
                ]
            }
        }
    }
    const result2 = await fetch(
      "api/sdapi/v1/img2img",{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data2)
      }
    ).then((response) => response.json());
    console.log('抠图结果', result, result2)
  }
  const selectImg = () => {
    myInput.click()
    myInput.addEventListener('change', getFile, false)
  }
  const getFile = e => {
    const fileReader = new FileReader()
    fileReader.onload = (event) => {
      console.log('选中图片', event)
      controlNetImg.src = event.target.result;
    }
    fileReader.readAsDataURL(e.target.files[0])
  }
  return (
    <div className='flex-col grow content-box mb-12'>
      <Canvas actionType={actionType} step1={step1}/>
      <input ref={(ref)=>{myInput = ref}} type="file" className='hidden' id="file_input" />
      <div className='flex flex-col control-net-box mt-2'>
        <Button className='select-img-btn mr-6' type="primary" onClick={() => selectImg()}>请选择图片</Button>
        <div className='flex mt-2'>
          <img className='control-net-img' ref={ref => {setControlNetImg(ref)}} />
          <img className='relative result-img ml-6' ref={(ref)=> setEndResult(ref)}/>
        </div>
      </div>

    </div>
  )
}