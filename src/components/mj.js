export default class Mj{
  async imgToImg(image, preposition, description, callBack) {
     // console.log('mj参数', image, preposition, description)
    const result = await fetch(
      `/mvp/ai/product/photo/${1}/mj/img2img`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImE0OWIzNzlkLTQyN2UtNDRiMC04ZWE5LThiOWFjNDI4YTk3NiJ9.u1i4Z1OJl04Skfq_sL8v_u92MdKxt3xzU2mboF4XKSas7hGpBPXvxu6ZG41d2ZVc1YiNMUJn8gZcUhj_fzZLPw'
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
     // console.log('mj生图结果', result)
    const timer = setInterval(async () => {
      const createResult = await fetch(
        `/mvp/ai/product/photo/mj/task/${result.data.taskId}`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImE0OWIzNzlkLTQyN2UtNDRiMC04ZWE5LThiOWFjNDI4YTk3NiJ9.u1i4Z1OJl04Skfq_sL8v_u92MdKxt3xzU2mboF4XKSas7hGpBPXvxu6ZG41d2ZVc1YiNMUJn8gZcUhj_fzZLPw'
          }
        }
      ).then((response) => response.json());
      if(createResult.data.taskStatus === 1){
        callBack(createResult.data.photos)
        clearInterval(timer)
      }
    }, 3000);
  } 
}