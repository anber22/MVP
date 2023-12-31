import Router from "next/router"
import Cookies from 'js-cookie';
export default class Mj{
  async imgToImg(image, preposition, description, callBack) {
     // console.log('mj参数', image, preposition, description)
    const result = await fetch(
      `/mvp/ai/product/photo/${1}/mj/img2img`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Cookies.get('token')
        },
        body: JSON.stringify({
          "description": description,
          "preposition": preposition,
          "pictureUrls": [
            image
          ]
        })
      }
    ).then((response) => response.json());
    if(result.code === 401){
      Router.push({
        pathname: '/login', 
      })
    }
     // console.log('mj生图结果', result)
    const timer = setInterval(async () => {
      const createResult = await fetch(
        `/mvp/ai/product/photo/mj/task/${result.data.taskId}`,
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
      if(createResult.data.taskStatus === 1){
        callBack(createResult.data.photos)
        clearInterval(timer)
      }
    }, 3000);
  } 
}