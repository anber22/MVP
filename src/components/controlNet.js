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
                  "input_image": await urlToBase64(fullMask),
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
      const result = await fetch(
        "/api/sdapi/v1/img2img",{
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        }
      ).then((response) => response.json(), (rej) => {setLoading(false)});
      endResult.src = 'data:image/png;base64,' + result.images[0]
       // console.log('xxx', fullMask)
      let data2 = 
      // {
      //   "mask_blur": 0,
      //   "prompt": prompt,
      //   "negative_prompt": "",
      //   "inpainting_mask_invert": 1,
      //   "mode": 4,
      //   "inpainting_fill": 1,
      //   "sampler_index": "Euler a",
      //   "sampling_steps": 30,
      //   "override_settings": {
      //     "sd_model_checkpoint": "realisticVisionV51_v51VAE.safetensors [15012c538f]"
      //   },
      //   "override_settings_restore_afterwards": true,
      //   "init_images": [
      //     await urlToBase64(fullMask)
      //   ],
      //   "mask": segmentMaskTemp,
      //   "sampler_name": "Euler",
      //   "width": 512,
      //   "height": 512,
      //   "alwayson_scripts": {
      //       "controlnet": {
      //           "args": [
      //             {
      //                 "module": "canny",
      //                 "model": "control_sd15_canny [fef5e48e]",
      //                 "input_image": endResult.src
      //             }
      //           ]
      //       }
      //   }
      // }
      {
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
        "batch_size": 1,
        "cfg_scale": 7,
        "denoising_strength": 0.75,
        "disable_extra_networks": false,
        "do_not_save_grid": false,
        "do_not_save_samples": false,
        "height": 1024,
        "image_cfg_scale": 1.5,
        "init_images": [
          await urlToBase64(fullMask)
        ],
        "mask": segmentMaskTemp,
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
      try {
        const result2 = await fetch(
          "/api/sdapi/v1/img2img",{
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              
            },
            credentials:'include',
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
      } catch (error) {
        setLoading(false)
      }
      
      
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
      <Canvas actionType={actionType} step1={step1} picture={mjImg.mjPhotoUrl} loading={loading} productPic={ urlToBase64(fullMask) }/>
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