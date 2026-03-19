const canvas = document.getElementById('newsCanvas');
const ctx = canvas.getContext('2d');

let bgImage = null;

// Inputs trigger redraw
const inputIds = ['mainHeadline', 'subHeadline', 'fbPageName', 'quoteText', 'fontSelect', 'headlineColor', 'subColor', 'imageScale', 'imagePosX', 'imagePosY'];

inputIds.forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
        if(id === 'imageScale') document.getElementById('zoomVal').innerText = document.getElementById(id).value;
        draw();
    });
});

document.getElementById('imageLoader').addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        bgImage = new Image();
        bgImage.onload = draw;
        bgImage.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1. Background Image (Zoom & Slide)
    if (bgImage) {
        ctx.save();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.translate(centerX + parseInt(document.getElementById('imagePosX').value), 
                      centerY + parseInt(document.getElementById('imagePosY').value));
        ctx.scale(document.getElementById('imageScale').value, document.getElementById('imageScale').value);
        ctx.drawImage(bgImage, -bgImage.width / 2, -bgImage.height / 2);
        ctx.restore();
    }

    // 2. Black Overlay for Text Readability
    const grad = ctx.createLinearGradient(0, 300, 0, 600);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(1, "rgba(0,0,0,0.9)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 300, canvas.width, 300);

    const font = document.getElementById('fontSelect').value;
    const centerX = canvas.width / 2; // Middle point

    // --- Text Alignment: CENTER ---
    ctx.textAlign = "center";

    // 3. Quote / Author (Middle)
    const quote = document.getElementById('quoteText').value;
    if(quote) {
        ctx.fillStyle = "#ccc";
        ctx.font = `italic 20px ${font}`;
        ctx.fillText(quote, centerX, 440);
    }

    // 4. Main Headline (Middle)
    ctx.fillStyle = document.getElementById('headlineColor').value;
    ctx.font = `bold 48px ${font}`;
    wrapCenterText(ctx, document.getElementById('mainHeadline').value, centerX, 500, 740, 55);

    // 5. Sub Headline (Middle)
    ctx.fillStyle = document.getElementById('subColor').value;
    ctx.font = `bold 30px ${font}`;
    ctx.fillText(document.getElementById('subHeadline').value, centerX, 570);

    // 6. Facebook Branding (Top Corner)
    ctx.fillStyle = "#fff";
    ctx.font = `bold 18px Arial`;
    ctx.textAlign = "right";
    ctx.fillText("f | " + document.getElementById('fbPageName').value, canvas.width - 20, 30);
}

// Center-aligned text wrapping logic
function wrapCenterText(context, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' ');
    let line = '';
    let lines = [];

    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        if (context.measureText(testLine).width > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    // Adjusting Y position to keep it centered vertically if multi-line
    let startY = y - ((lines.length - 1) * lineHeight) / 2;

    for(let k = 0; k < lines.length; k++) {
        context.fillText(lines[k], x, startY + (k * lineHeight));
    }
}

document.getElementById('downloadBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'NewsCard_Centered.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

window.onload = draw;
                
