# 🛡️ SentinelGuard - Proactive & Constructive Chat Moderation

A web-based chat filter that classifies message sentiment and proactively detoxifies toxic content by replacing it with positive alternatives, rather than just deleting it.

## 🌟 Features

- **Hybrid Sentiment Analysis**: Rule-based + AI (TensorFlow.js) for accurate classification
- **Constructive Redaction**: Replaces toxic words with positive alternatives using Datamuse API
- **Live Preview**: Real-time sentiment analysis with emoji indicators
- **Smart Suggestions**: Shows improved versions of toxic messages
- **Educational Warnings**: Clear feedback to promote healthier communication
- **Context Awareness**: Understands phrases like "killer guitarist" vs actual toxicity

## 🚀 Quick Start

1. Clone the repository
2. Open `index.html` in your web browser
3. Start typing to see live sentiment analysis
4. Test with phrases like "This is stupid" to see the suggestion system

## 📊 Sentiment Classifications

- 😊 **Positive** - Encouraging, supportive messages
- 😐 **Neutral** - Balanced, informational content  
- 😠 **Negative** - Critical but constructive feedback
- 🚫 **Toxic** - Harmful content (gets moderated with suggestions)

## 🧪 Test Cases

Try these examples:
- "I am so happy today!" → 😊 Positive
- "This is a stupid idea" → 🚫 Toxic → Suggests "This is a flawed idea"
- "That movie was so bad it was good!" → 😊 Positive (context-aware)
- "He's a killer guitarist!" → 😊 Positive (slang detection)

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **AI Model**: TensorFlow.js Toxicity Detection
- **API**: Datamuse API for synonym replacement
- **Design**: Responsive, modern UI with calming color palette

## 📁 File Structure

```
├── index.html          # Main interface
├── styles.css          # Styling and animations
├── script.js           # Core logic and AI integration
└── README.md           # Documentation
```

## 🎯 Philosophy

Move beyond simple censorship to constructive conversation coaching. Instead of blocking communication, we guide users toward more positive expression while preserving their intended message.