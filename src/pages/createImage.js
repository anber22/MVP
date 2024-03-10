import { Button, Steps } from 'antd';
import {ref, useState, useEffect} from 'react';
import SegmentAnything from '@/components/segmentAnything';
import HasMask from '@/components/hasMask';
import ChooseDemo from '@/components/chooseDemo';
import ControlNet from '@/components/controlNet';
import Done from '@/components/done';
import { useRouter } from 'next/router';
import Router from "next/router"
import Cookies from 'js-cookie';
function AA (){
  let [endResult, setEndResult] = useState()
  const [current, setCurrent] = useState(0);
  let [fullMask, setFullMask] = useState('')
  let [maskInfo, setMaskInfo] = useState({})
  let [segmentMask, setSegmentMask] = useState('')
  let [imgs, setImgs] = useState('')
  let [mjImgs, setMjImgs] = useState('')
  let [mjImg, setMjImg] = useState('')
  let [sdImgs, setSdImgs] = useState('')
  let [sdImg, setSdImg] = useState('')
  let [photoId, setPhotoId] = useState()
  let [showStatus, setShowStatus] = useState(false)
  let [prompt, setPrompt] = useState('')
  const description = ''
  const onChange = async (value) => {
    // 仅可以回退
    if(current > value) setCurrent(value);
  };
  const router = useRouter();
  const {query} = router
  useEffect(() => {
    const { hasMask, photoId } = query;
    if(photoId){
      setPhotoId(photoId)
      getPhotoMask(photoId) 
    }
  }, [router.query])
  const getPhotoMask = async id => {
    setShowStatus(false)
    const photos = await fetch(
      `/mvp/product/photo/${id}/mask`,
      {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Cookies.get('token')
        }
      }
    ).then((response) => response.json());
    if(photos.code === 401){
      Router.push({
        pathname: '/login', 
      })
    }
    setImgs(photos.data)
    if(photos && photos.data && photos.data.maskShowUrl) setCurrent(1)
    setShowStatus(true)
  }
  const getMask = async (masks) => {
    console.log('xxx', masks)
    const photos = await fetch(
      `/mvp/product/photo/${photoId}/mask`,
      {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Cookies.get('token')
        }
      }
    ).then((response) => response.json());
    if(photos.code === 401){
      Router.push({
        pathname: '/login', 
      })
    }
    setImgs(photos.data)
    setFullMask(masks)
    setMaskInfo(masks)
    setCurrent(1)
  }
  const getMjNewImg = e => {
    setMjImgs(e)
    setCurrent(2)
  }
  const selectMjImg = e => {
    setMjImg(e)
    setCurrent(3)
  }
  const getSdImgs = e => {
    setSdImgs(e)
    setCurrent(4)
  }
  const doneGetSdImg = () => {
    return sdImgs
  }
  const chooseSdImg = e => {
    setSdImg(e)
  }
  const backToPrevious = () => {
    setCurrent(current - 1)
  }
  return (
    showStatus ? (
    <div className='flex-grow overflow-y-auto'>
      <div className='flex justify-between mb-2'>
        My Product
      </div>
      <Steps
        className='mt-6 mb-6'
        current={current}
        onChange={onChange}
        items={[
          {
            title: 'Product Selection',
            description,
          },
          {
            title: 'Describe your need',
            description,
          },
          {
            title: 'Choose Demo',
            description,
          },
          {
            title: 'Mask product',
            description
          },
          {
            title: 'Done',
            description
          }
        ]}
      />
      <div className={ current !== 0 ? 'hidden' : '' }>
        <SegmentAnything getMask={getMask} picture={imgs} photoId={photoId}/>
      </div>
      <div className={ current !== 1 ? 'hidden' : '' }>
        <HasMask imgs={imgs} masks={maskInfo} gotMjImg={getMjNewImg} backToPrevious={() => backToPrevious()} getPrompt={e => {setPrompt(e)}}/>
      </div>
      <div className={ current !== 2 ? 'hidden' : '' }>
        <ChooseDemo imgs={mjImgs} chooseDemo={selectMjImg}/>
      </div>

      <div className={'relative' }>
        {(current !== 3 ? '' : <ControlNet fullMask={(imgs.photoUrl ? imgs.photoUrl : fullMask)} segmentMask={imgs.maskControlUrl ? imgs.maskControlUrl : fullMask} mjImg={mjImg}  getSdImgs={getSdImgs} prompt={prompt} imgs={imgs}/>)} 
      </div>
      <div className={'relative' }>
        {(current !== 4 ? '' : <Done imgs={doneGetSdImg} chooseSdImg={chooseSdImg}/>)} 
      </div>
      
      {/* <img className='relative result-img' ref={(ref)=> setEndResult(ref)}/> */}
    </div>) : ''
    
  )
}
AA.getInitialProps = async ({ query }) => {
  return { query }
}
export default function Home() {
  return <AA></AA>
}
