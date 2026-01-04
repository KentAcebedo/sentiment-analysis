# 📊 Sentiment Analysis Consultant

A sleek, real-time sentiment analysis tool that evaluates the emotional tone of text using the **AFINN-161** lexical algorithm. Built with a modern UI powered by **Tailwind CSS** and a lightweight **Vanilla JavaScript** engine.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![JavaScript](https://img.shields.io/badge/language-JavaScript-yellow.svg)
![Tailwind](https://img.shields.io/badge/styling-TailwindCSS-38B2AC.svg)

## 🚀 Features

- **Real-time Evaluation:** Instant sentiment scoring as you type or submit text.
- **AFINN Logic:** Uses a weighted word-list approach to calculate precise emotional valence.
- **Dynamic UI:** Responsive design that changes visual cues (colors/icons) based on the sentiment result.
- **Sarcasm Detection (Beta):** Heuristics to identify potential "false positives" in ironic text.

## 🛠️ Tech Stack

- **Logic:** JavaScript (ES6+)
- **Algorithm:** AFINN-161 (Valence-based sentiment analysis)
- **Styling:** Tailwind CSS (Utility-first framework)

## 🧠 How It Works: The AFINN Algorithm

This project utilizes the **AFINN-161** word list, which consists of over 2,400 English words rated for "valence" on a scale from **-5 (negative)** to **+5 (positive)**.

### The Math
The sentiment score is calculated by:
1. **Tokenization:** Breaking the input string into individual words.
2. **Lookup:** Matching tokens against the AFINN dictionary.
3. **Summation:** Adding the scores of all matched words.
4. **Normalization:** Adjusting the score relative to the length of the text to determine the "Comparative Score."

$$\text{Sentiment Score} = \sum_{i=1}^{n} \text{valence}(word_i)$$

## Live Demo
[**🚀 View Live Demo**]([https://your-link-here.com](https://afinn-sentiment-analysis.netlify.app/))


## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/KentAcebedo/sentiment-analysis.git]
   cd YOUR_REPO_NAME
