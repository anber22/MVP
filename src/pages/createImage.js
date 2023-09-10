import { Button, Steps } from 'antd';
import {ref, useState, useRef} from 'react';
import SegmentAnything from '@/components/segmentAnything';
import ControlNet from '@/components/controlNet';

function AA (){
  // const props = {actionType: 'line', step1}
  let [endResult, setEndResult] = useState()
  const [current, setCurrent] = useState(0);
  const onChange = (value) => {
    console.log('onChange:', value);
    setCurrent(value);
  };
  const description = 'This is a description.';
  const getComponent = () => {
    if(current === 0){
      return <SegmentAnything/>
    } else {
      return <ControlNet/>
    }
  }
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
            title: 'Step 1',
            description,
          },
          {
            title: 'Step 2',
            description,
          },
          {
            title: 'Step 3',
            description,
          },
        ]}
      />
      { getComponent() }
      <img className='relative result-img' ref={(ref)=> setEndResult(ref)}/>
    </div>
    
  )
}

export default function Home() {
  return <AA></AA>
}
