import { Button, Slider } from 'antd';
import {ref, useState, useEffect, useRef} from 'react';
import Canvas from '@/components/canvas';

export default function ControlNet({fullMask, segmentMask, mjImg, getSdImgs, prompt}) {
  const actionType = 'line'
  let myInput = null
  let [endResult, setEndResult] = useState()
  // let [controlNetImg, setControlNetImg] = useState('')
  let [controlNetImg, setControlNetImg] = useState('')
  let [loading, setLoading] = useState(false)

  useEffect( () => {
    console.log('进入最后一步', fullMask, mjImg, segmentMask)
    console.log('ControlNet', prompt)
    urlToBase64(mjImg.mjPhotoUrl)
  }, [])
  const urlToBase64 = async (url) =>  {
    let file = ''
    await fetch('/img' + url.replace('https://aiproshots-image.s3.amazonaws.com', ''))
    .then((res) => {
      return res.blob();
    })
    .then(async (blob) => {
      let imgFile =await blobToBase64(blob);
      // setControlNetImg(imgFile)
      console.log('最终图片文件', imgFile, controlNetImg)
      file = imgFile
      // callback(imgFile);
    });
    return file
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
    // await urlToBase64(mjImg.mjPhotoUrl)
    setLoading(true)
    let segmentMaskTemp = await urlToBase64(segmentMask)
      let data = {
        "mask_blur": 0,
        "prompt": "",
        "negative_prompt": "",
        "img2img_inpaint_full_res_padding": 0,
        "mode": 2,
        "sampler_index": "Euler a",
        "override_settings": {
            "sd_model_checkpoint": "realisticVisionV51_v51VAE.safetensors [15012c538f]"
        },
        "override_settings_restore_afterwards": true,
        "init_images": [
          await urlToBase64(mjImg.mjPhotoUrl)
        ],
        "mask": mask,
        "sampler_name": "Euler",
        "width": 512,
        "height": 512,
        "alwayson_scripts": {
            "controlnet": {
                "args": [
                    {
                        "module": "canny",
                        "model": "control_sd15_canny [fef5e48e]",
                        "input_image": await urlToBase64(fullMask)
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
      ).then((response) => response.json(), (rej) => {setLoading(false)});
      endResult.src = 'data:image/png;base64,' + result.images[0]
       // console.log('xxx', fullMask)
      let data2 = {
        "mask_blur": 0,
        "prompt": prompt,
        "negative_prompt": "",
        "inpainting_mask_invert": 0,
        "mode": 4,
        "inpainting_fill": 1,
        "sampler_index": "Euler a",
        "sampling_steps": 30,
        "override_settings": {
          "sd_model_checkpoint": "realisticVisionV51_v51VAE.safetensors [15012c538f]"
        },
        "override_settings_restore_afterwards": true,
        "init_images": [
          await urlToBase64(fullMask)
        ],
        "mask": segmentMaskTemp,
        "sampler_name": "Euler",
        "width": 512,
        "height": 512,
        "alwayson_scripts": {
            "controlnet": {
                "args": [
                    {
                        "module": "canny",
                        "model": "control_sd15_canny [fef5e48e]",
                        "input_image": endResult.src
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
      ).then((response) => response.json(), (rej) => {setLoading(false)});
      result2.images = result2.images.map(item => {
        item = 'data:image/png;base64,' + item
        return item
      })
      setLoading(false)
       // console.log('抠图结果', result, result2.images)
      getSdImgs(result2.images)
    // console.log('执行第二步', img, mask)
   
  }
  const selectImg = () => {
    myInput.click()
    myInput.addEventListener('change', getFile, false)
  }
  const getFile = e => {
    console.log('getFile', e)
    controlNetImg = e
  }
  return (
    <div className='flex-col grow content-box mb-12'>
      <div>
        Mask the product to let AI replace it with your product.
      </div>
      <Canvas actionType={actionType} step1={step1} picture={mjImg.mjPhotoUrl} loading={loading} />
      <input ref={(ref)=>{myInput = ref}} type="file" className='hidden' id="file_input" />
      <div className='flex flex-col control-net-box mt-2'>
        {/* <Button className='select-img-btn mr-6' type="primary" onClick={() => selectImg()}>请选择图片</Button> */}
        <div className='flex mt-2 hidden'>
          {/* <img className='control-net-img' ref={controlNetImg} /> */}
          <img className='relative result-img ml-6' ref={(ref)=> setEndResult(ref)}/>
        </div>
      </div>
    </div>
  )
}