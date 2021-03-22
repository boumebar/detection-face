const button1 = document.getElementById('button1')

var video = document.querySelector('video');

// Prefer camera resolution nearest to 1280x720.
var constraints = { audio: false, video: { width: 1280, height: 720 } };
const MODEL_URL = '/models'

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),

]).then(startVideo)

function startVideo() {
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (mediaStream) {
            video.srcObject = mediaStream;
            video.onloadedmetadata = function (e) {
                video.play();
            };
        })
        .catch(function (err) { console.log(err.name + ": " + err.message); });
}

function stopVideo() {
    const video = document.querySelector('video');

    // A video's MediaStream object is available through its srcObject attribute
    const mediaStream = video.srcObject;

    // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
    const tracks = mediaStream.getTracks();


    // Tracks are returned as an array, so if you know you only have one, you can stop it with: 
    tracks[0].stop();

}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizeDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizeDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizeDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizeDetections)
    }, 100)

})



button2.addEventListener('click', e => {
    stopVideo();
})