// noiseRemovalWorker.js

// 웹워커가 메인 스레드로부터 메시지를 받으면 실행될 함수
onmessage = function(event) {
    const imageData = event.data.imageData;
    const radius = event.data.radius;
    const filteredImageData = applyGaussianBlur(imageData, radius);
    postMessage(filteredImageData);
};

// 가우시안 블러 필터 적용 함수
function applyGaussianBlur(imageData, radius) {
    const pixels = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const tempCanvas = new OffscreenCanvas(width, height);
    const tempContext = tempCanvas.getContext('2d');
    tempContext.putImageData(imageData, 0, 0);
    tempContext.filter = `blur(${radius}px)`;
    tempContext.drawImage(tempCanvas, 0, 0);
    return tempContext.getImageData(0, 0, width, height);
}
