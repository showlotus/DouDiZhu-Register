import './style.css'
import html2canvas from 'html2canvas'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import Store, { RecordData } from './modules/Store'
import Card from './modules/Card'
import HistoryRecord from './modules/HistoryRecord'
import Input from './modules/Input'

const card = new Card()
const record = new HistoryRecord()
const store = new Store(card, record)
const input = new Input(store)
console.log(store)

setTimeout(() => {
  store.update(
    {
      A: 2,
    } as RecordData,
    'DA',
  )
}, 2000)

function genVideo(canvas: HTMLCanvasElement) {
  const ffmpeg = new FFmpeg()

  const captureFrame = (frameNumber: number) => {
    return new Promise<void>(resolve => {
      canvas.toBlob(async blob => {
        const data = await new Response(blob).arrayBuffer()
        ffmpeg.writeFile(`frame${frameNumber}.png`, new Uint8Array(data))
        resolve()
      }, 'image/png')
    })
  }

  const convertToVideo = async (frameCount: number) => {
    for (let i = 0; i < frameCount; i++) {
      await captureFrame(i)
    }

    await ffmpeg.exec([
      '-framerate',
      '30',
      '-i',
      'frame%d.png',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      'output.mp4',
    ])

    const videoData = await ffmpeg.readFile('output.mp4')
    const videoBlob = new Blob([videoData.buffer], { type: 'video/mp4' })
    const url = URL.createObjectURL(videoBlob)

    // 假设你想在页面上播放视频
    const videoElement = document.createElement('video')
    videoElement.src = url
    videoElement.controls = true
    document.body.appendChild(videoElement)
  }

  convertToVideo(30)
}

const load = async () => {
  const baseURL = 'https://unpkg.com/browse/@ffmpeg/core@0.12.6/dist/esm'
  const ffmpeg = new FFmpeg()
  ffmpeg.on('log', ({ message }) => {
    console.log(message)
  })
  // toBlobURL is used to bypass CORS issue, urls with the same
  // domain can be used directly.
  try {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })
  } catch (e) {
    console.log(e)
  }
  console.log(ffmpeg)
  return ffmpeg
}

false &&
  html2canvas(document.querySelector('.card-wrap')!, {
    backgroundColor: null,
    logging: false,
  }).then(canvas => {
    // const video = document.querySelector('video')!
    // video.width = 500
    // document.querySelector<HTMLDivElement>('#app')!.appendChild(video)
    // document.querySelector<HTMLDivElement>('#app')!.appendChild(canvas)
    // const stream = canvas.captureStream()
    // video.srcObject = stream
    // video.crossOrigin = 'anonymous'
    // video.src = 'https://storage.googleapis.com/media-session/sintel/trailer.mp4'
    // video.src = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm'
    // video.src = demoVideo
    // video.srcObject = stream
    // load().then(ffmpeg => {
    //   console.log(ffmpeg)
    // })
    // genVideo(canvas)
    // video.autoplay = !true
    // video.controls = false
    // video.playsInline = true
    // video.muted = true
    // video.setAttribute('webkit-playsinline', 'true')
    // video.play()
    // setInterval(() => {
    //   video.srcObject = stream
    //   console.log(canvas.captureStream())
    //   // video.play()
    // }, 2000)
    // const stream = canvas.captureStream()
    // console.log(stream)
    // const chunks = [] as Blob[]
    // const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
    // mediaRecorder.ondataavailable = e => {
    //   if (e.data.size > 0) {
    //     console.log(e)
    //     chunks.push(e.data)
    //   }
    // }
    // mediaRecorder.onstop = e => {
    //   const videoBlob = new Blob(chunks, { type: 'video/webm' })
    //   const url = URL.createObjectURL(videoBlob)
    //   const video = document.createElement('video')
    //   video.src = url
    //   document.body.appendChild(video)
    // }
    // setTimeout(() => {
    //   mediaRecorder.start()
    //   setTimeout(() => {
    //     mediaRecorder.stop()
    //   }, 1000)
    // }, 1000)
  })

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
