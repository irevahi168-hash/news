document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('newsCanvas');
    const ctx = canvas.getContext('2d');

    // UI Elements
    const imageLoader = document.getElementById('imageLoader');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Sliders & Label
    const scaleInput = document.getElementById('imageScale');
    const posXInput = document.getElementById('imagePosX');
    const posYInput = document.getElementById('imagePosY');
    const zoomValLabel = document.getElementById('zoomVal');

    // Text & Font inputs
    const mainHeadlineInput = document.getElementById('mainHeadline');
    const subHeadlineInput = document.getElementById('subHeadline');
    const fbPageNameInput = document.getElementById('fbPageName');
    const quoteTextInput = document.getElementById('quoteText');
    const fontSelectInput = document.getElementById('fontSelect');
    const headlineColorInput = document.getElementById('headlineColor');
    const subHeadlineColorInput = document.getElementById('subHeadlineColor');

    // State Variables for Photo Adjustment
    let bgImage = null;
    let scale = 1.0;
    let posX = 0;
    let posY = 0;

    // --- Dynamic Draw Function with Fixed Framing ---
    function drawPoster() {
        // 1. Clear Canvas (Black Background)
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // --- DRAW PHOTO (ZOOMABLE & SLIDEABLE) ---
        if (bgImage) {
            ctx.save(); // Save the state before transforming
            
            // Image centering logic
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // Apply transformations: Translate to center -> Scale (Zoom) -> Translate by X/Y Move
            ctx.translate(centerX, centerY);
            ctx.scale(scale, scale);
            ctx.translate(-centerX + posX, -centerY + posY);
            
            // Draw the image within the transformed coordinate system
            ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
            
            ctx.restore(); // Restore the state, resetting the scale/translate for framing
        }

        // --- DRAW FIXED FRAMING & TEXTS ---
        
        // 2. Draw Top White/Logo Bar (Fixed)
        const headerHeight = 50;
        ctx.fillStyle = "#FFFFFF"; // Logo area background
        ctx.fillRect(0, 0, canvas.width, headerHeight);

        // Logo Placement (Fixed)
        // [Add logo drawing logic here if a file is uploaded]
        ctx.fillStyle = "#000"; // Black placeholder
        ctx.fillRect(10, 5, 40, 40);

        // Facebook Section (Fixed, Right)
        ctx.fillStyle = "#1877F2"; // FB Blue
        ctx.beginPath();
        ctx.arc(canvas.width - 25, 25, 15, 0, 2 * Math.PI);
        ctx.fill();
         
        ctx.fillStyle = "#333"; // Text color
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "right";
        ctx.fillText("f " + fbPageNameInput.value, canvas.width - 50, 30);
        ctx.textAlign = "left"; // Reset alignment for headlines

        // 3. Draw Bottom Black Gradient Overlay (Fixed, for text readability)
        const gradHeight = 250;
        const gradY = canvas.height - gradHeight;
        const grad = ctx.createLinearGradient(0, gradY, 0, canvas.height);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(1, "rgba(0,0,0,0.9)"); // Smooth black fade
        ctx.fillStyle = grad;
        ctx.fillRect(0, gradY, canvas.width, gradHeight);

        // 4. Draw Bengali Headlines (Fixed, Centered Bottom)
        const padding = 20;
        const bottomY = canvas.height - padding;
        const centerX = canvas.width / 2;
        const selectedFont = fontSelectInput.value;
        const mainColor = headlineColorInput.value;
        const subColor = subHeadlineColorInput.value;

        ctx.textAlign = "center"; // Center Headlines

        // Sub Headline (Yellow, Fixed position)
        ctx.fillStyle = subColor;
        ctx.font = `bold 32px ${selectedFont}`;
        ctx.fillText(subHeadlineInput.value, centerX, bottomY - 30);

        // Main Headline (Green, Fixed position, with wrap)
        ctx.fillStyle = mainColor;
        ctx.font = `bold 48px ${selectedFont}`;
        wrapCenterText(ctx, mainHeadlineInput.value, centerX, bottomY - 90, canvas.width - (padding * 2), 55);
        
        // Quote / Author (Fixed position, small above headline)
        ctx.fillStyle = "#CCCCCC";
        ctx.font = `italic 20px ${selectedFont}`;
        ctx.fillText(quoteTextInput.value, centerX, bottomY - 150);

        // 5. Draw the Bottom Red Line (Fixed)
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
    }

    // --- Helper for Wrapping & Centering Bengali Text ---
    function wrapCenterText(context, text, x, y, maxWidth, lineHeight) {
        let words = text.split(' ');
        let line = '';
        let lines = [];

        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = context.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        for(let j = 0; j<lines.length; j++) {
            context.fillText(lines[j], x, y - ((lines.length - 1 - j) * lineHeight));
        }
    }

    // --- Event Listeners ---

    // 1. Background Image Loader
    imageLoader.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                bgImage = new Image();
                bgImage.onload = drawPoster;
                bgImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // 2. Adjustments Sliders
    [scaleInput, posXInput, posYInput].forEach(input => {
        input.addEventListener('input', () => {
            scale = parseFloat(scaleInput.value);
            posX = parseInt(posXInput.value);
            posY = parseInt(posYInput.value);
            zoomValLabel.innerText = scale.toFixed(1);
            drawPoster();
        });
    });

    // 3. Text & Style Inputs
    const textAndStyleInputs = [
        mainHeadlineInput, subHeadlineInput, fbPageNameInput, 
        quoteTextInput, fontSelectInput, headlineColorInput, subHeadlineColorInput
    ];
    textAndStyleInputs.forEach(input => {
        input.addEventListener('input', drawPoster);
    });

    // --- Download Function ---
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'fixed-frame-news-card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // Initial Draw (Wait for Bengali fonts)
    document.fonts.load("1em Noto Serif Bengali").then(() => {
        drawPoster();
    });
});
            
