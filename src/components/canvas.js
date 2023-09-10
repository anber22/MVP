import { Button, Slider } from 'antd';
import {ref, useState, useRef} from 'react';

export default function Canvas({actionType, step1}) {
  let myInput = null
  let [img, setImg] = useState()
  let [baseImg, setBaseImg] = useState()
  let [mask, setMask] = useState()
  let lineWidth = 20
  
  let [myDrawing, setMyDrawing] = useState()
  const selectImg = () => {
    myInput.click()
    myInput.addEventListener('change', getFile, false)
  }
  let context = null
  let painting = false;
  let lastPoint = null;
  let points = []
  const getFile = e => {
    context = myDrawing.getContext("2d");
    context.fillStyle = 'rgba(255, 255, 255, 0)';
    context.strokeStyle = 'rgba(0,0,0,1)'
    context.fillRect(0, 0, myDrawing.width, myDrawing.height);
    myDrawing.onmousedown = (e) => {
      painting = true;
      const {x, y} = getXY(myDrawing, e)
      lastPoint = {'x': x,'y': y}
    }
    // 鼠标移动事件
    if(actionType === 'line'){
      myDrawing.onmousemove = (e) => {
        const {x, y} = getXY(myDrawing, e)
        if(!painting){return}
        let newPoint = {'x': x,'y': y};
        drawLine(lastPoint.x, lastPoint.y,newPoint.x, newPoint.y);
        lastPoint = newPoint;
      }
    }

    // 鼠标松开事件
    myDrawing.onmouseup = () => {
      painting = false;
      console.log('鼠标松开', actionType)
      // canvasDraw();
      if(actionType === 'dot') drawDot(lastPoint.x, lastPoint.y)
      mask.src = myDrawing.toDataURL("image/png")
    }
    const fileReader = new FileReader()
    fileReader.onload = (event) => {
      let image = new Image();
      image.src = event.target.result;
      img.src = event.target.result;
      image.onload = e =>{
        const { width, height } = image;
        console.log('图片宽高', width, height)
        let targetWidth = 0
        let targetHeight = 0
        if(height > 200){
          targetHeight = 200
          targetWidth = width / height * 200
        }else if(width > 300){
          targetWidth = 300
          targetHeight = height / width * 300
        }else{
          targetWidth = width
          targetHeight = height
        }
        
        img.style.width = targetWidth + 'px'
        img.style.height = targetHeight + 'px'
        baseImg.style.width = targetWidth + 'px'
        baseImg.style.height = targetHeight + 'px'

        myDrawing.width = targetWidth
        myDrawing.height = targetHeight
        console.log('图片宽高2', img.style.width, img.style.height)

        // drawImg(image)
      }
      
      console.log(img.style.width, img.style.height)
      baseImg.src = event.target.result;
    }
    fileReader.readAsDataURL(e.target.files[0])
  }
  const lineWidthChange = (value) => {
    lineWidth = value
    console.log('粗细', value, lineWidth)

  }
  const drawDot = (x, y) => {
    console.log('画点')
    points.push([x, y])
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
    
    return {x,y}
  }
  const drawLine = (x1, y1, x2, y2) => {
    context.beginPath();
    context.lineWidth = lineWidth;
    console.log('检查笔触', context.lineWidth, lineWidth)
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
    context.clearRect(0, 0, myDrawing.width, myDrawing.height);
    mask.src = myDrawing.toDataURL("image/png")
  }
  return (
    <div className='flex flex-col relative'>
      <div className='flex flex-col relative' >
        <div className='flex'>
          <Button className='select-img-btn mr-6' type="primary" onClick={() => selectImg()}>请选择图片</Button>
          <Button className='select-img-btn mr-6' type="primary" onClick={() => clearDraw()}>清除</Button>
          <Button className='select-img-btn mr-6' type="primary" onClick={() => step1(img.src, points)}>执行抠图</Button>
        </div>
        <div className='mt-2 float-left relative'>
          <input ref={(ref)=>{myInput = ref}} type="file" className='hidden' id="file_input" />
          <img ref={(ref)=>setImg(ref)} className='image absolute' />
          <canvas ref={(ref)=>setMyDrawing(ref)} className='canvass absolute'>A drawing of something</canvas>
        </div>
        { actionType === 'line' ?  
          <div className='line-width-slider'>
            调整笔触
            <Slider min={5} max={100} defaultValue={20} onChange={lineWidthChange} />
          </div>
          : ''
        }
        
      </div>
      <div className='absolute canvas-result-box'>
        <img className='relative' ref={(ref)=>setBaseImg(ref)}/>
        <img className='relative' ref={(ref)=>setMask(ref)}/>
      </div>
    </div>
  )
}