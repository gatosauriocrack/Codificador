function validarAcceso() {
    const pass = document.getElementById('passInput').value;
    if (pass === PROTOCOLO.access_key) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    } else {
        document.getElementById('passInput').style.borderColor = 'red';
        document.getElementById('passInput').value = '';
    }
}

document.getElementById('passInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') validarAcceso();
});

function actualizarNombre(input, spanId) {
    if (input.files && input.files[0]) {
        document.getElementById(spanId).innerText = input.files[0].name;
    }
}

function generar() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const imgFile = document.getElementById('baseImage').files[0];
    const customName = document.getElementById('fileName').value.trim() || "M3L1_EXPORT";
    if(!imgFile) return;
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-ES').replace(/\//g, '.');
    const hora = ahora.toLocaleTimeString('es-ES'); 
    const payload = `${PROTOCOLO.domain_default}|${fecha}|${hora}`.toUpperCase();
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width; 
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            for(let i = 0; i < payload.length; i++) {
                let val = PROTOCOLO.encoding.indexOf(payload[i]);
                if(val < 0) val = 40;
                let colorVal = Math.floor((val / 40) * 200);
                let {x, y} = getPos(i, canvas.width, canvas.height, payload.length);
                ctx.fillStyle = `rgb(${colorVal},${colorVal},${colorVal})`;
                ctx.fillRect(Math.floor(x), Math.floor(y), 4, 4);
            }
            const link = document.createElement('a');
            link.download = customName + '.png';
            link.href = canvas.toDataURL("image/png");
            link.click();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(imgFile);
}

function escanear() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const scanInput = document.getElementById('scanInput').files[0];
    if(!scanInput) return;
    const maxLen = 65; 
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width; 
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            let texto = "";
            for(let i = 0; i < maxLen; i++) {
                let {x, y} = getPos(i, canvas.width, canvas.height, maxLen);
                let p = ctx.getImageData(Math.floor(x) + 1, Math.floor(y) + 1, 1, 1).data;
                let promedio = (p[0] + p[1] + p[2]) / 3;
                let val = Math.round((promedio / 200) * 40);
                if(PROTOCOLO.encoding[val]) texto += PROTOCOLO.encoding[val];
            }
            document.getElementById('resultado').innerText = "DATA: " + texto;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(scanInput);
}
