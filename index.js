

const AFINN_LEXICON = {
    // Positive words (scores 1-5)
    'excellent': 3,
    'good': 1,
    'great': 3,
    'amazing': 4,
    'wonderful': 3,
    'fantastic': 4,
    'brilliant': 3,
    'outstanding': 3,
    'perfect': 3,
    'love': 3,
    'loved': 3,
    'loves': 3,
    'best': 3,
    'better': 2,
    'awesome': 3,
    'happy': 2,
    'happiness': 2,
    'pleased': 2,
    'satisfied': 2,
    'satisfaction': 2,
    
    // Negative words (scores -1 to -5)
    'terrible': -3,
    'bad': -1,
    'awful': -3,
    'horrible': -3,
    'worst': -3,
    'hate': -3,
    'hated': -3,
    'hates': -3,
    'disappointed': -2,
    'disappointment': -2,
    'disappointing': -2,
    'sad': -2,
    'sadness': -2,
    'angry': -2,
    'frustrated': -2,
    'frustrating': -2,
    'annoyed': -2,
    'annoying': -2,
    'poor': -2,
    'worried': -2,
    'concerned': -2,
    
    // Intensifiers (modifiers)
    'very': 1,
    'extremely': 2,
    'incredibly': 2,
    'really': 1,
    'quite': 1,
    
    // Negation words (will be handled in logic)
    'not': 0,
    'no': 0,
    'never': 0,
    'nothing': 0
};

let currentAnalysis = null;
let currentText = null;

/**
 * Calculate sentiment score from text
 * @param {string} text - Input text to analyze
 * @returns {object} - Sentiment analysis results
 */

function calculateSentiment(text){
    const words = text
        .toLowerCase() 
        .replace(/[^\w\s]/g, ' ') // remove punctuation
        .split(/\s+/) // split by white space
        .filter(word => word.length > 0); // remove empty strings


    // calculate raw score
    let totalScore = 0;
    const wordScores = [];

    words.forEach((word, index) =>{
        const score = AFINN_LEXICON[word] || 0;

        // handle negation
        if(index > 0 && ['not', 'no', 'never', 'nothing'].includes(words[index - 1])){
            totalScore -= (score || 0);
            wordScores.push({ word, score: -(score || 0), negated: true});
        } else {
            totalScore += score;
            wordScores.push({word, score, negated: false});
        }
    });

    let sentiment;
    if (totalScore > 2) sentiment = 'positive';
    else if (totalScore < -2) sentiment ='negative';
    else sentiment = 'neutral';

    // calculate percentage
    const maxPossibleScore = words.length * 5; // example max word score
    const percentage = maxPossibleScore > 0
        ? Math.round((totalScore / maxPossibleScore) * 100)
        : 0;

        return {
            score: totalScore,
            sentiment,
            percentage,
            wordCount: words.length,
            wordScores: wordScores.filter(ws => ws.score !== 0)
        };
        
}

const textInput = document.getElementById('textInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultsSection = document.getElementById('resultsSection');

analyzeBtn.addEventListener('click', () => {
    const text = textInput.value.trim();

    if (!text){
        alert('Please enter some text to analyze.')
        return;
    }

    const result = calculateSentiment(text);
    displayResults(result);
});

/**
 * Display sentiment analysis results 
 * @param {object} result - The sentiment analysis result object
 */


function displayResults(result){
    resultsSection.classList.remove('hidden');
    currentAnalysis = result;
    currentText = textInput.value.trim();

    const sentimentColors = {
        positive: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            badge: 'bg-green-100 text-green-800',
            icon: '✓'
        },
        negative: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            badge: 'bg-red-100 text-red-800',
            icon: '✗'
        },
        neutral: {
            bg: 'bg-gray-50',
            border: 'border-gray-200',
            text: 'text-gray-800',
            badge: 'bg-gray-100 text-gray-800',
            icon: '○'
        }
    };

    const colors = sentimentColors[result.sentiment];

    // result section
    // result section
    resultsSection.innerHTML = `
    <!-- Main Result Card -->
    <div class="${colors.bg} ${colors.border} border-2 rounded-xl p-8 mb-6 shadow-lg card-hover">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-3xl font-bold ${colors.text} flex items-center gap-3">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Sentiment Analysis Results
            </h2>
            <span class="${colors.badge} px-5 py-2.5 rounded-full font-bold text-sm shadow-md">
                ${colors.icon} ${result.sentiment.toUpperCase()}
            </span>
        </div>

        <!-- Enhanced Score Display -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div class="bg-white rounded-xl p-6 shadow-md card-hover border-2 border-gray-100">
                <div class="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Raw Score</div>
                <div class="text-4xl font-extrabold ${result.score >= 0 ? 'text-green-600' : 'text-red-600'}">
                    ${result.score > 0 ? '+' : ''}${result.score}
                </div>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-md card-hover border-2 border-gray-100">
                <div class="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Sentiment Percentage</div>
                <div class="text-4xl font-extrabold ${result.percentage >= 0 ? 'text-green-600' : 'text-red-600'}">
                    ${result.percentage > 0 ? '+' : ''}${result.percentage}%
                </div>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-md card-hover border-2 border-gray-100">
                <div class="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Words Analyzed</div>
                <div class="text-4xl font-extrabold text-gray-800">${result.wordCount}</div>
            </div>
        </div>

        <!-- Enhanced Word Breakdown -->
        ${result.wordScores.length > 0 ? `
            <div class="mt-6">
                <h3 class="text-xl font-bold ${colors.text} mb-4 flex items-center gap-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    Key Sentiment Words
                </h3>
                <div class="flex flex-wrap gap-3">
                    ${result.wordScores.map(ws => {
                        const wordColor = ws.score > 0 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 shadow-sm' 
                            : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-300 shadow-sm';
                        const negatedBadge = ws.negated ? '<span class="text-xs opacity-75 ml-1">(negated)</span>' : '';
                        return `
                            <span class="${wordColor} border-2 px-4 py-2 rounded-full text-sm font-semibold card-hover">
                                ${ws.word} <span class="font-bold text-base">${ws.score > 0 ? '+' : ''}${ws.score}</span>
                                ${negatedBadge}
                            </span>
                        `;
                    }).join('')}
                </div>
            </div>
        ` : '<p class="text-gray-600 text-center py-4">No sentiment words detected in the text.</p>'}
    </div>

    <!-- Enhanced Gemini Integration -->
    <div id="geminiSection" class="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-2xl font-bold text-blue-900 flex items-center gap-2">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                AI Research Consultant
            </h3>
            <button 
                id="consultGeminiBtn"
                class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Get Deep Analysis
            </button>
        </div>
        <p class="text-blue-700 text-sm font-medium">Click to get AI-powered insights from Gemini 1.5 Flash</p>
        <div id="geminiResponse" class="mt-4 hidden"></div>
    </div>
    `;

    setTimeout(() => {
        const consultGeminiBtn = document.getElementById('consultGeminiBtn');
        if (consultGeminiBtn){
            consultGeminiBtn.addEventListener('click', () => {
                consultGemini(currentAnalysis, currentText);
            });
        }
    }, 100);

    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest'});
}


