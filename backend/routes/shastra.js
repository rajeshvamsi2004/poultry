const express = require('express');
const router = express.Router();

// Knowledge Base for Shastra
const nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Aslesha", "Magha"];
const birds = ["Dega (Eagle)", "Kaki (Crow)", "Nemali (Peacock)", "Pingala (Parrot)", "Kodi (Rooster)"];

router.get('/daily', (req, res) => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)

    // 1. Automatic Paksha calculation (Cycles every 15 days)
    const paksha = (today.getDate() <= 15) ? "Shukla Paksha (Waxing Moon)" : "Krishna Paksha (Waning Moon)";

    // 2. Automatic Nakshatra (Rotates daily)
    const nakshatra = nakshatras[dayOfYear % nakshatras.length];

    // 3. Strategy of the Day (Based on Day of the Week)
    const strategies = [
        "ఆదివారం: ఈరోజు డేగ జాతి కోళ్లకు అత్యంత అనుకూలమైన సమయం. (Sunday: Favorable for Dega breeds).",
        "సోమవారం: నెమలి మరియు కాకి రంగు కోళ్లు విజయాన్ని సాధిస్తాయి. (Monday: Nemali and Kaki will dominate).",
        "మంగళవారం: పింగళి రంగు కోళ్లకు ఈరోజు పవర్‌ఫుల్ డే. (Tuesday: Powerful day for Pingala).",
        "బుధవారం: కోడి రంగు మరియు తెల్లని కోళ్లకు అనుకూలం. (Wednesday: Good for Kodi and White breeds).",
        "గురువారం: ఈరోజు నెమలి జాతి కోళ్లు గెలుపు గుర్రాలు. (Thursday: Nemali breeds are winners today).",
        "శుక్రవారం: కాకి మరియు డేగ కలయిక ఉన్న కోళ్లకు శుభం. (Friday: Good for Kaki-Dega mix).",
        "శనివారం: నల్లని రంగు కోళ్లు (కాకి) ఈరోజు కింగ్స్. (Saturday: Black Kaki breeds are kings today)."
    ];

    // 4. Time Slots (The 4 Quarters)
    const timings = [
        { id: 1, time: "06:00 - 09:00", winner: birds[dayOfWeek % 5], color: "#FF7D44" },
        { id: 2, time: "09:00 - 12:00", winner: birds[(dayOfWeek + 1) % 5], color: "#3B82F6" },
        { id: 3, time: "12:00 - 15:00", winner: birds[(dayOfWeek + 2) % 5], color: "#10B981" },
        { id: 4, time: "15:00 - 18:00", winner: birds[(dayOfWeek + 3) % 5], color: "#F59E0B" }
    ];

    res.json({
        date: today.toDateString(),
        paksha,
        nakshatra,
        strategy: strategies[dayOfWeek],
        timings
    });
});

module.exports = router;