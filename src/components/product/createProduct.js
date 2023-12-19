import { Form, Input, Button, Select, Radio, Space, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {ref, useState, useRef, useEffect} from 'react';
import fs from 'fs';
import Router from "next/router"
import Cookies from 'js-cookie';
export default function ChooseDemo({backToList}) {
  let myInput = useRef()
  let states = [
      {
        "name": "Alabama",
        "abbreviation": "AL",
        "capital": "Montgomery",
        "largest_city": "Birmingham",
        "population": 4903185
      },
      {
        "name": "Alaska",
        "abbreviation": "AK",
        "capital": "Juneau",
        "largest_city": "Anchorage",
        "population": 731545
      },
      {
        "name": "Arizona",
        "abbreviation": "AZ",
        "capital": "Phoenix",
        "largest_city": "Phoenix",
        "population": 7278717
      },
      {
        "name": "Arkansas",
        "abbreviation": "AR",
        "capital": "Little Rock",
        "largest_city": "Little Rock",
        "population": 3017804
      },
      {
        "name": "California",
        "abbreviation": "CA",
        "capital": "Sacramento",
        "largest_city": "Los Angeles",
        "population": 39538223
      },
      {
        "name": "Colorado",
        "abbreviation": "CO",
        "capital": "Denver",
        "largest_city": "Denver",
        "population": 5773714
      },
      {
        "name": "Connecticut",
        "abbreviation": "CT",
        "capital": "Hartford",
        "largest_city": "Bridgeport",
        "population": 3605944
      },
      {
        "name": "Delaware",
        "abbreviation": "DE",
        "capital": "Dover",
        "largest_city": "Wilmington",
        "population": 989948
      },
      {
        "name": "Florida",
        "abbreviation": "FL",
        "capital": "Tallahassee",
        "largest_city": "Jacksonville",
        "population": 21538187
      },
      {
        "name": "Georgia",
        "abbreviation": "GA",
        "capital": "Atlanta",
        "largest_city": "Atlanta",
        "population": 10711908
      },
      {
        "name": "Hawaii",
        "abbreviation": "HI",
        "capital": "Honolulu",
        "largest_city": "Honolulu",
        "population": 1455271
      },
      {
        "name": "Idaho",
        "abbreviation": "ID",
        "capital": "Boise",
        "largest_city": "Boise",
        "population": 1839106
      },
      {
        "name": "Illinois",
        "abbreviation": "IL",
        "capital": "Springfield",
        "largest_city": "Chicago",
        "population": 12812508
      },
      {
        "name": "Indiana",
        "abbreviation": "IN",
        "capital": "Indianapolis",
        "largest_city": "Indianapolis",
        "population": 6785528
      },
      {
        "name": "Iowa",
        "abbreviation": "IA",
        "capital": "Des Moines",
        "largest_city": "Des Moines",
        "population": 3190369
      },
      {
        "name": "Kansas",
        "abbreviation": "KS",
        "capital": "Topeka",
        "largest_city": "Wichita",
        "population": 2937880
      },
      {
        "name": "Kentucky",
        "abbreviation": "KY",
        "capital": "Frankfort",
        "largest_city": "Louisville",
        "population": 4505836
      },
      {
        "name": "Louisiana",
        "abbreviation": "LA",
        "capital": "Baton Rouge",
        "largest_city": "New Orleans",
        "population": 4648794
      },
      {
        "name": "Maine",
        "abbreviation": "ME",
        "capital": "Augusta",
        "largest_city": "Portland",
        "population": 1362359
      },
      {
        "name": "Maryland",
        "abbreviation": "MD",
        "capital": "Annapolis",
        "largest_city": "Baltimore",
        "population": 6177224
      },
      {
        "name": "Massachusetts",
        "abbreviation": "MA",
        "capital": "Boston",
        "largest_city": "Boston",
        "population": 7029917
      },
      {
        "name": "Michigan",
        "abbreviation": "MI",
        "capital": "Lansing",
        "largest_city": "Detroit",
        "population": 10077331
      },
      {
        "name": "Minnesota",
        "abbreviation": "MN",
        "capital": "Saint Paul",
        "largest_city": "Minneapolis",
        "population": 5706494
      },
      {
        "name": "Mississippi",
        "abbreviation": "MS",
        "capital": "Jackson",
        "largest_city": "Jackson",
        "population": 2961279
      },
      {
        "name": "Missouri",
        "abbreviation": "MO",
        "capital": "Jefferson City",
        "largest_city": "Kansas City",
        "population": 6160281
      },
      {
        "name": "Montana",
        "abbreviation": "MT",
        "capital": "Helena",
        "largest_city": "Billings",
        "population": 1084225
      },
      {
        "name": "Nebraska",
        "abbreviation": "NE",
        "capital": "Lincoln",
        "largest_city": "Omaha",
        "population": 1961504
      },
      {
        "name": "Nevada",
        "abbreviation": "NV",
        "capital": "Carson City",
        "largest_city": "Las Vegas",
        "population": 3104614
      },
      {
        "name": "New Hampshire",
        "abbreviation": "NH",
        "capital": "Concord",
        "largest_city": "Manchester",
        "population": 1377529
      },
      {
        "name": "New Jersey",
        "abbreviation": "NJ",
        "capital": "Trenton",
        "largest_city": "Newark",
        "population": 9288994
      },
      {
        "name": "New Mexico",
        "abbreviation": "NM",
        "capital": "Santa Fe",
        "largest_city": "Albuquerque",
        "population": 2117522
      },
      {
        "name": "New York",
        "abbreviation": "NY",
        "capital": "Albany",
        "largest_city": "New York City",
        "population": 20201249
      },
      {
        "name": "North Carolina",
        "abbreviation": "NC",
        "capital": "Raleigh",
        "largest_city": "Charlotte",
        "population": 10439388
      },
      {
        "name": "North Dakota",
        "abbreviation": "ND",
        "capital": "Bismarck",
        "largest_city": "Fargo",
        "population": 779094
      },
      {
        "name": "Ohio",
        "abbreviation": "OH",
        "capital": "Columbus",
        "largest_city": "Columbus",
        "population": 11799448
      },
      {
        "name": "Oklahoma",
        "abbreviation": "OK",
        "capital": "Oklahoma City",
        "largest_city": "Oklahoma City",
        "population": 3959353
      },
      {
        "name": "Oregon",
        "abbreviation": "OR",
        "capital": "Salem",
        "largest_city": "Portland",
        "population": 4237256
      },
      {
        "name": "Pennsylvania",
        "abbreviation": "PA",
        "capital": "Harrisburg",
        "largest_city": "Philadelphia",
        "population": 13002700
      },
      {
        "name": "Rhode Island",
        "abbreviation": "RI",
        "capital": "Providence",
        "largest_city": "Providence",
        "population": 1097379
      },
      {
        "name": "South Carolina",
        "abbreviation": "SC",
        "capital": "Columbia",
        "largest_city": "Charleston",
        "population": 5118425
      },
      {
        "name": "South Dakota",
        "abbreviation": "SD",
        "capital": "Pierre",
        "largest_city": "Sioux Falls",
        "population": 886667
      },
      {
        "name": "Tennessee",
        "abbreviation": "TN",
        "capital": "Nashville",
        "largest_city": "Memphis",
        "population": 6910840
      },
      {
        "name": "Texas",
        "abbreviation": "TX",
        "capital": "Austin",
        "largest_city": "Houston",
        "population": 29145505
      },
      {
        "name": "Utah",
        "abbreviation": "UT",
        "capital": "Salt Lake City",
        "largest_city": "Salt Lake City",
        "population": 3271616
      },
      {
        "name": "Vermont",
        "abbreviation": "VT",
        "capital": "Montpelier",
        "largest_city": "Burlington",
        "population": 643077
      },
      {
        "name": "Virginia",
        "abbreviation": "VA",
        "capital": "Richmond",
        "largest_city": "Virginia Beach",
        "population": 8631393
      },
      {
        "name": "Washington",
        "abbreviation": "WA",
        "capital": "Olympia",
        "largest_city": "Seattle",
        "population": 7693612
      },
      {
        "name": "West Virginia",
        "abbreviation": "WV",
        "capital": "Charleston",
        "largest_city": "Charleston",
        "population": 1793716
      },
      {
        "name": "Wisconsin",
        "abbreviation": "WI",
        "capital": "Madison",
        "largest_city": "Milwaukee",
        "population": 5893718
      },
      {
        "name": "Wyoming",
        "abbreviation": "WY",
        "capital": "Cheyenne",
        "largest_city": "Cheyenne",
        "population": 576851
      }
  ]
  
  const { TextArea } = Input;
  states = states.map(item => {return {value: item.name, label: item.name}})
  console.log('50', states)
  let [selectImgType, setSelectImgType] = useState(1)
  let [selectImgs, setSelectImgs] = useState([])
  let images = []
  const [messageApi, contextHolder] = message.useMessage();
  let [loading, setLoading] = useState(false)
  const categoryChange = e => {
    console.log('类型切换', e)
  }
  const addressInfo = useRef({})

  const onFinish = async e => {
    let data = e
    setLoading(true)
    if(selectImgType === 1){
      data = {...data, isPost: 1, pictures: selectImgs}
      await createdProduct(data)
    }else {
      const addressRes = await addressInfo.current.validateFields()
      console.log('地址表单信息', addressRes)
      if(!addressRes.address){
        return
      }else{
        data = {...data, isPost: 2, postInfo: addressRes}
        await createdProduct(data)
      }
    }
    setLoading(false)

    console.log('提交表单', data)
  }
  const createdProduct = async (data) => {
    const result = await fetch(
      "/mvp/ai/product",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Cookies.get('token')
        },
        body: JSON.stringify(data)
      }
    ).then((response) => response.json());
    if(result.code === 401){
      Router.push({
        pathname: '/login', 
      })
    }
    console.log('新增图片结果', result)
    if(result.code === 200){
      console.log('新增商品成功', result)
      goBack(true)
    }
  }
  let [fileInit, setFileInit] = useState(false)
  const getImg = () => {
    myInput.click()
    if(!fileInit){
      myInput.addEventListener('change', getFile, false)
      setFileInit(true)
    }
  }
  const getFile = async e => {
    console.log('e.target.files[0]', e.target)
    for(let item of e.target.files){
      console.log('size', item.size / (1024 * 1024))
      if((item.size / (1024 * 1024)) > 3){
        messageApi.open({
          type: 'error',
          content: 'The size of the uploaded image cannot exceed 3M'
        });
      } else {
        const result = await uploadImg(item)
        
        console.log('拿到文件', images)

        images.push(result)
        
        selectImgs = images
        setSelectImgs(images)

        console.log('拿到文件', images, selectImgs)
      }
    }
    e.target.value = ''
  }
  const uploadImg = async (file) => {
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
    return uploadImg.data.fileUrl
  }
  const goBack = e => {
    backToList(e)
  }
  const changeType = e => {
    console.log('xxxx', e)
    setSelectImgType(e.target.value)
  }
  return (
    <div className='flex flex-col text-2xl'>
      {contextHolder}
      Create New Product
      <Form
        className='mt-12'
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 900,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Product Name"
          name="productName"
          rules={[
            {
              required: true,
              message: 'Please input your product name!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Brand Name"
          name="brandName"
          rules={[
            {
              required: true,
              message: 'Please input your brand name!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          label="Category"
          name="category"
          rules={[
            {
              required: true,
              message: 'Please select your category!',
            },
          ]}
        >
          <Select
            style={{
              width: 120,
            }}
            onChange={categoryChange}
            options={[
              {
                value: '0',
                label: 'Skin Care',
              }
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Appearance"
          name="shapeDescription"
          rules={[
            {
              required: true,
              message: 'Please input your shape description!',
            },
          ]}
        >
           <TextArea rows={3} placeholder="For example: A small brown glass bottle with gold cap" maxLength={150} />
        </Form.Item>
        <Form.Item label="Photos" >
          <div className='flex flex-col'>
            <div className='pt-2'>
              Would you like to upload your product photos or let 
              <br/>
              AIProShots team take photos for your product?
            </div>
            <Radio.Group className='mt-2' onChange={changeType} value={selectImgType}>
              <Space direction="vertical">
                <Radio value={1}>Upload my product photos (Faster)</Radio>
                <Radio value={2}>AIProShots team takes photos for me (Better Quality, 2-3 Weeks)</Radio>
              </Space>
            </Radio.Group>
          </div>
          {
            selectImgType === 1 ? (
              <div className='border-dashed address-info-box flex flex-col p-4 mt-2'>
                {
                  selectImgs ? selectImgs.map((item, index) => {
                    return <img className='product-img mr-4' key={index} src={item} />
                  }) : ''
                }
                You may upload multiple photos at once.
                <Button className='mt-4 w-20' type="primary" onClick={() => getImg()}>
                  Browse
                </Button>
              </div>
            ) : (
              <div className='border-dashed p-4 mt-2 address-info-box'>
                
                {`Don't have the perfect photo to upload?`}
                <br/>
                We will do it for you. Please fill out the form below to send your product to us.
                <Form
                  ref={addressInfo}
                  className='mt-2'
                  name="address"
                  labelCol={{
                    span: 7
                  }}
                  wrapperCol={{
                    span: 16,
                  }}
                  style={{
                    maxWidth: 600,
                  }}
                  initialValues={{
                    remember: true,
                  }}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Your Name"
                    name="addressee"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your name!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Mobile Phone"
                    name="mobilePhone"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your mobile phone!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Address"
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your address!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="City"
                    name="city"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your city!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="State"
                    name="state"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your state!',
                      },
                    ]}
                  >
                    <Select
                      style={{
                        width: 220,
                      }}
                      options={states}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Zip Code"
                    name="zipCode"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your zipCode!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  
                </Form>
              </div>
            )
          }
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button className='mr-6' type="primary" htmlType="button" onClick={() => goBack(false)}>
            Back
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Next
          </Button>
        </Form.Item>
      </Form>
      <input ref={(ref)=>{myInput = ref}} type="file" className='hidden' id="file_input" multiple/>
    </div>
  )
}
