import { Input, Button, Form, message } from 'antd';
import {ref, useState, useRef} from 'react';
import { useCookies } from "react-cookie"
import Cookies from 'js-cookie';
import Router from "next/router"
export default function Canvas() {
  const [messageApi, contextHolder] = message.useMessage();
  const loginInfo = useRef()
  const [setCookie] = useCookies(["token"])
  let [loading, setLoading] = useState(false)
  const login = async (e) => {
    const loginRes = await loginInfo.current.validateFields()
    console.log('地址表单信息', loginRes)
    setLoading(true)
    if(loginRes.username){
      const result = await fetch(
        "/mvp/ai/user/login",
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginRes)
        }
      ).then((response) => response.json());
      if(result.code === 401){
        Router.push({
          pathname: '/login', 
        })
      }
      console.log('登录', result)
      setLoading(false)
      
      if(result.code === 200){
        Cookies.set('token', result.token);
        Router.push({
          pathname: '/', 
        })
      }else{
        console.log('登录失败')
        messageApi.open({
          type: 'error',
          content: result.msg,
        });
      }
    }
  }
  return (
    <div className='flex flex-col login-box' >
      {contextHolder}
      <section className='flex w-full bg-white items-center pl-12 login-header'>
        <img className='w-10 h-10 mr-2' src="/logo-white.png"/>
        AI ProShots
      </section>
      <section className='flex justify-between login-content'>
        <div className='text-white grow login-content-text mt-56 ml-20'>
          Your gateway to
          <br/>
          striking product photography
        </div>
        <div className='flex grow items-center'>
          <div className='login-form-box mr-20'>
            <div className='flex items-center justify-center font-semibold w-full h-20 mt-4'>
              Login
            </div>
            <div className='google-login'>
              Log in Using Google
            </div>
            <div className='login-use-email text-center mt-20'>
              Log in using email address
            </div>
            <Form
              ref={loginInfo}
              className='mt-4 ml-6'
              name="basic"
              labelCol={{
                span: 0,
              }}
              wrapperCol={{
                span: 24,
              }}
              style={{
                maxWidth: 900,
              }}
              initialValues={{
                remember: true,
              }}
              autoComplete="off"
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your username!',
                  },
                ]}
              >
                <Input className='login-input' size="large" placeholder="Basic usage" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              >
                <Input.Password  className='login-input' placeholder="input password" />
              </Form.Item>
            </Form>
            <div className='forgot-password mt-2 flex justify-end'>
              Forgot password?
            </div>
            <Button className='login-btn mt-6' type="primary" loading={loading} onClick={() => login()}>Log in</Button>
            <div className='login-use-email text-center mt-4'>
              Need to created an account?<span className='sign-up'> Sign Up</span>
            </div>
          </div>
        </div>
        
      </section>
    </div>
  )
}
