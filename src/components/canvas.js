import { Button, Slider } from 'antd';
import {ref, useState, useEffect, useRef} from 'react';

function Canvas({typeIndex ,actionType, step1, picture, loading}) {
  let myInput = null
  let img = useRef()
  let [baseImg, setBaseImg] = useState()
  let [controlNetImg, setControlNetImg] = useState()
  let [mask, setMask] = useState()
  let lineWidth = useRef(20)

  let widthRate = 1
  let heightRate = 1
  let myDrawing = useRef()
  let myDrawingTemp = useRef()
  const selectImg = () => {
    myInput.click()
    myInput.addEventListener('change', getFile, false)
  }
  useEffect( () => {
    // selectImg()
    async function aa(){
       // console.log('Canvas获取文件', picture)
      if(picture){
        const res = await urlToBase64(picture)
         // console.log('初始化', res)
      }
    }
    setTimeout(() => {
      aa()
    }, 0);
  }, [])
  let context = null
  let painting = false;
  let lastPoint = null;
  let [points, setPoints] = useState([])
  const urlToBase64 = (url) =>  {
    fetch('/img' + url.replace('https://aiproshots-image.s3.amazonaws.com', ''))
    .then((res) => {
      return res.blob();
    })
    .then(async (blob) => {
      let imgFile =await blobToBase64(blob);
       // console.log('最终图片文件', imgFile)
      setTimeout(() => {
        getFile(imgFile)
      }, 0);
      // callback(imgFile);
    });
  }
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        resolve(e.target.result);
      };
      // readAsDataURL
      fileReader.readAsDataURL(blob);
      fileReader.onerror = () => {
        reject(new Error('blobToBase64 error'));
      };
    });
  }
