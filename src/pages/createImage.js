import { Button, Steps } from 'antd';
import {ref, useState, useEffect} from 'react';
import SegmentAnything from '@/components/segmentAnything';
import HasMask from '@/components/hasMask';
import ChooseDemo from '@/components/chooseDemo';
import ControlNet from '@/components/controlNet';
import Done from '@/components/done';
import { useRouter } from 'next/router';

function AA (){
  // const props = {actionType: 'line', step1}
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
  const description = ''
  const onChange = async (value) => {
    setCurrent(value);
  };
  const router = useRouter();
  const {query} = router
  useEffect(() => {
    const { hasMask, photoId } = query;
     // console.log('进入组件', hasMask, photoId, router, query)
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
          'Authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImI0ZjE4YTY3LTFjZWMtNGU1My1hMDYyLWI3OWUwZDE3YmMwNCJ9.-Kwmpg96C9jGqqv9Vf0vC_aAcrV1IALdpzMkGmc5jcpovD3oVgGQWXzZBftTEBRFtf34iUlA5tnqAEHj-vx_cA'
        }
      }
    ).then((response) => response.json());
    setImgs(photos.data)
    if(photos && photos.data && photos.data.maskShowUrl) setCurrent(1)
    // setImgs(products.data)
     // console.log('获取商品列表', photos)
    setShowStatus(true)
  }
  const getMask = async (masks) => {
    const photos = await fetch(
      `/mvp/product/photo/${photoId}/mask`,
      {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImI0ZjE4YTY3LTFjZWMtNGU1My1hMDYyLWI3OWUwZDE3YmMwNCJ9.-Kwmpg96C9jGqqv9Vf0vC_aAcrV1IALdpzMkGmc5jcpovD3oVgGQWXzZBftTEBRFtf34iUlA5tnqAEHj-vx_cA'
        }
      }
    ).then((response) => response.json());
    setImgs(photos.data)
    setFullMask(masks)
    setMaskInfo(masks)
    setCurrent(1)
     // console.log('ControlNet拿到mask', fullMask)
  }
  const getMjNewImg = e => {
     // console.log('主页面获取mj图片', e)
    setMjImgs(e)
    setCurrent(2)
  }
  const selectMjImg = e => {
     // console.log('主页面监听到选中图片', e, maskInfo, imgs)
    setMjImg(e)
    setCurrent(3)
  }
  const getSdImgs = e => {
    setSdImgs(e)
     // console.log('拿到sd图片', e, sdImgs)
    setCurrent(4)
  }
  const doneGetSdImg = () => {
    return sdImgs
  }
  const chooseSdImg = e => {
    setSdImg(e)
  }
  // const getComponent = () => {
  //    // console.log('fullMask', fullMask)
  //   if(current === 0){
  //     return <SegmentAnything getMask={getMask}/>
  //   } else {
  //     return <ControlNet fullMask={fullMask}/>
  //   }
  // }
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
        <HasMask imgs={imgs} masks={maskInfo} gotMjImg={getMjNewImg}/>
      </div>
      <div className={ current !== 2 ? 'hidden' : '' }>
        <ChooseDemo imgs={mjImgs} chooseDemo={selectMjImg}/>
      </div>

      <div className={'relative' }>
        {(current !== 3 ? '' : <ControlNet fullMask={(imgs.photoUrl ? imgs.photoUrl : fullMask)} mjImg={mjImg}  getSdImgs={getSdImgs}/>)} 
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
