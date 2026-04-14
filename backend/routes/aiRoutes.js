const express = require('express');
const router = express.Router();
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const { Jimp } = require('jimp'); // Changed from 'const Jimp = require' to '{ Jimp }'

let model;

// Load the model locally
const loadModel = async () => {
    try {
        console.log("Loading Pure JS AI Model...");
        model = await mobilenet.load();
        console.log("AI Model Ready (No API Key Required)");
    } catch (err) {
        console.error("Model loading failed:", err);
    }
};
loadModel();

router.post('/analyze', async (req, res) => {
    try {
        const { message, image } = req.body;
        let detectionResults = [];

        if (image) {
            console.log("Image received, starting analysis...");
            
            // 1. Convert Base64 string to Buffer
            const buffer = Buffer.from(image.split(",")[1], 'base64');
            
            // 2. Read image using Jimp (v1.x syntax)
            const jimpImage = await Jimp.read(buffer);
            
            // 3. Resize to 224x224 for MobileNet
            jimpImage.resize({ w: 224, h: 224 });
            
            // 4. Extract pixel data into a Float32 array
            const { data, width, height } = jimpImage.bitmap;
            const floatData = new Float32Array(width * height * 3);

            for (let i = 0; i < width * height; i++) {
                floatData[i * 3] = data[i * 4];     // Red
                floatData[i * 3 + 1] = data[i * 4 + 1]; // Green
                floatData[i * 3 + 2] = data[i * 4 + 2]; // Blue
            }

            // 5. Create 3D Tensor
            const input = tf.tensor3d(floatData, [224, 224, 3], 'float32');

            // 6. Classify
            const predictions = await model.classify(input);
            detectionResults = predictions.map(p => p.className.toLowerCase());
            
            console.log("AI Detected features:", detectionResults);

            // 7. Cleanup memory to prevent server lag
            input.dispose(); 
        }

        // 8. Local Knowledge Logic
        const msg = (message || "").toLowerCase();
        let response = "";

        // Combine text keywords and image detection
        if (msg.includes("eye") || msg.includes("swelling") || detectionResults.some(r => r.includes("eye") || r.includes("face"))) {
            response = "Dr. Baaz Assessment: The symptoms (swelling/eye issues) point toward Infectious Coryza or CRD. Action: Isolate the bird immediately, clean its face with warm saline, and provide respiratory antibiotics.";
        } else if (msg.includes("spot") || msg.includes("pox") || msg.includes("comb") || detectionResults.some(r => r.includes("comb") || r.includes("bird") || r.includes("hen"))) {
            response = "Dr. Baaz Assessment: Visible spots on the comb or skin suggest Fowl Pox. This is viral. Action: Isolate the bird to prevent spread. Scabs will fall off naturally; apply antiseptic to prevent secondary infection.";
        } else if (msg.includes("leg") || msg.includes("walk") || msg.includes("paralysis")) {
            response = "Dr. Baaz Assessment: Difficulty walking or leg paralysis could be Vitamin B12 deficiency or Marek's Disease. Action: Provide high-quality Vitamin B-Complex supplements in water.";
        } else {
            response = "Dr. Baaz Assessment: Based on the data, the symptoms are general. Please ensure the bird is in a well-ventilated coop, isolate it from others, and check if its droppings are abnormal.";
        }

        res.json({ response });

    } catch (err) {
        console.error("AI Route Error:", err);
        res.status(500).json({ error: "Local AI failed. Please try a clearer image." });
    }
});

module.exports = router;