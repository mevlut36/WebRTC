// Description: Meeting Peer to peer with WebRTC
// How to :
// 1. Clique sur "Start live" pour créer une room et attends les données
// 2. Copie les données et colle les dans un autre navigateur / page dans le champs de droite puis appuyer sur "Join live"
// 3. Appuyer sur "Submit". vous devrez recevoir d'autres données dans cette page à gauche.
// 4. Copier ces données et les coller dans le navigateur / page principal et appuyer sur "Submit"

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

function bindEvents(p) {
    p.on('error', function (err) { console.log('error', err) })
    p.on('signal', function (data) {
        document.querySelector('#offer').textContent = JSON.stringify(data)
    })
    p.on('stream', function(stream) {
        let video = document.querySelector('#receiver-video')
        video.volume = 0
        video.srcObject = stream
        video.onloadedmetadata = function(e) {
            video.play()
        }
    })

    document.querySelector('#incoming').addEventListener('submit', function (e) {
        e.preventDefault()
        p.signal(JSON.parse(e.target.querySelector('textarea').value))
    })
}

function startPeer(initiator) {
    navigator.getUserMedia({
        audio: true,
        video: true
    }, function (stream) {
        let p = new SimplePeer({
            initiator: initiator,
            stream: stream,
            trickle: false
        })
        bindEvents(p)
        let emitterVideo = document.querySelector('#emitter-video')
        emitterVideo.volume = 0
        emitterVideo.srcObject = stream
        emitterVideo.onloadedmetadata = function(e) {
            emitterVideo.play()
        }
    }, function () {})
}

document.querySelector('#start').addEventListener('click', function (e) {
    startPeer(true)
})

document.querySelector('#receive').addEventListener('click', function (e) {
    startPeer(false)
})