//   const urlToBase64 = (url) => {
//     return new Promise ((resolve,reject) => {
//         let image = new Image();
//         image.onload = function() {
//             let canvas = document.createElement('canvas');
//             canvas.width = this.naturalWidth;
//             canvas.height = this.naturalHeight;
//             // 将图片插入画布并开始绘制
//             canvas.getContext('2d').drawImage(image, 0, 0);
//             // result
//             let result = canvas.toDataURL('image/png')
//             resolve(result);
//             setTimeout(() => {
//               getFile(result)
//             }, 0);
//         };
//         // CORS 策略，会存在跨域问题https://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror
//         image.setAttribute("crossOrigin",'Anonymous');
//         image.src = '/imgs' + url.replace('https://aiproshots-image.s3.amazonaws.com', '');
//         // 图片加载失败的错误处理
//         image.onerror = () => {
//             reject(new Error('转换失败'));
//         };
//     });
// }
  const getFile = e => {
     // console.log('xxxxxxx', myDrawing.current)
    context = myDrawing.current.getContext("2d");
    context.fillStyle = 'blue';
    context.strokeStyle = 'blue'
    context.fillRect(0, 0, myDrawing.current.width, myDrawing.current.height);
     // console.log('选择文件')

    myDrawing.current.onmousedown = (e) => {
      painting = true;
      const {x, y} = getXY(myDrawing.current, e)
      lastPoint = {'x': x,'y': y}
       // console.log('点击', lastPoint)
    }
    // 鼠标移动事件
    if(actionType === 'line'){
      myDrawing.current.onmousemove = (e) => {
        const {x, y} = getXY(myDrawing.current, e)
        if(!painting){return}
        let newPoint = {'x': x,'y': y};
        drawLine(lastPoint.x, lastPoint.y,newPoint.x, newPoint.y);
        lastPoint = newPoint;
      }
    }
    // 鼠标松开事件
    myDrawing.current.onmouseup = async () => {
      painting = false;
       // console.log('鼠标松开', actionType)
      // canvasDraw();
      if(actionType === 'dot') drawDot(lastPoint.x, lastPoint.y)
      else {
        await getMask()
         // console.log('鼠标松开', mask)
      }
    }
    // const fileReader = new FileReader()
    // fileReader.onload = (event) => {
      //  // console.log(event)
      let image = new Image();
      image.src = e;
      img.current.src = e;
      image.onload = e =>{
        const { width, height } = image;
         // console.log('图片宽高', width, height)
        let targetWidth = 0
        let targetHeight = 0
        if(height > 300){

          targetHeight = 300
          targetWidth = width / height * 300
          heightRate = height / 300
          widthRate = width / targetWidth
           // console.log('转换率1', heightRate)

        }else if(width > 500){
           // console.log('转换率2')

          targetWidth = 500
          targetHeight = height / width * 500
          heightRate = height / targetHeight
          widthRate = width / 500
        }else{
           // console.log('转换率3')
          targetWidth = width
          targetHeight = height
        }
         // console.log('转换率', widthRate, heightRate)
        img.current.style.width = targetWidth + 'px'
        img.current.style.height = targetHeight + 'px'
        // baseImg.style.width = targetWidth + 'px'
        // baseImg.style.height = targetHeight + 'px'
        myDrawing.current.width = targetWidth
        myDrawing.current.height = targetHeight
         // console.log('图片宽高2', img.current.style.width, img.current.style.height)
        // drawImg(image)
      }
       // console.log(img.current.style.width, img.current.style.height)
      // baseImg.src = event.target.result;
    // }
  }
  const lineWidthChange = (value) => {
    // setLineWidth(() => value)
    lineWidth.current = value
     // console.log('粗细', value, lineWidth.current)
  }
  const drawDot = (x, y) => {
     // console.log('画点', points)
    if(points.length === 5){
      return
    }
    let temp = points
    temp.push([x, y])
    setPoints(temp)
     // console.log('画点', points)
    context.beginPath()
    context.arc(x, y, 5, 0, Math.PI * 2);
    context.closePath()
    context.fillStyle = 'black';
    // 执行“填充”操作
    context.fill();
  }
  const getXY = (canvas, evt) =>{
    let style = window.getComputedStyle(canvas, null);
    //宽高
    let cssWidth = parseFloat(style["width"]);
    let cssHeight = parseFloat(style["height"]);
    //各个方向的边框长度
    let borderLeft = parseFloat(style["border-left-width"]);
    let borderTop = parseFloat(style["border-top-width"]);
    let paddingLeft = parseFloat(style["padding-left"]);
    let paddingTop = parseFloat(style["padding-top"]);
  
    let scaleX = canvas.width / cssWidth; // 水平方向的缩放因子
    let scaleY = canvas.height / cssHeight; // 垂直方向的缩放因子
  
    let x = evt.clientX;
    let y = evt.clientY;
    let rect = canvas.getBoundingClientRect();
    x -= (rect.left + borderLeft + paddingLeft); // 去除 borderLeft paddingLeft 后的坐标
    y -= (rect.top + borderTop + paddingTop); // 去除 borderLeft paddingLeft 后的坐标
  
    x *= scaleX; // 修正水平方向的坐标
    y *= scaleY; // 修正垂直方向的坐标
     // console.log('点坐标', {x,y})
    return {x,y}
  }
  const getPoints = () => {
    let temp = JSON.parse(JSON.stringify(points))
     // console.log('使用转换率', widthRate, heightRate)
    temp = temp.map(item => {
      item[0] = item[0] * widthRate
      item[1] = item[1] * heightRate
      return item
    })
    return temp
  }
  const getMask = async () => {
    var sourceImageData = myDrawing.current.toDataURL("image/png");
    var destCanvasContext = myDrawingTemp.current.getContext('2d');
    myDrawingTemp.current.width = myDrawing.current.width * widthRate
    myDrawingTemp.current.height = myDrawing.current.height * heightRate
     // console.log('最终结果宽高', heightRate, myDrawingTemp.current.width, myDrawingTemp.current.height)
    var destinationImage = new Image;
    destinationImage.onload = function(){
       // console.log('最终结果-绘制宽高')
      // destCanvasContext.fillStyle = 'black';
      // destCanvasContext.fillRect(0, 0, myDrawingTemp.width, myDrawingTemp.height);
      // destCanvasContext.fillStyle = 'red';
      destCanvasContext.drawImage(destinationImage,0,0, destinationImage.width * widthRate, destinationImage.height * heightRate);
       // console.log('最终结果', myDrawingTemp.current.toDataURL("image/png"), myDrawingTemp.current.width, myDrawingTemp.current.height)
      setMask(myDrawingTemp.current.toDataURL("image/png"))
       // console.log('最终结果-img', mask)

    };
    destinationImage.src = sourceImageData;
  }
  const drawLine = (x1, y1, x2, y2) => {
     // console.log('绘制线条', context)
    context.fillStyle = 'red';
    context.strokeStyle = 'rgba(255,255,255,1)';

    context.beginPath();
    context.lineWidth = lineWidth.current;
     // console.log('检查笔触', context.lineWidth, lineWidth.current)
    // 设置线条末端样式。
    context.lineCap = "round";

    // 设定线条与线条间接合处的样式
    context.lineJoin = "round";
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.stroke();
    context.closePath();
  }
  const clearDraw = () => {
    context = myDrawing.current.getContext("2d");
    if(points.length > 0){
      points.length = 0
    }
     // console.log(context)
    if(!context) return
    context.clearRect(0, 0, myDrawing.current.width, myDrawing.current.height);
    setMask(myDrawing.current.toDataURL("image/png"))
  }
  return (
    <div className='flex flex-col' >
    
      <div className='mt-6 canvas-box'>
        <input ref={(ref)=>{myInput = ref}} type="file" className='hidden' id="file_input" />
        <img ref={img} className='image' />
        <canvas ref={myDrawing} className='canvass absolute'>A drawing of something</canvas>
        <canvas ref={myDrawingTemp} className='hidden'></canvas>
      </div>
      { actionType === 'line' ?  
        <div className='line-width-slider mt-8'>
          {/* line width */}
          <Slider min={5} max={100} defaultValue={20} onChange={lineWidthChange} />
        </div>
        : ''
      }
        <div className={'flex ' + (actionType === 'line' ? 'mt-12' : 'mt-5')}>
          {/* <Button className='select-img-btn mr-6' type="primary" onClick={() => selectImg()}>请选择图片</Button> */}
          <Button className='select-img-btn mr-6' type="primary" onClick={() => clearDraw()}>Reset</Button>
          <Button className='select-img-btn mr-6' type="primary" loading={loading} onClick={() => step1(img.current.src, (actionType === 'dot' ? getPoints() : mask))}>Next</Button>
        </div>
    </div>
  )
}
export default function Paint({...props}){
  return <Canvas {...props}/>
}