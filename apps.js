document.addEventListener('DOMContentLoaded', function () {
    const upload = document.getElementById('upload');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const processButton = document.getElementById('process');
    const operationSelect = document.getElementById('operation');
    let originalImageData = null;

    // Load gambar dan tampilkan pada canvas
    upload.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Proses gambar sesuai pilihan operasi
    processButton.addEventListener('click', function () {
        if (!originalImageData) return;

        const op = operationSelect.value;
        switch (op) {
            case 'translate':
            case 'scale':
            case 'rotate':
            case 'flipH':
            case 'flipV':
                geometricTransform(op);
                break;
            default:
                return;
        }
    });

    // Fungsi transformasi geometris
    function geometricTransform(type) {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = canvas.width;
        offCanvas.height = canvas.height;
        const offCtx = offCanvas.getContext('2d');

        switch (type) {
            case 'translate': {
                const dx = parseFloat(prompt('Geser horizontal (dx piksel):', '50')) || 0;
                const dy = parseFloat(prompt('Geser vertikal (dy piksel):', '50')) || 0;
                offCtx.translate(dx, dy);
                break;
            }
            case 'scale': {
                const sx = parseFloat(prompt('Skala horizontal (sx):', '1.5')) || 1;
                const sy = parseFloat(prompt('Skala vertikal (sy):', '1.5')) || 1;
                offCtx.scale(sx, sy);
                break;
            }
            case 'rotate': {
                const deg = parseFloat(prompt('Sudut rotasi (derajat):', '45')) || 0;
                const rad = deg * Math.PI / 180;
                offCtx.translate(canvas.width / 2, canvas.height / 2);
                offCtx.rotate(rad);
                offCtx.translate(-canvas.width / 2, -canvas.height / 2);
                break;
            }
            case 'flipH':
                offCtx.translate(canvas.width, 0);
                offCtx.scale(-1, 1);
                break;
            case 'flipV':
                offCtx.translate(0, canvas.height);
                offCtx.scale(1, -1);
                break;
        }

        // Gambar ulang ke kanvas baru, lalu salin kembali ke kanvas utama
        offCtx.drawImage(canvas, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(offCanvas, 0, 0);
    }
});
