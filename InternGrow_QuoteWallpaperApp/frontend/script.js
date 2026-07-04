document.addEventListener("DOMContentLoaded", () => {
    const quoteText = document.getElementById("quote-text");
    const quoteAuthor = document.getElementById("quote-author");
    const newQuoteBtn = document.getElementById("new-quote-btn");
    const saveQuoteBtn = document.getElementById("save-quote-btn");
    const setWallpaperBtn = document.getElementById("set-wallpaper-btn");
    const wallpaperBg = document.getElementById("wallpaper-bg");

    let currentBgUrl = "";
    const moods = ["nature", "universe", "motivation", "peaceful", "sky"];

    async function getQuote() {
        quoteText.innerText = "Loading quote...";
        quoteAuthor.innerText = "";

        try {
            const response = await fetch("https://api.quotable.io/random");
            const data = await response.json();
            quoteText.innerText = `"${data.content}"`;
            quoteAuthor.innerText = `- ${data.author || "Unknown"}`;
            
            const keyword = data.tags && data.tags.length > 0 ? data.tags[0] : moods[Math.floor(Math.random() * moods.length)];
            changeBackground(keyword);
        } catch (error) {
            quoteText.innerText = '"The only way to do great work is to love what you do."';
            quoteAuthor.innerText = "- Steve Jobs";
            changeBackground("motivation");
        }
    }

    function changeBackground(keyword) {
        const randomNum = Math.floor(Math.random() * 1000);
        currentBgUrl = `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1080&q=80&sig=${randomNum}&keyword=${keyword}`;
        wallpaperBg.style.backgroundImage = `url('${currentBgUrl}')`;
    }

    // Connects to the distinct Backend folder API
    saveQuoteBtn.addEventListener("click", async () => {
        const payload = {
            text: quoteText.innerText,
            author: quoteAuthor.innerText,
            bgImage: currentBgUrl
        };

        try {
            const response = await fetch('http://localhost:3000/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            alert(result.message || "Saved successfully!");
        } catch (error) {
            alert("Backend server se connection nahi ho saka. Pehle backend start karein!");
        }
    });

    setWallpaperBtn.addEventListener("click", () => {
        if (currentBgUrl) {
            const link = document.createElement("a");
            link.href = currentBgUrl;
            link.download = "Wallpaper.jpg";
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });

    newQuoteBtn.addEventListener("click", getQuote);
    getQuote();
});