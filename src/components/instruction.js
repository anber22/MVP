import { Modal, Steps, Checkbox, Button } from 'antd';
import {ref, useState, useRef, useEffect} from 'react';
import Cookies from 'js-cookie';
export default function Instruction(data) {
  let [step, setStep] = useState(1)
  let textArray = [
    "Click BLACK dots on the product, then AI will remove the background.",
    "Describe the environment where you want to put your product.",
    "Choose the Demo Image that you like.",
    "Draw on the image to  mask the product to let AI replace it with your product."
  ]
  let endText = "Congrats! It's done. Just download the final images."
  useEffect(() => {
    if(data.index || data.index === 0 ){
      setStep(data.index)
    }
  }, [])
  let instructionText = () => {
    let text = ""
    if(step <= 3){
      text = textArray[step]
    }
    return text
  }
  let domChange = () => {
    if(step === 0){
      return (
        <div className='flex items-center mt-4 justify-center'>
          <img className='instruction-img' src="/product-dot.png" />
          <img className='right-arrow ml-12' src="/right-arrow.png" />
          <img className='instruction-img ml-12' src="/product-clean.png" />
        </div>
        
      )
    }else if(step === 1){
      return (
        <div className='flex items-center mt-4 justify-center'>
          <img className='product-text-img' src="/product-text-img.png" />
        </div>
      )
    } else if(step === 2){
      return (
        <div className='flex items-center mt-4 justify-center'>
          <img className='products-img' src="/products.png" />
        </div>
      )
    } else if(step === 3){
      return (
        <div className='flex items-center mt-4 justify-center'>
          <img className='instruction-img' src="/mj-img.png" />
          <img className='right-arrow ml-12' src="/right-arrow.png" />
          <img className='instruction-img ml-12' src="/mj-mask.png" />
        </div>
      )
    } else if(step === 4){
      return (
        <div className='flex items-center mt-12 text-2xl justify-center'>
          {endText}
        </div>
      )
    }
  }
  const close = () => {
    data.closeModal()
  }
  const changeStep = (num) => {
    setStep(step + num)
    
  }
  const checkboxChange = e => {
    Cookies.set('showInstruction', !e.target.checked);
  }
  return (
      <Modal width='1208px' 
        title={null}
        icon={null} 
        keyboard={true}
        centered = {true}
        maskClosable= {true}
        footer= {null} 
        open={true} 
        onCancel={close}
      >
        <div className='pt-8 pb-8'>
          <div className='w-full flex justify-center '>
            <div className='font-semibold text-2xl'>
              Instruction
            </div>
          </div>
          <Steps
            className='mt-8'
            size="small"
            current={step}
            onChange={e => {setStep(e)}}
            items={[
              {
                title: 'Product Selection',
              },
              {
                title: 'Describe your need',
              },
              {
                title: 'Choose Demo',
              },
              {
                title: 'Mask product',
              },
              {
                title: 'Done',
              }
            ]}
          />
          <span className='flex flex-col items-center justify-center'>
            <span className='flex flex-col items-start justify-start'>
              { step < 4 ? (  
                <span className='pt-10'>
                  {instructionText()}
                  <br/>
                  Example:
                </span>
              ) : '' }
            
              <span className='pt-4'> 
                
              </span>
              {domChange()}
            </span>
            
          </span>
        
          <div className='flex justify-center mt-12'>
            <Checkbox onChange={checkboxChange}>Do not show next time</Checkbox>
          </div>
          <div className='flex justify-center mt-6'>
            <Button className={`w-40 ${(step === 0 || step === 4) ? 'hidden' : ''}`} onClick={() =>changeStep(-1)} type="primary">Back</Button>
            <Button className={`w-40 ${step === 4 ? 'hidden' : 'ml-6'}`} type="primary" onClick={() => changeStep(1)}>Next</Button>
            <Button className={`w-40 ${step === 4 ? '' : 'hidden'}`} type="primary" onClick={() => close()}>Done</Button>
          </div>
        </div>
      </Modal>
  )
}