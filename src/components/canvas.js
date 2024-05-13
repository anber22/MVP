import { Button, Slider } from 'antd';
import {ref, useState, useEffect, useRef, use} from 'react';

function Canvas({typeIndex ,actionType, step1, picture, loading, productPic}) {
  let myInput = null
  let img = useRef()
  let [baseImg, setBaseImg] = useState()
  let [controlNetImg, setControlNetImg] = useState()
  let [mask, setMask] = useState()
  let lineWidth = useRef(20)
  let scale = useRef(100)

  let widthRate = useRef(1)
  let heightRate = useRef(1)
  let myDrawing = useRef()
  let myDrawingTop = useRef()
  let myDrawingTemp = useRef()
  let [startPoint, setStartPoint] = useState()
  let [endPointX, setEndPointX] = useState()
  let [endPointY, setEndPointY] = useState()
  // let isAdjust = useRef(false)
  let [isAdjust, setIsAdjust] = useState(false)
  const selectImg = () => {
    myInput.click()
    myInput.addEventListener('change', getFile, false)
  }
  let [destCanvasContext, setDestCanvasContext] = useState()
  useEffect( () => {
    // selectImg()
    async function aa(){
      if(picture){
        const res = await urlToBase64(picture)
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
      setTimeout(() => {
        getFile(imgFile)
      }, 0);
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
  const get_size = (base64) => {
    //确认处理的是png格式的数据
    if (base64.substring(0,22) === 'data:image/png;base64,') {
        // base64 是用四个字符来表示3个字节
        // 我们只需要截取base64前32个字符(不计开头那22个字符)便可（24 / 3 * 4）
        // 这里的data包含12个字符，9个字节，除去第1个字节，后面8个字节就是我们想要的宽度和高度
        const data = base64.substring(22 + 20, 22 + 32); 
        const base64Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        const nums = [];
        for (const c of data) {
            nums.push(base64Characters.indexOf(c));
        }
        const bytes = [];
        for(let i = 0; i < nums.length; i += 4) {
            bytes.push((nums[i] << 2) + (nums[i+1] >> 4));
            bytes.push(((nums[i+1] & 15) << 4) + (nums[i+2] >> 2));
            bytes.push(((nums[i+2] & 3) << 6) + nums[i+3]);
        }
        const width = (bytes[1] << 24) + (bytes[2] << 16) + (bytes[3] << 8) + bytes[4];
        const height = (bytes[5] << 24) + (bytes[6] << 16) + (bytes[7] << 8) + bytes[8];
        return {
            width,
            height,
        };
    }
    // throw Error('unsupported image type');
  }
  const getFile = e => {
    context = myDrawing.current.getContext("2d");
    context.fillStyle = 'blue';
    context.strokeStyle = 'blue'
    context.fillRect(0, 0, myDrawing.current.width, myDrawing.current.height);
    myDrawing.current.onmousedown = (e) => {
      painting = true;
      const {x, y} = getXY(myDrawing.current, e)
      lastPoint = {'x': x,'y': y}
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
      // canvasDraw();
      if(actionType === 'dot') drawDot(lastPoint.x, lastPoint.y)
      else {
        await getMask()
      }
    }
    // const fileReader = new FileReader()
    // fileReader.onload = (event) => {
      let image = new Image();
      image.src = e;
      img.current.src = e;
      image.onload = e =>{
        const { width, height } = image;
        let targetWidth = 0
        let targetHeight = 0
        if(height > 300){
          targetHeight = 300
          targetWidth = width / height * 300
          heightRate.current = height / 300
          widthRate.current = width / targetWidth
        }else if(width > 500){
          targetWidth = 500
          targetHeight = height / width * 500
          heightRate.current = height / targetHeight
          widthRate.current = width / 500
        }else{
          targetWidth = width
          targetHeight = height
        }
        img.current.style.width = targetWidth + 'px'
        img.current.style.height = targetHeight + 'px'
        // baseImg.style.width = targetWidth + 'px'
        // baseImg.style.height = targetHeight + 'px'
        myDrawing.current.width = targetWidth
        myDrawing.current.height = targetHeight
        // drawImg(image)
      }
      // baseImg.src = event.target.result;
    // }
  }
  const lineWidthChange = (value) => {
    // setLineWidth(() => value)
    lineWidth.current = value
  }
  const scaleChange = async (value) =>{
    scale.current = value
    let proImg = new Image;
    proImg.onload = function() {
      let size = myDrawing.current.width * (scale.current / 100)
      destCanvasContext.clearRect(0, 0, myDrawing.current.width, myDrawing.current.height);
      destCanvasContext.drawImage(proImg, endPointX || endPointX === 0 ? (endPointX - size / 2) : 0, endPointY || endPointY === 0 ? (endPointY - size / 2) : 0, size, size);
      destCanvasContext.globalAlpha = 0.6
    }
    proImg.src = await productPic
  }
  const drawDot = (x, y) => {
    if(points.length === 5){
      return
    }
    let temp = points
    temp.push([x, y])
    setPoints(temp)
    context.beginPath()
    context.arc(x, y, 5, 0, Math.PI * 2);
    context.closePath()
    context.drawImage = 'black';
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
    return {x,y}
  }
  const getPoints = () => {
    let temp = JSON.parse(JSON.stringify(points))
    temp = temp.map(item => {
      item[0] = item[0] * widthRate.current
      item[1] = item[1] * heightRate.current
      return item
    })
    return temp
  }
  const getMask = async () => {
    var sourceImageData = myDrawing.current.toDataURL("image/png");
    destCanvasContext = myDrawingTemp.current.getContext('2d');
    myDrawingTemp.current.width = myDrawing.current.width * widthRate.current
    myDrawingTemp.current.height = myDrawing.current.height * heightRate.current
    var destinationImage = new Image;
    destinationImage.onload = function(){
      // destCanvasContext.fillStyle = 'black';
      // destCanvasContext.fillRect(0, 0, myDrawingTemp.width, myDrawingTemp.height);
      // destCanvasContext.fillStyle = 'red';
      destCanvasContext.drawImage(destinationImage,0,0, destinationImage.width * widthRate.current, destinationImage.height * heightRate.current);
      setMask(myDrawingTemp.current.toDataURL("image/png"))
    };
    destinationImage.src = sourceImageData;
  }
  const drawLine = (x1, y1, x2, y2) => {
    context.fillStyle = 'red';
    context.strokeStyle = 'rgba(255,255,255,1)';
    context.beginPath();
    context.lineWidth = lineWidth.current;
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
    if(!context) return
    context.clearRect(0, 0, myDrawing.current.width, myDrawing.current.height);
    setMask(myDrawing.current.toDataURL("image/png"))
    
  }
  const adjustTarget = async () => {
    // isAdjust.current = true
    isAdjust = true

    setIsAdjust(true)
    scale.current = 100
    
    let proImg = new Image;
    setTimeout(async () => {
      destCanvasContext = myDrawingTop.current.getContext('2d')
      setDestCanvasContext(myDrawingTop.current.getContext('2d'))
      proImg.onload = function() {
        myDrawingTop.current.width = myDrawing.current.width
        myDrawingTop.current.height = myDrawing.current.height
        destCanvasContext.globalAlpha = 0.8
        destCanvasContext.drawImage(proImg, 0, 0, myDrawing.current.width, myDrawing.current.height);
        let imgWight = 300
        let imgHeight = 300
        myDrawingTop.current.onmousedown = (e) => {
          painting = true;
          const {x, y} = getXY(myDrawingTop.current, e)
          setStartPoint({'x': x,'y': y})
        }
        // 鼠标移动事件
        myDrawingTop.current.onmousemove = (e) => {
          const {x, y} = getXY(myDrawingTop.current, e)
          if(!painting){return}
          setEndPointX(x);
          setEndPointY(y);
          let size = myDrawing.current.width * (scale.current / 100)
          destCanvasContext.clearRect(0, 0, myDrawing.current.width, myDrawing.current.height);
          destCanvasContext.drawImage(proImg, x - size / 2, y - size / 2, size, size);
          destCanvasContext.globalAlpha = 0.6
        }
        // 鼠标松开事件
        myDrawingTop.current.onmouseup = async () => {
          painting = false;
         
          // if(startPoint.x < endPoint.x){
          //   let rate = 1 + ((endPoint.x - startPoint.x) / 300)
          //   imgWight = imgWight * rate
          //   imgHeight = imgHeight * rate
          //   destCanvasContext.clearRect(0, 0, myDrawing.current.width, myDrawing.current.height);
          //   if(imgWight >= myDrawing.current.width){
          //     destCanvasContext.drawImage(proImg, 0, 0, myDrawing.current.width, myDrawing.current.height);
          //   }else{
          //     destCanvasContext.drawImage(proImg, 0, 0, imgWight, imgHeight);
          //   }
          //   destCanvasContext.globalAlpha = 0.8
          // }else if(startPoint.x > endPoint.x){
          //   let rate = 1 - ((startPoint.x - endPoint.x) / 300)
          //   imgWight = imgWight * rate
          //   imgHeight = imgHeight * rate
          //   destCanvasContext.clearRect(0, 0, myDrawing.current.width, myDrawing.current.height);
          //   destCanvasContext.drawImage(proImg, 0, 0, imgWight, imgHeight);
          //   destCanvasContext.globalAlpha = 0.8
          // }
        }
      }
      proImg.src = await productPic
    }, 500);

  }
  const nextStep = async () =>{
    if((actionType === 'line' && !isAdjust)){
      adjustTarget()
    }else{
      if(actionType !== 'dot'){
        await getMask()
      }
      step1(img.current.src, (actionType === 'dot' ? getPoints() : mask), (isAdjust ? {scale, endPointX, endPointY} : false))
    }
  }

  return (
    <div className='flex flex-col' >
      { actionType === 'line' ?  
        <div className='flex'>
          {
            isAdjust ? (<div className='mt-8'>Scale Size</div>) :
            (<div className='mt-8'>Stroke Width</div>)
          }
          <div className='line-width-slider mt-8'>
            <Slider min={5} style={{display:( isAdjust ? '' : 'none')}} max={100} defaultValue={100} onChange={scaleChange} /> 
            <Slider min={5} style={{display:( !isAdjust ? '' : 'none')}} max={100} defaultValue={20} onChange={lineWidthChange} />
          </div>
        </div>
        
        : ''
      }
      <div className='mt-10 canvas-box'>
        <input ref={(ref)=>{myInput = ref}} type="file" className='hidden' id="file_input" />
        <img ref={img} className='image' />
        <canvas ref={myDrawing} className='canvass absolute'>A drawing of something</canvas>
        {
          isAdjust ? 
            <canvas ref={myDrawingTop} className='canvass-top absolute'>A drawing of something</canvas>
          : ""
        }
        <canvas ref={myDrawingTemp} className='hidden'></canvas>
      </div>
     
        <div className={'flex ' + (actionType === 'line' ? 'mt-12' : 'mt-5')}>
          {/* <Button className='select-img-btn mr-6' type="primary" onClick={() => selectImg()}>请选择图片</Button> */}
          <Button className='select-img-btn mr-6' type="primary" onClick={() => clearDraw()}>Reset</Button>
          {/* {
            actionType === 'line' ? 
            (<Button className='select-img-btn mr-6' type="primary" onClick={() => adjustTarget()}>Adjust</Button>)
            : ''
          } */}
          
          <Button className='select-img-btn mr-6' type="primary" loading={loading} onClick={() => nextStep()}>Next</Button>
        </div>
    </div>
  )
 
}
export default function Paint({...props}){
  return <Canvas {...props}/>
}