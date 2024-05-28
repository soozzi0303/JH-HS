const video = document.querySelector('.player');
// HTML의 비디오 요소를 선택한다. 카메라의 실시간 영상을 표시함.
const canvas = document.querySelector('.photo');
// HTML의 캔버스 요소를 선택함. 사진을 넣기 위해 사용됨.
const ctx = canvas.getContext('2d');
// 캔버스의 2D 그리기 컨텍스트를 가져옴. 이는 캔버스에 그림을 그리기 위한 메소드와 속성을 포함.
const strip = document.querySelector('.strip');
// 사진이 저장될 div 요소를 선택함.
const snap = document.querySelector('.snap');
// 사진 찍을 때 재생될 오디오 요소를 선택함.

// Fix for iOS Safari from https://leemartin.dev/hello-webrtc-on-safari-11-e8bcb5335295
video.setAttribute('autoplay', '');
// autoplay: 비디오를 자동 재생합니다.
video.setAttribute('muted', '');
// muted: 비디오의 소리를 음소거합니다.
video.setAttribute('playsinline', '')
// playsinline: 비디오를 전체 화면이 아닌 인라인으로 재생합니다.

const constraints = {
    audio: false,
    video: {
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
        facingMode: { 
            ideal: "environment" 
        }
    }
  };

function getVideo() {
  navigator.mediaDevices.getUserMedia(constraints)
    .then(localMediaStream => {
      console.log(localMediaStream);
    
//  DEPRECIATION : 
//       The following has been depreceated by major browsers as of Chrome and Firefox.
//       video.src = window.URL.createObjectURL(localMediaStream);
//       Please refer to these:
//       Deprecated  - https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
//       Newer Syntax - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
      console.dir(video);
      if ('srcObject' in video) {
        video.srcObject = localMediaStream;
      } else {
        video.src = URL.createObjectURL(localMediaStream);
      }
      // video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err => {
      console.error(`OH NO!!!!`, err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take the pixels out
    // let pixels = ctx.getImageData(0, 0, width, height);
    // mess with them
    // pixels = redEffect(pixels);

    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.8;

    // pixels = greenScreen(pixels);
    // put them back
    // ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // played the sound
  snap.currentTime = 0;
  snap.play();

  // take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
