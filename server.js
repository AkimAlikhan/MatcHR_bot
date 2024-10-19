const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

require('dotenv').config();

app.post('/get-symptoms-analysis', async (req, res) => {
    const conditions = req.body.conditions; 
    const specialists = req.body.specialists;

    
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: 'You are filtering system of specialists.' },
                    { role: 'user', content: `${JSON.stringify(specialists)} мне нужны ${conditions}.Верни мне только тех кто подходит по критериям. Не пиши никаких слов кроме кода. верни в виде <div class='cards'><div class='card'><h2 class='card-name'>...</h2><p class='card-info'>...</p></div></div>` }
                ],
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        
        res.json({ analysis: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error while communicating with OpenAI API:', error);
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
