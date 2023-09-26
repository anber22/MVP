import { Button, Steps } from 'antd';
import {ref, useState, useRef} from 'react';
import SegmentAnything from '@/components/segmentAnything';
import ControlNet from '@/components/controlNet';

function AA (){
  // const props = {actionType: 'line', step1}
  let [endResult, setEndResult] = useState()
  const [current, setCurrent] = useState(0);
  let [fullMask, setFullMask] = useState('')
  const onChange = async (value) => {
    setCurrent(value);
  };
  const description = '';
  const getMask = (mask) => {
    setFullMask(mask)
    console.log('ControlNet拿到mask', fullMask)
  }
  // const getComponent = () => {
  //   console.log('fullMask', fullMask)
  //   if(current === 0){
  //     return <SegmentAnything getMask={getMask}/>
  //   } else {
  //     return <ControlNet fullMask={fullMask}/>
  //   }
  // }
  return (
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
        ]}
      />
      <div className={ current !== 0 ? 'hidden' : '' }>
        <SegmentAnything getMask={getMask}/>
      </div>
      <div className={ (current !== 1 ? 'hidden' : '') + ' relative' }>
        <ControlNet fullMask={fullMask}/>
      </div>
      {/* <img className='relative result-img' ref={(ref)=> setEndResult(ref)}/> */}
    </div>
    
  )
}

export default function Home() {
  return <AA></AA>
}
