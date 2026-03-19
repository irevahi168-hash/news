document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('newsCanvas');
    const ctx = canvas.getContext('2d');

    // UI Elements
    const imageLoader = document.getElementById('imageLoader');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Sliders
    const scaleInput = document.getElementById('imageScale');
    const posXInput = document.getElementById('imagePosX');
    const posYInput = document.getElementById('imagePosY');
    const zoomValLabel = document.getElementById('zoomVal');

    // Inputs IDs for simple text/style change
    const textInputs = ['mainHeadline', 'subHeadline', 'fbPageName', 'quoteText', 'fontSelect', 'headlineColor', 'subHeadlineColor'];

    // Global image object
    let bgImage = new Image();
    let isImageLoaded = false;

    // --- Core Draw Function ---
    function draw() {
        // 1. Clear & Fill Black Background
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Draw Image (Zoom & Slide)
        if (isImageLoaded) {
            ctx.save();
            
            const scale = parseFloat(scaleInput.value);
            const posX = parseInt(posXInput.value);
            const posY = parseInt(posYInput.value);
            
            // Image center positioning logic
            ctx.translate(canvas.width / 2 + posX, canvas.height / 2 + posY);
            ctx.scale(scale, scale);
            
            // Aspect Ratio maintain kore draw kora
            const imgWidth = canvas.width;
            const imgHeight = (bgImage.height / bgImage.width) * canvas.width;
            
            ctx.drawImage(bgImage, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
            
            ctx.restore();
        }

        // 3. Frame Overlay (Bottom Gradient)
        const grad = ctx.createLinearGradient(0, 300, 0, 600);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(1, "rgba(0,0,0,0.9)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 300, canvas.width, 300);

        // 4. Texts Drawing (Fixed Position)
        const font = document.getElementById('fontSelect').value;
        const centerX = canvas.width / 2;
        ctx.textAlign = "center";

        // Quote / Author
        const quote = document.getElementById('quoteText').value;
        if(quote){
            ctx.fillStyle = "#ccc";
            ctx.font = `italic 20px ${font}`;
            ctx.fillText(quote, centerX, 440);
        }

        // Main Headline (Green)
        ctx.fillStyle = document.getElementById('headlineColor').value;
        ctx.font = `bold 46px ${font}`;
        wrapText(ctx, document.getElementById('mainHeadline').value, centerX, 500, 740, 52);

        // Sub Headline (Yellow)
        ctx.fillStyle = document.getElementById('subHeadlineColor').value;
        ctx.font = `bold 28px ${font}`;
        ctx.fillText(document.getElementById('subHeadline').value, centerX, 570);

        // 5. Branding Bar (Fixed)
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, 45);
        ctx.fillStyle = "#333";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "right";
        ctx.fillText("f | " + document.getElementById('fbPageName').value, canvas.width - 20, 28);
        
        // Red Bottom Line
        ctx.fillStyle = "red";
        ctx.fillRect(0, 590, canvas.width, 10);
    }

    // Text Wrap Logic
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        let words = text.split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            if (context.measureText(testLine).width > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else { line = testLine; }
        }
        context.fillText(line, x, y);
    }

    // --- Image Upload Event (Security Fixed) ---
    imageLoader.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            bgImage = new Image();
            bgImage.onload = () => {
                isImageLoaded = true;
                draw(); // Image load holei draw hobe
            };
            bgImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Adjustment Sliders
    [scaleInput, posXInput, posYInput].forEach(el => {
        el.addEventListener('input', () => {
            zoomValLabel.innerText = parseFloat(scaleInput.value).toFixed(1);
            draw();
        });
    });

    // Text Inputs
    textInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', draw);
    });

    // Download Image
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'news_card_fixed.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // Initial Empty Draw
    draw();
});
                          
