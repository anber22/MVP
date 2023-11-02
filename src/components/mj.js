export default class Mj{
  async imgToImg(image, preposition, description, callBack) {
     // console.log('mj参数', image, preposition, description)
    const result = await fetch(
      `/mvp/ai/product/photo/${1}/mj/img2img`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImI0ZjE4YTY3LTFjZWMtNGU1My1hMDYyLWI3OWUwZDE3YmMwNCJ9.-Kwmpg96C9jGqqv9Vf0vC_aAcrV1IALdpzMkGmc5jcpovD3oVgGQWXzZBftTEBRFtf34iUlA5tnqAEHj-vx_cA'
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
            'Authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImI0ZjE4YTY3LTFjZWMtNGU1My1hMDYyLWI3OWUwZDE3YmMwNCJ9.-Kwmpg96C9jGqqv9Vf0vC_aAcrV1IALdpzMkGmc5jcpovD3oVgGQWXzZBftTEBRFtf34iUlA5tnqAEHj-vx_cA'
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