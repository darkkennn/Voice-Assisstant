let headPhone = document.getElementById("headPhone");

    headPhone.onclick = (event) => {
        if(headPhone.classList.contains("pulse")) { 
            return headPhone.classList.remove("pulse");
        }
        return headPhone.classList.add('pulse');
    }

    let result = document.getElementById("result");

    result.onclick = async (event) => {
        if(headPhone.classList.contains("pulse")) { 
            headPhone.classList.remove("pulse");
            stopRecording(event);
        }
        return headPhone.classList.add('pulse');
    }

    let mediaRecorder;
    let chunks = [];

    async function startRecording() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) { 
                chunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            // Do nothing on stop for now
        };

        mediaRecorder.start();
    }

    function stopRecording() {
        console.log(mediaRecorder)
        console.log(mediaRecorder.state)
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
    }

    function processAudio() {
        if (chunks.length > 0) {
            const blob = new Blob(chunks, { type: 'audio/wav' });
            sendAudioToServer(blob);
            chunks = [];
        } else {
            alert('No audio data recorded.');
        }
    }
    function sendAudioToServer(blob) {
        const formData = new FormData();
        formData.append('audio', blob, 'recording.wav');

        fetch('http://127.0.0.1:3001/processAudio', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').innerHTML = 'Result: ' + data.result;
        }).catch((err) => {
            console.error(err);
        });
    }