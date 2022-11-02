(function() {
    var video = document.getElementById('video');
    var vendorUrl = window.URL || window.webkitURL;
    navigator.getUserMedia({
        video: {
            width: 640,
            height: 480,
            frameRate: 30
        }
    }).then(function(stream) {
        video.src = vendorUrl.createObjectURL(stream);
        video.play();
    }).catch(function(err) {
    });
}) ();