document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('newsCanvas');
    const ctx = canvas.getContext('2d');

    // UI Elements
    const imageLoader = document.getElementById('imageLoader');
    const logoLoader = document.getElementById('logoLoader');
    const downloadBtn = document.getElementById('downloadBtn');

    // State Variables
    let bgImage = null;
    let logoImage = null;
    let mainHeadlineData = "";
    let subHeadlineData = "";
    let fbPageData = "";
    let quoteData = "";

    // Default Images (Placeholder/Fallback)
    // IMPORTANT: GitHub-e real image path set korte hobe
    const fbLogoUrl = 'https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg'; 

    // --- Core Redraw Function ---
    function drawPoster() {
        // 1. Clear Canvas
        ctx.fillStyle = '#f0f0f0'; // Light grey fallback
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Draw Background Image
        if (bgImage) {
            ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        } else {
             ctx.fillStyle = "#000000"; // Black fallback
             ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 3. Draw Top White Header (for Logo/Facebook)
        const headerHeight = 50;
        ctx.fillStyle = document.getElementById('textBgColor').value;
        ctx.fillRect(0, 0, canvas.width, headerHeight);

        // 4. Draw User Logo (Left)
        if (logoImage) {
            ctx.drawImage(logoImage, 10, 5, 40, 40);
        }

        // 5. Draw Facebook Logo & Page Name (Right)
        const fbLogoImg = new Image();
        fbLogoImg.crossOrigin = "anonymous";
        fbLogoImg.src = fbLogoUrl;
        
        fbLogoImg.onload = function() {
          // Note: drawing logic inside onload is tricky for redraw.
          // Better: Draw a placeholder circle or pre-loaded image for immediate redraw.
           // Placeholder for now, real implementation below.
           // drawFacebookElements(fbLogoImg);
        };
        // Quick draw for feedback (can be improved by pre-loading)
         ctx.fillStyle = "#1877F2";
         ctx.beginPath();
         ctx.arc(canvas.width - 25, 25, 15, 0, 2 * Math.PI);
         ctx.fill();
         
         ctx.fillStyle = "#333"; // text color for top header
         ctx.font = "bold 16px Arial";
         ctx.textAlign = "right";
         ctx.fillText(document.getElementById('fbPageName').value, canvas.width - 50, 30);


        // --- Draw Bengali Content (Bottom) ---
        
        const padding = 20;
        const bottomY = canvas.height - 30; // 30px from bottom for footer line
        
        // Settings based on inputs
        const bengaliFont = document.getElementById('fontSelect').value;
        const mainColor = document.getElementById('headlineColor').value;
        const subColor = document.getElementById('subHeadlineColor').value;

        // 6. Draw "Ukti / Author" Name (Small, above main title)
        ctx.fillStyle = "#CCCCCC"; // Grey fallback
        ctx.font = `italic 18px ${bengaliFont}`;
        ctx.textAlign = "left";
        const quoteText = document.getElementById('quoteText').value;
        if(quoteText){
           ctx.fillText(quoteText, padding, bottomY - 140);
        }

        // 7. Draw Main Headline (Green)
        ctx.fillStyle = mainColor;
        ctx.font = `bold 42px ${bengaliFont}`;
        ctx.textAlign = "left";
        wrapText(ctx, document.getElementById('mainHeadline').value, padding, bottomY - 100, canvas.width - (padding * 2), 48);

        // 8. Draw Sub Headline (Yellow)
        ctx.fillStyle = subColor;
        ctx.font = `bold 30px ${bengaliFont}`;
        ctx.textAlign = "left";
        wrapText(ctx, document.getElementById('subHeadline').value, padding, bottomY - 50, canvas.width - (padding * 2), 34);

        // 9. Draw the Bottom Red Line/Bar (Optional, from image)
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
    }

    // --- Helper for Wrapping Bengali Text ---
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
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
          context.fillText(lines[j], x, y + (j*lineHeight));
        }
    }


    // --- Event Listeners for Uploads & Inputs ---

    // 1. Background Image Loader
    imageLoader.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                bgImage = new Image();
                bgImage.onload = function() {
                    drawPoster(); // Redraw once image is loaded
                };
                bgImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // 2. Logo Image Loader
    logoLoader.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                logoImage = new Image();
                logoImage.onload = function() {
                    drawPoster(); // Redraw once image is loaded
                };
                logoImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // 3. Simple Inputs (Draw immediately on change)
    const inputs = ['mainHeadline', 'subHeadline', 'fbPageName', 'quoteText', 'fontSelect', 'headlineColor', 'subHeadlineColor', 'textBgColor'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', drawPoster);
    });

    // --- Download Function ---
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'news-card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // Initial Draw (Load placeholders/fallbacks)
    // Important: Wait for Bengali font to load before first draw!
     document.fonts.load("1em Noto Serif Bengali").then(() => {
        drawPoster();
     });
});
  
