import { Input, Button } from 'antd';
import {ref, useState, useRef} from 'react';

export default function Canvas() {

  return (
    <div className='flex flex-col login-box' >
      <div className='flex w-full bg-white items-center pl-12 login-header'>
        <img className='w-10 h-10 mr-2' src="/logo-white.png"/>
        AI ProShots
      </div>
      <div className='flex justify-between login-content'>
        <div className='text-white login-content-text mt-56 ml-20'>
          Your gateway to
          <br/>
          striking product photography
        </div>
        <div className='flex items-center'>
          <div className='login-form-box mr-20'>
            <div className='flex items-center justify-center text-2xl font-semibold w-full h-20 mt-4'>
              Login
            </div>
            <div className='google-login'>
              Log in Using Google
            </div>
            <div className='login-use-email text-center mt-20'>
              Log in using email address
            </div>
            <Input className='login-input mt-6' size="large" placeholder="Basic usage" />
            <Input.Password  className='login-input mt-6' placeholder="input password" />
            <div className='forgot-password mt-2 flex justify-end'>
              Forgot password?
            </div>
            <Button className='login-btn mt-6' type="primary">Log in</Button>
            <div className='login-use-email text-center mt-4'>
              Need to created an account?<span className='sign-up'> Sign Up</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}
