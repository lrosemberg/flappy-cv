window.addEventListener('load', function () {
  let model
  let lastValidClass

  const VALID_CLASSES = {
    'open-hands': 1,
    'close-hands': 1
  }

  const video = document.getElementById('video')
  const cameraMode = 'user'

  const startVideoStreamPromise = navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        facingMode: cameraMode
      }
    })
    .then(function (stream) {
      return new Promise(function (resolve) {
        video.srcObject = stream
        video.onloadeddata = function () {
          video.play()
          resolve()
        }
      })
    })

  const publishable_key = 'rf_pxexdAMNqIajRWhkdYplnip94zv1'
  const toLoad = {
    model: 'hand-state-detector',
    version: 3
  }

  const loadModelPromise = new Promise(function (resolve, reject) {
    roboflow
      .auth({
        publishable_key: publishable_key
      })
      .load(toLoad)
      .then(function (m) {
        model = m
        resolve()
      })
  })

  Promise.all([startVideoStreamPromise, loadModelPromise]).then(function () {
    detectFrame()
  })

  const detectFrame = function () {
    if (!model) return

    setInterval(() => {
      model
        .configure({
          threshold: 0.15
        })
        .detect(video)
        .then(function (predictions) {
          const predictionClass = predictions?.[0]?.class || null
          if (predictionClass in VALID_CLASSES && predictionClass !== lastValidClass) {
            lastValidClass = predictionClass
            window.board.fly()
          }
        })
        .catch(function (e) {
          console.log(e)
        })
    }, 300)
  }
})