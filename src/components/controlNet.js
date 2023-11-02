import { Button, Slider } from 'antd';
import {ref, useState, useEffect} from 'react';
import Canvas from '@/components/canvas';

export default function ControlNet({fullMask, mjImg, getSdImgs}) {
  const actionType = 'line'
  let myInput = null
  let [endResult, setEndResult] = useState()
  let [controlNetImg, setControlNetImg] = useState()

  useEffect(() => {
     // console.log('进入最后一步', fullMask, mjImg)
  }, [])
  const urlToBase64 = (url) =>  {
    fetch('/img' + url.replace('https://aiproshots-image.s3.amazonaws.com', ''))
    .then((res) => {
      return res.blob();
    })
    .then(async (blob) => {
      let imgFile =await blobToBase64(blob);
       // console.log('最终图片文件', imgFile)
      setTimeout(() => {
        getFile(imgFile)
      }, 0);
      // callback(imgFile);
    });
  }
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        resolve(e.target.result);
      };
      // readAsDataURL
      fileReader.readAsDataURL(blob);
      fileReader.onerror = () => {
        reject(new Error('blobToBase64 error'));
      };
    });
  }
  const step1 = async (img, mask) => {
     // console.log('执行第二步', img, mask)
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
              "mask": urlToBase64(mjImg.mjPhotoUrl)
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
     // console.log('xxx', fullMask)
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
    result2.images = result2.images.map(item => {
      item = 'data:image/png;base64,' + item
      return item
    })
     // console.log('抠图结果', result, result2.images)
    getSdImgs(result2.images)
  }
  const selectImg = () => {
    myInput.click()
    myInput.addEventListener('change', getFile, false)
  }
  const getFile = e => {
    controlNetImg.src = e
  }
  return (
    <div className='flex-col grow content-box mb-12'>
      <div>
        Mask the product to let AI replace it with your product.
      </div>
      <Canvas actionType={actionType} step1={step1} picture={fullMask}/>
      <input ref={(ref)=>{myInput = ref}} type="file" className='hidden' id="file_input" />
      <div className='flex flex-col control-net-box mt-2'>
        {/* <Button className='select-img-btn mr-6' type="primary" onClick={() => selectImg()}>请选择图片</Button> */}
        <div className='flex mt-2 hidden'>
          <img className='control-net-img' ref={ref => {setControlNetImg(ref)}} />
          <img className='relative result-img ml-6' ref={(ref)=> setEndResult(ref)}/>
        </div>
      </div>
    </div>
  )
}