/**
 * Consult Gemini AI for deep sentiment insights
 * @param {object} sentimentResult - The local sentiment analysis result
 * @param {string} originalText - The original text that was analyzed
 */

async function consultGemini(sentimentResult, originalText) {
    const geminiBtn = document.getElementById('consultGeminiBtn');
    const geminiResponse = document.getElementById('geminiResponse');

    geminiBtn.disabled = true;
    geminiBtn.textContent = 'Analyzing...';
    geminiResponse.classList.remove('hidden');
    geminiResponse.innerHTML = `
        <div class="flex items-center space-x-2 text-blue-700">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span>Consulting AI Research Consultant...</span>
        </div>
    `;
    
    try {
        // Verify API key is loaded
        if (!CONFIG || !CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
            throw new Error('API key not configured. Please check config.js');
        }

        const prompt = `You are a market research consultant. Analyze this sentiment data and provide insights:

    ORIGINAL TEXT:
    "${originalText}"

    SENTIMENT ANALYSIS RESULTS:
    - Overall Sentiment: ${sentimentResult.sentiment.toUpperCase()}
    - Raw Score: ${sentimentResult.score}
    - Sentiment Percentage: ${sentimentResult.percentage}%
    - Words Analyzed: ${sentimentResult.wordCount}
    - Key Sentiment Words: ${sentimentResult.wordScores.map(ws => `${ws.word} (${ws.score > 0 ? '+' : ''}${ws.score})`).join(', ')}

    Please provide:
    1. A brief executive summary (2-3 sentences)
    2. Key insights about the sentiment patterns
    3. Potential business implications
    4. Any notable linguistic patterns or nuances

    Keep the response professional, concise, and actionable for market research purposes.`;

           // gemini endpoints version
            const endpoints = [
                
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent`,
                
            
                `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent`,
                
              
                `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent`
            ];

            let lastError = null;
            let data = null;

            
            for (const endpoint of endpoints) {
                try {
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-goog-api-key': CONFIG.GEMINI_API_KEY
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: prompt
                                }]
                            }]
                        })
                    });

                    if (response.ok) {
                        data = await response.json();
                        break; 
                    } else {
                        const errorData = await response.json().catch(() => ({}));
                        lastError = {
                            status: response.status,
                            statusText: response.statusText,
                            message: errorData.error?.message || `HTTP ${response.status}`
                        };
                        console.log(`Endpoint failed: ${endpoint} - ${response.status}`);
                    }
                } catch (err) {
                    lastError = {
                        status: 'NETWORK_ERROR',
                        message: err.message
                    };
                    console.log(`Endpoint error: ${endpoint} - ${err.message}`);
                }
            }

            if (!data) {
                // All endpoints failed
                throw new Error(
                    `All API endpoints failed. Last error: ${lastError?.status} - ${lastError?.message || 'Unknown error'}\n\n` +
                    `Troubleshooting:\n` +
                    `1. Verify your API key at: https://makersuite.google.com/app/apikey\n` +
                    `2. Check if Gemini API is enabled for your Google Cloud project\n` +
                    `3. Ensure your API key has proper permissions`
                );
            }

            // Extract the generated text
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                throw new Error('Unexpected API response format');
            }

            const aiText = data.candidates[0].content.parts[0].text;
            
            // Display the response
            geminiResponse.innerHTML = `
                <div class="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
                    <h4 class="text-lg font-semibold text-blue-900 mb-3">AI Analysis Report</h4>
                    <div class="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">${aiText}</div>
                </div>
            `;
            
        } catch (error) {
            console.error('Gemini API Error:', error);
            geminiResponse.innerHTML = `
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p class="text-red-800 font-semibold mb-2">Error connecting to AI Consultant</p>
                    <p class="text-red-600 text-sm mb-2">${error.message}</p>
                    <details class="mt-2">
                        <summary class="text-red-600 text-sm cursor-pointer">Technical Details</summary>
                        <pre class="text-xs text-red-500 mt-2 bg-red-100 p-2 rounded overflow-auto">${error.stack || error.toString()}</pre>
                    </details>
                </div>
            `;
        } finally {
            // Reset button
            geminiBtn.disabled = false;
            geminiBtn.textContent = 'Get Deep Analysis';
        }
    }