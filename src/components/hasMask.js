import { Select, Input, Button, Modal, Progress, Steps, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Mj from '@/components/mj';
import {ref, useState, useRef, useEffect} from 'react';
import Canvas from '@/components/canvas';
import Cookies from 'js-cookie';
import Router from "next/router"
import Instruction from '@/components/instruction.js'
export default function HasMask({imgs, masks, gotMjImg, backToPrevious, getPrompt, productId, photoId}) {
  const { TextArea } = Input;
  const [messageApi, contextHolder] = message.useMessage();
  let [showInstruction, setShowInstruction] = useState(false)
  let [loading, setLoading] = useState(false)
  let myInput = useRef()
  let [uploadImg, setUploadImg] = useState('')
  let [uploadLock, setUploadLock] = useState(false)
  const options = [
    {
      value: '0',
      label: 'on'
    },
    {
      value: '1',
      label: 'at'
    },
    {
      value: '2',
      label: 'in'
    },
    {
      value: '3',
      label: 'next to'
    },
    {
      value: '4',
      label: 'above'
    },
    {
      value: '5',
      label: 'below'
    }
  ]
  let [showLoading, setShowLoading] = useState(false)
  let loadingStep = useRef(0)
  let schedule = useRef(0)
  let [schedule1, setSchedule1] = useState(0)
  let [schedule2, setSchedule2] = useState(0)
  let [schedule3, setSchedule3] = useState(0)
  const mj = new Mj()
  let [description, setDescription] = useState('')
  let [productInfo, setProductInfo] = useState()
  let [position, setPosition] = useState()
  useEffect(() => {
    getProductInfo()
  }, [])
  const getProductInfo = async () => {
    const result = await fetch(
      `/mvp/ai/product/${productId}`,
      {
        method: "get",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Cookies.get('token')
        },
      }
    ).then((response) => response.json());
    if(result.code === 401){
      Router.push({
        pathname: '/login', 
      })
      return
    }else if(result.code === 200){
      setProductInfo(result.data)
    }
  }
  const handleChange = e => {
    setPosition(e)
  }
  const createMjImgToImg = async () => {
    setLoading(true)
    if(uploadImg !== ''){
      getMjImg([{'mjPhotoUrl': uploadImg}], true)
    }else{
      await imgToImg(imgs.photoUrl, options[position]?.label, description, getMjImg)
    }
  }
  const imgToImg = async (image, preposition, description, callBack) => {
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
        if(schedule.current > 100 && loadingStep.current === 0){
          clearInterval(loadingTimer1)
          schedule.current = 0
          loadingStep.current = 1
          let loadingTimer2 = setInterval(() => {
            if(loadingStep.current === 1){
              schedule.current = schedule.current + 10
            }
            if(schedule.current > 100 && loadingStep.current === 1){
              schedule.current = 0
              loadingStep.current = 2
              clearInterval(loadingTimer2)
              resolve()
            }else{
              setSchedule2(schedule.current)
            }
          }, 200);
        }else{
          setSchedule1(schedule.current)
        }
      }, 200)
    })
    await promise
  //   const result = await fetch(
  //    `/mvp/ai/product/photo/${1}/mj/img2img`,
  //    {
  //      method: "POST",
  //      headers: {
  //        'Content-Type': 'application/json',
  //        'Authorization': Cookies.get('token')
  //      },
  //      body: JSON.stringify({
  //        "description": `${productInfo.shapeDescription} ${preposition} ${description}`,
  //        "preposition": preposition,
  //        "pictureUrls": [
  //          image
  //        ]
  //      })
  //    }
  //  ).then((response) => response.json());
    // const result = await fetch(
    //   `/mvp/ai/product/photo/${photoId}/mj/text2img`,
    //   {
    //     method: "POST",
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': Cookies.get('token')
    //     },
    //     body: JSON.stringify({
    //       "description": `${description}`,
    //     })
    //   }
    // ).then((response) => response.json());
    const result = await fetch(
      `/mvp/ai/product/photo/${photoId}/sd/txt2img`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Cookies.get('token')
        },
        body: JSON.stringify({
          "batch_size": 4,
          "cfg_scale": 7,
          "comments": {},
          "denoising_strength": 0.7,
          "disable_extra_networks": false,
          "do_not_save_grid": false,
          "do_not_save_samples": false,
          "enable_hr": false,
          "height": 512,
          "hr_negative_prompt": "",
          "hr_prompt": "",
          "hr_resize_x": 0,
          "hr_resize_y": 0,
          "hr_scale": 2,
          "hr_second_pass_steps": 0,
          "hr_upscaler": "Latent",
          "n_iter": 1,
          "negative_prompt": "",
          "override_settings": {
              "sd_model_checkpoint": "moomooeCommerce_v4.safetensors [87e267a70b]"
          },
          "override_settings_restore_afterwards": true,
          "prompt": description,
          "restore_faces": false,
          "s_churn": 0,
          "s_min_uncond": 0,
          "s_noise": 1,
          "s_tmax": null,
          "s_tmin": 0,
          "sampler_name": "DPM++ 2M Karras",
          "script_args": [
      
      
          ],
          "script_name": null,
          "seed": -1,
          "seed_enable_extras": true,
          "seed_resize_from_h": -1,
          "seed_resize_from_w": -1,
          "steps": 20,
          "styles": [
      
      
          ],
          "subseed": -1,
          "subseed_strength": 0,
          "tiling": false,
          "width": 1024
      })
      }
    ).then((response) => response.json());
    if(result.code === 401){
      Router.push({
        pathname: '/login', 
      })
    }
    const timer = setInterval(async () => {
      const createResult = await fetch(
        `/mvp/ai/product/photo/sd/task/${result.data.taskId}`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': Cookies.get('token')
          }
        }
      ).then((response) => response.json());
      if(createResult.code === 401){
        Router.push({
          pathname: '/login', 
        })
      }
      schedule.current = createResult.data.progressBar
      setSchedule3(schedule.current)
      if(createResult.data.progressBar === 100){
        setTimeout(() => {
          setShowLoading(false)
        }, 1000);
      }
      if(createResult.data.resultstr === 1){
        callBack(createResult.data.resultstr.images)
        clearInterval(timer)
      }
    }, 3000);
  } 
  const getMjImg = (e, type) => {
    setLoading(false)
    gotMjImg(e, type)
    getPrompt(options[position]?.label + ' ' + description)
  }
  const back = () => {
    backToPrevious()
  }
  const closeModal = () => {
    setShowInstruction(false)
  }
  const getImg = () => {
    myInput.click()
    myInput.addEventListener('change', getFile, false)
  }
  const getFile = async e => {
    if(uploadLock) return
    var reader = new FileReader();
    if(e.target.files[0]){
      let img = e.target.files[0]
      reader.readAsDataURL(img);
      reader.onload = function (evt) {
        var replaceSrc = evt.target.result;
        var imageObj = new Image();
        imageObj.src = replaceSrc;
        imageObj.onload =  async () => {
          if(imageObj.width !== imageObj.height || imageObj.width < 1024 || imageObj.height < 1024){
            messageApi.open({
              type: 'error',
              content: 'Minimum 1024 x 1024, Square Size, JPG or PNG'
            });
          }else if((img.size / (1024 * 1024)) > 3){
            messageApi.open({
              type: 'error',
              content: 'The size of the uploaded image cannot exceed 3M'
            });
          } else {
            let result =  await uploadImgFun(img)
            setUploadImg(result)
          }
        };
      };
    }
    e.target.value = ''
  }
  const uploadImgFun = async (file) => {
    setUploadLock(true)
    const data = new FormData()
    data.append('file', file, 'aa.jpg')
    const uploadImg = await fetch(
      "/mvp/ai/product/file",
      {
        method: "POST",
        headers: {
          'Authorization': Cookies.get('token')
        },
        body: data
      }
    ).then((response) => response.json());
    if(uploadImg.code === 401){
      Router.push({
        pathname: '/login', 
      })
    }
    setUploadLock(false)
    return uploadImg.data.fileUrl
  }
  return (
    <div className='flex content-box'>
       {contextHolder}
      {/* <div className='w-80 flex flex-col'>
        <div className='flex h-10 items-center'>
          Your Image
        </div>
        <div className='flex w-full justify-start'>
          <img className='w-9/12 mt-6' src={imgs.photoUrl} />
        </div>
      </div> */}
      <div className='w-80 flex flex-col'>
        <div className='flex h-10 items-center'>
          Product Selected 
        </div>
        <img className='w-9/12' src={imgs.maskShowUrl}/>
      </div>
      <div className='flex flex-col'>
        <div className='flex h-10 items-center'>
          Describe the image background.
          <div className='w-36 help-btn ml-6 flex items-center justify-center' onClick={() => setShowInstruction(true)}>Help</div>
        </div>
        <Select
          className='mt-12 hidden'
          style={{
            width: 220,
          }}
          onChange={handleChange}
          options={options}
        />
        <TextArea className='w-370 mt-8' onChange={e => setDescription(e.target.value)} rows={7} placeholder="Example: Gradient Blue Background with Flowers" maxLength={2000} />
        <div className='w-full flex mt-6'>
          <Button className='w-36' type="primary" onClick={() => {back()}}>Back</Button>
          <Button className='w-36 ml-6' type="primary" loading={loading} onClick={() => createMjImgToImg()}>Next</Button>
        </div>
      </div>
      {
        uploadImg === '' ? (
          <div className='mj-upload-img ml-6' onClick={() => getImg()}>
              (Optional)
            <br/>
            Upload an image
            <br/>
            <p className='mt-4'>
              Minimum 1024 x 1024, Square Size
            </p>
            <div className='mt-7 flex justify-center' >
              <img className='upload-img' src="/upload.png" />
            </div>
          </div>
        ) : <img className='uploaded-img ml-6' src={uploadImg} onClick={() => getImg()}/>
      }
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
              <p className='mr-8 w-52 flex justify-end'>Process Requirements</p>
              <Progress strokeLinecap="butt" strokeColor={'#CAE9FF'} size={[400, 10]} percent={schedule1} />
            </div>
            <div className='flex flex-row flex-auto items-center ml-8'>
              <p className='mr-8 w-52 flex justify-end'>Initial Drafts</p>
              <Progress strokeLinecap="butt" strokeColor={'#5FA8D3'} size={[400, 10]} percent={schedule2} />
            </div>
            <div className='flex flex-row flex-auto items-center ml-8'> 
              <p className='mr-8 w-52 flex justify-end' >Generate Ideas</p>
              <Progress strokeLinecap="butt" strokeColor={'#3B73E8'} size={[400, 10]} percent={schedule3} />
            </div>
          </div>
        </div>
      </Modal>
      {
        showInstruction ? 
        (<Instruction index={1} closeModal={closeModal}></Instruction>)
         : 
        ""
      }
      <input ref={(ref)=>{myInput = ref}} type="file" className='hidden' id="file_input"/>
    </div>
  )
}