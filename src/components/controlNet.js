import { Button, Slider, Modal, Progress } from 'antd';
import {ref, useState, useEffect, useRef} from 'react';
import Canvass from '@/components/canvas';
import fetchcc from 'node-fetch';
import axios from 'axios'
import Cookies from 'js-cookie';
import Instruction from '@/components/instruction.js'
export default function ControlNet({fullMask, segmentMask, mjImg, getSdImgs, prompt, imgs}) {
  const actionType = 'line'
  let myInput = null
  let [endResult, setEndResult] = useState()
  let [showInstruction, setShowInstruction] = useState(false)
  // let [controlNetImg, setControlNetImg] = useState('')
  let [controlNetImg, setControlNetImg] = useState('')
  let [loading, setLoading] = useState(false)
  let scaleDrawing = useRef()
  let [scaleState, setScaleState] = useState()
  let [openLoading, setOpenLoading] = useState(false)
  let [showLoading, setShowLoading] = useState(false)
  let loadingStep = useRef(0)
  let schedule = useRef(0)
  let [schedule1, setSchedule1] = useState(0)
  let [schedule2, setSchedule2] = useState(0)
  let [schedule3, setSchedule3] = useState(0)
  let timer1 = null

  useEffect( () => {
    setScaleState(scaleDrawing)
    // scaleState = scaleDrawing
    urlToBase64(mjImg.mjPhotoUrl)
    window.addEventListener("beforeunload",  (e) => {
      clearInterval(timer1)
    })
  }, [])
  
  const urlToBase64 = async (url) =>  {
    let file = ''
    await fetch('/img' + url.replace('https://aiproshots-image.s3.amazonaws.com', ''))
    .then((res) => {
      return res.blob();
    })
    .then(async (blob) => {
      let imgFile =await blobToBase64(blob);
      file = imgFile
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
        myElement.width = (image.width >= 1024 ? image.width : 1024);
        myElement.height = (image.height >= 1024 ? image.height : 1024);
        if(isBlack){
          scaleContext.rect(0,0,(image.width >= 1024 ? image.width : 1024), (image.height >= 1024 ? image.height : 1024));
          scaleContext.fillStyle="black";
          scaleContext.fill();
        }
        console.log('adjust', adjust)
        if(!adjust.endPointX){
          scaleContext.drawImage(image, 0, 0, image.width * (adjust.scale.current / 100), image.height * (adjust.scale.current / 100));
        }else{
          scaleContext.drawImage(image, (adjust.endPointX / 300 * image.width) - (image.width * (adjust.scale.current / 100) / 2) , (adjust.endPointY / 300 * image.height) - (image.height * (adjust.scale.current / 100) / 2), image.width * (adjust.scale.current / 100), image.height * (adjust.scale.current / 100));
        }
        resolve(myElement.toDataURL("image/png"));
      }
    })
    image.src = await urlToBase64(img);
    return promise
  }
  const step1 = async (img, mask, adjust) => {
    console.log('进入step')
    schedule.current = 0
    loadingStep.current = 0
    setSchedule1(schedule.current)
    setSchedule2(schedule.current)
    setSchedule3(schedule.current)
    setShowLoading(true)
    let promise = new Promise((resolve, reject) => {
       let loadingTimer1 = setInterval(() => {
        if(loadingStep.current === 0){
          schedule.current = schedule.current + 10
        }
        console.log('xxx', schedule.current > 100, loadingStep.current === 0)
        if(schedule.current > 100 && loadingStep.current === 0){
          schedule.current = 0
          loadingStep.current = 1
          console.log('结束')
          resolve()
          clearInterval(loadingTimer1)
        }else{
          setSchedule1(schedule.current)
        }
      }, 200);
    });
    await promise
    
    
    let res1 = await urlToBase64(segmentMask)
    let res2 = await urlToBase64(imgs.maskShowUrl)
    if(adjust){
      // let img1 = await urlToBase64(segmentMask)
      res1 = await scaleImg(segmentMask, adjust, scaleDrawing)
      let img2 = await urlToBase64(imgs.maskShowUrl)
      res2 = await scaleImg(imgs.maskShowUrl, adjust)
    }
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
                  "model": "control_v11p_sd15_canny [d14c016b]",
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
          "sd_model_checkpoint": "moomooeCommerce_v4.safetensors [87e267a70b]"
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
        "script_name": null,
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
        if(result1.code === 200){
          schedule.current = result1.data.progressBar
          setSchedule2(schedule.current)
        }
        if(result1.code === 200 && result1.data.progressBar === 100 && !lock){
          lock = true
          clearInterval(timer1)
          console.log('首次进来', timer1)
          schedule.current = 0
          loadingStep.current = 2
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
                    "model": "control_v11p_sd15_canny [d14c016b]",
                    "module": "canny",
                    "output_dir": "",
                    "pixel_perfect": true,
                    "processor_res": 1024,
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
            "batch_size": 2,
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
            "negative_prompt": "(depth of field:1.4),(bokeh:1.31),(blurry:1.4),(worst quality:1.4),(low quality:1.4),(monochrome:1.1),Sketch,ng_deepnegative_v1_75t,(nsfw:1.21),tattoo,(beard:1.3),(EasyNegative:1.3),badhandv4,(Teeth:1.3),(worst quality:2),(low quality:2),(normal quality:2),lowers,normal quality,facing away,looking away,text,error,extra digit,fewer digits,cropped,jpeg artifacts,signature,watermark,username,blurry,skin spots,acnes,skin blemishes,bad anatomy,fat,bad feet,cropped,poorly drawn hands,poorly drawn face,mutation,deformed,tilted head.bad anatomy.bad hands,extra fingers,fewer digits.,extra limbs.extra arms,extra legs,malformed limbs.fused fingers.,too many fingers,long neck,cross-eyed,mutated hands,bad body,bad proportions,gross proportions,text,error,missing fingers,missing arms,missing legs,extra digit,extra arms,extra leg,extra foot,missing fingers,",
            "override_settings": {
              "sd_model_checkpoint": "moomooeCommerce_v4.safetensors [87e267a70b]"
            },
            "override_settings_restore_afterwards": true,
            "prompt": prompt + ", Product Photography, Film Grain, (masterpiece:1.33),(bestquality:1.33),(ultra-detailed:1.21),studio photography,(realistic:1.21), <lora:MooMoo-Product Protography:1>,<lora:LCM-SD1.5:1>,([Wall wash lighting|Followspot lighting|front lighting|Backlighting|Glare-free lighting]),",
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
              if(result3.code === 200){
                schedule.current = result3.data.progressBar
                setSchedule3(schedule.current)
              }
              if(result3.code === 200 && result3.data.progressBar === 100 && !lock2){
                lock2 = true
                clearInterval(timer1)
                result3.data.resultStr.images = result3.data.resultStr.images.map(item => {
                  item = 'data:image/png;base64,' + item
                  return item
                })
                setLoading(false)
                getSdImgs(result3.data.resultStr.images)
                clearInterval(timer1)
              }
            }, 10000)
         } catch (error) {
           setLoading(false)
         }
        }
      }, 3000)
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
  const closeModal = () => {
    setShowInstruction(false)
  }
  return (
    <div className='flex-col grow content-box mb-12'>
      <div className='flex items-center'>
        Draw on the image to mask the product. AI will replace it with your product.
        <Button className='w-36 help-btn ml-6' type="primary" onClick={() => setShowInstruction(true)}>Help</Button>
      </div>

      <Canvass actionType={actionType} step1={step1} picture={mjImg.mjPhotoUrl} loading={loading} productPic={ urlToBase64(imgs.maskShowUrl) }/>
      <input ref={(ref)=>{myInput = ref}} type="file" className='hidden' id="file_input" />
      <div className='flex flex-col control-net-box mt-2'>
        {/* <Button className='select-img-btn mr-6' type="primary" onClick={() => selectImg()}>请选择图片</Button> */}
        <div className='flex mt-2 hidden'>
          {/* <img className='control-net-img' ref={controlNetImg} /> */}
          <img className='relative result-img ml-6' ref={(ref)=> setEndResult(ref)}/>
        </div>

      </div>
      <canvas id='scale-canvas' ref={scaleDrawing} className='hidden' >xxxxx</canvas>
      <Modal width='880px' 
        title={null}
        icon={null} 
        closeIcon={null}
        keyboard={true}
        centered = {true}
        maskClosable= {true}
        footer= {null} 
        open={showLoading} 
      >
        <div className='inline-block h-72'>
          <div className='progress-box flex'>
            <Progress className='progress-1' strokeLinecap="butt" strokeColor={'#3B73E8'} trailColor={'white'} type="circle" size={200} percent={schedule3} format={e => (loadingStep.current === 2) ? (e + '%') : ''} >
            </Progress>
            <Progress className='progress-2' strokeLinecap="butt" strokeColor={'#5FA8D3'} trailColor={'white'} type="circle"  size={180}  percent={schedule2} format={e => loadingStep.current === 1 ? (e + '%') : ''} >
            </Progress>
            <Progress className='progress-3' strokeLinecap="butt" strokeColor={'#CAE9FF'} trailColor={'white'} type="circle"  size={160}  percent={schedule1} format={e => loadingStep.current === 0 ? (e + '%') : '' } >
            </Progress>
          </div>
          <div className='line-box flex flex-col flex-1 h-44 mt-16 mx-6'>
            <div className='flex flex-row flex-auto items-center ml-8'>
              <p className='mr-8 w-52 flex justify-end'>Load Modules</p>
              <Progress strokeLinecap="butt" strokeColor={'#CAE9FF'} size={[400, 10]} percent={schedule1} />
            </div>
            <div className='flex flex-row flex-auto items-center ml-8'>
              <p className='mr-8 w-52 flex justify-end'>AI Drawing</p>
              <Progress strokeLinecap="butt" strokeColor={'#5FA8D3'} size={[400, 10]} percent={schedule2} />
            </div>
            <div className='flex flex-row flex-auto items-center ml-8'> 
              <p className='mr-8 w-52 flex justify-end' >Finalize Images</p>
              <Progress strokeLinecap="butt" strokeColor={'#3B73E8'} size={[400, 10]} percent={schedule3} />
            </div>
          </div>
        </div>
      </Modal>
      {
        showInstruction ? 
        (<Instruction index={3} closeModal={closeModal}></Instruction>)
         : 
        ""
      }
    </div>
  )
}