import { Button, Slider } from 'antd';
import {ref, useState, useEffect, useRef} from 'react';
import Canvass from '@/components/canvas';
import fetchcc from 'node-fetch';
import axios from 'axios'
import Cookies from 'js-cookie';
export default function ControlNet({fullMask, segmentMask, mjImg, getSdImgs, prompt, imgs}) {
  const actionType = 'line'
  let myInput = null
  let [endResult, setEndResult] = useState()
  // let [controlNetImg, setControlNetImg] = useState('')
  let [controlNetImg, setControlNetImg] = useState('')
  let [loading, setLoading] = useState(false)
  let scaleDrawing = useRef()
  let [scaleState, setScaleState] = useState()
  useEffect( () => {
    setScaleState(scaleDrawing)
    // scaleState = scaleDrawing
    console.log('初始化', scaleDrawing, scaleState)
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
  const myElement = document.getElementById('scale-canvas');
  const scaleImg = async (img, adjust, isBlack) => {
    console.log('img', scaleState, scaleDrawing)
    let image = new Image();
    setScaleState(scaleDrawing)
    
    console.log('元素', document, myElement)
    let scaleContext = myElement.getContext('2d');
    console.log('scaleContext', scaleContext)
    let promise = new Promise((resolve)=>{
      image.onload = () => {
        console.log('onload', scaleState, scaleDrawing)
        myElement.width = image.width;
        myElement.height = image.height;
        if(isBlack){
          scaleContext.rect(0,0,image.width,image.height);
          scaleContext.fillStyle="black";
          scaleContext.fill();
        }
        
        scaleContext.drawImage(image, (adjust.endPointX / 300 * image.width) - (image.width * (adjust.scale.current / 100) / 2) , (adjust.endPointY / 300 * image.height) - (image.height * (adjust.scale.current / 100) / 2), image.width * (adjust.scale.current / 100), image.height * (adjust.scale.current / 100));
        resolve(myElement.toDataURL("image/png"));
      }
    })
    image.src = await urlToBase64(img);
    return promise
  }
  const step1 = async (img, mask, adjust) => {
    // await urlToBase64(mjImg.mjPhotoUrl)
    let res1 = await urlToBase64(segmentMask)
    let res2 = await urlToBase64(imgs.maskShowUrl)
    if(adjust){
      console.log(adjust)
      console.log('xxxx', scaleDrawing.current.getContext('2d'))
      // let img1 = await urlToBase64(segmentMask)
      res1 = await scaleImg(segmentMask, adjust, scaleDrawing)
      console.log('缩放结果', res1)
      let img2 = await urlToBase64(imgs.maskShowUrl)
      res2 = await scaleImg(imgs.maskShowUrl, adjust)
      console.log('缩放结果', res2)
    }
    
    let timer1 = null





    setLoading(true)
    let segmentMaskTemp = await urlToBase64(segmentMask)
    let data = {
        "alwayson_scripts": {
          "Extra options": {
              "args": []
          },
          "Refiner": {
              "args": [
                  false,
                  "",
                  0.8
              ]
          },
          "controlnet": {
            "args": [
              {
                  "batch_images": "",
                  "control_mode": "Balanced",
                  "enabled": true,
                  "guidance_end": 1,
                  "guidance_start": 0,
                  "input_image": res2,
                  "input_mode": "simple",
                  "is_ui": true,
                  "loopback": false,
                  "low_vram": false,
                  "model": "control_sd15_canny [fef5e48e]",
                  "module": "canny",
                  "output_dir": "",
                  "pixel_perfect": false,
                  "processor_res": 512,
                  "resize_mode": "Crop and Resize",
                  "threshold_a": 100,
                  "threshold_b": 200,
                  "weight": 1
              }
            ]
          },
          "Seed": {
              "args": [
                  -1,
                  false,
                  -1,
                  0,
                  0,
                  0
              ]
          }
        },
        "batch_size": 1,
        "cfg_scale": 7,
        "comments": {},
        "denoising_strength": 0.75,
        "disable_extra_networks": false,
        "do_not_save_grid": true,
        "do_not_save_samples": true,
        "height": 512,
        "image_cfg_scale": 1.5,
        "init_images": [
          await urlToBase64(mjImg.mjPhotoUrl)
        ],
        "mask": mask,
        "initial_noise_multiplier": 1,
        "inpaint_full_res": false,
        "inpaint_full_res_padding": 32,
        "inpainting_fill": 1,
        "inpainting_mask_invert": 0,
        "mask_blur": 4,
        "mask_blur_x": 4,
        "mask_blur_y": 4,
        "n_iter": 1,
        "negative_prompt": "",
        "override_settings": {
          "sd_model_checkpoint": "realisticVisionV51_v51VAE.safetensors [15012c538f]"
        },
        "override_settings_restore_afterwards": true,
        "prompt": "",
        "resize_mode": 0,
        "restore_faces": false,
        "s_churn": 0,
        "s_min_uncond": 0,
        "s_noise": 1,
        "s_tmax": null,
        "s_tmin": 0,
        "sampler_name": "DPM++ 2M Karras",
        "script_args": [],
        "seed": -1,
        "seed_enable_extras": true,
        "seed_resize_from_h": -1,
        "seed_resize_from_w": -1,
        "steps": 20,
        "styles": [],
        "subseed": -1,
        "subseed_strength": 0,
        "tiling": false,
        "width": 512
      }
      let result = await fetch(
        "/mvp/ai/product/photo/1/sd/img2img/control-net/1",{
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': Cookies.get('token')
          },
          body: JSON.stringify(data)
        }
      ).then((response) => response.json(), (rej) => {setLoading(false)});
      let lock = false
      if(timer1) clearInterval(timer1)
      timer1 = setInterval(async()=>{
        if(lock) return
        let result1 = await getResult(result.data.taskId);
        if(result1.code === 200 && result1.data.progressBar === 100 && !lock){
          lock = true
          clearInterval(timer1)
          console.log('首次进来', timer1)

          endResult.src = 'data:image/png;base64,' + result1.data.resultStr.images[0]
          // console.log('xxx', fullMask)
          let data2 =      {
            "alwayson_scripts": {
              "controlnet": {
                "args": [
                  {
                    "batch_images": "",
                    "control_mode": "Balanced",
                    "enabled": true,
                    "guidance_end": 1,
                    "guidance_start": 0,
                    "input_image": endResult.src,
                    "input_mode": "simple",
                    "is_ui": true,
                    "loopback": false,
                    "low_vram": false,
                    "model": "control_sd15_canny [fef5e48e]",
                    "module": "canny",
                    "output_dir": "",
                    "pixel_perfect": true,
                    "processor_res": 512,
                    "resize_mode": "Crop and Resize",
                    "threshold_a": 50,
                    "threshold_b": 200,
                    "weight": 1
                  }
                ]
              },
              "Refiner": {
                  "args": [
                      false,
                      "",
                      0.8
                  ]
              },
              "Seed": {
                "args": [
                    -1,
                    false,
                    -1,
                    0,
                    0,
                    0
                ]
              }
            },
            "batch_size": 4,
            "cfg_scale": 7,
            "denoising_strength": 0.75,
            "disable_extra_networks": false,
            "do_not_save_grid": false,
            "do_not_save_samples": false,
            "height": 1024,
            "image_cfg_scale": 1.5,
            "init_images": [
              res2
            ],
            "mask": res1,
            "initial_noise_multiplier": 1,
            "inpaint_full_res": 0,
            "inpaint_full_res_padding": 32,
            "inpainting_fill": 1,
            "inpainting_mask_invert": 1,
            "mask_blur": 0,
            "mask_blur_x": 0,
            "mask_blur_y": 0,
            "n_iter": 1,
            "negative_prompt": "(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, BadDream, UnrealisticDream",
            "override_settings": {
              "sd_model_checkpoint": "realisticVisionV51_v51VAE.safetensors [15012c538f]"
            },
            "override_settings_restore_afterwards": true,
            "prompt": prompt,
            "resize_mode": 0,
            "restore_faces": false,
            "s_churn": 0,
            "s_min_uncond": 0,
            "s_noise": 1,
            
            "s_tmin": 0,
            "sampler_name": "DPM++ SDE Karras",
            "seed": -1,
            "seed_enable_extras": true,
            "seed_resize_from_h": -1,
            "seed_resize_from_w": -1,
            "steps": 30,
            "subseed": -1,
            "subseed_strength": 0,
            "tiling": false,
            "width": 1024
          }
          let lock2 = false
         try {
           let result2 = await fetch(
             "/mvp/ai/product/photo/1/sd/img2img/control-net/2",{
               method: "POST",
               headers: {
                'Content-Type': 'application/json',
                'Authorization': Cookies.get('token')
               },
               body: JSON.stringify(data2)
             }
           ).then((response) => response.json(), (rej) => {setLoading(false)});
           lock2 = false
            timer1 = setInterval(async()=>{
              if(lock2) return
              let result3 = await getResult(result2.data.taskId);
              if(result3.code === 200 && result3.data.progressBar === 100 && !lock2){
                lock2 = true
                clearInterval(timer1)
                result3.data.resultStr.images = result3.data.resultStr.images.map(item => {
                  item = 'data:image/png;base64,' + item
                  return item
                })
                setLoading(false)
                  // console.log('抠图结果', result, result3.images)
                getSdImgs(result3.data.resultStr.images)
                clearInterval(timer1)
              }
            }, 10000)
         } catch (error) {
           setLoading(false)
         }
        }
      }, 10000)
  }
  const getResult = async (taskId) => {
    const result = await fetch(
      `/mvp/ai/product/photo/sd/task/${taskId}`,{
        method: "get",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Cookies.get('token')
        }
      }
    ).then((response) => response.json(), (rej) => {setLoading(false)});
    return result
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

      <Canvass actionType={actionType} step1={step1} picture={mjImg.mjPhotoUrl} loading={loading} productPic={ urlToBase64(fullMask) }/>
      <input ref={(ref)=>{myInput = ref}} type="file" className='hidden' id="file_input" />
      <div className='flex flex-col control-net-box mt-2'>
        {/* <Button className='select-img-btn mr-6' type="primary" onClick={() => selectImg()}>请选择图片</Button> */}
        <div className='flex mt-2 hidden'>
          {/* <img className='control-net-img' ref={controlNetImg} /> */}
          <img className='relative result-img ml-6' ref={(ref)=> setEndResult(ref)}/>
        </div>

      </div>
      <canvas id='scale-canvas' ref={scaleDrawing} >xxxxx</canvas>

    </div>
  )
}