const canvas = document.getElementById('newsCanvas');
const ctx = canvas.getContext('2d');

let bgImage = null;
let scale = 1.0;
let posX = 0;
let posY = 0;

// Load Inputs
const inputs = ['mainHeadline', 'subHeadline', 'fbPageName', 'quoteText', 'fontSelect', 'headlineColor', 'subColor', 'imageScale', 'imagePosX', 'imagePosY'];

inputs.forEach(id => {
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

    // Bottom Gradient/Overlay for text readability
    const grad = ctx.createLinearGradient(0, 400, 0, 600);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(1, "black");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 350, canvas.width, 250);

    const font = document.getElementById('fontSelect').value;

    // Quote/Author
    ctx.fillStyle = "#ccc";
    ctx.font = `italic 20px ${font}`;
    ctx.fillText(document.getElementById('quoteText').value, 30, 460);

    // Main Headline
    ctx.fillStyle = document.getElementById('headlineColor').value;
    ctx.font = `bold 45px ${font}`;
    wrapText(ctx, document.getElementById('mainHeadline').value, 30, 510, 740, 50);

    // Sub Headline
    ctx.fillStyle = document.getElementById('subColor').value;
    ctx.font = `bold 28px ${font}`;
    ctx.fillText(document.getElementById('subHeadline').value, 30, 570);

    // Facebook Section (Bottom Right)
    ctx.fillStyle = "#fff";
    ctx.font = `bold 18px Arial`;
    ctx.textAlign = "right";
    ctx.fillText("f " + document.getElementById('fbPageName').value, 770, 30);
    ctx.textAlign = "left"; // Reset
}

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

document.getElementById('downloadBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'NewsCard_Kabir.png';
    link.href = canvas.toDataURL();
    link.click();
});

// Initial Load
window.onload = draw;
