class SentinelGuard {
    constructor() {
        this.toxicityModel = null;
        this.initializeElements();
        this.setupEventListeners();
        this.loadToxicityModel();
        
        // Enhanced keyword dictionaries with context awareness
        this.keywords = {
            toxic: ['idiot', 'stupid', 'stuppid', 'dumb', 'moron', 'pathetic', 'worthless', 'asshole', 'fucking', 'shit', 'damn', 'violent', 'cruel', 'mean', 'nasty', 'rude', 'disrespectful'],
            negative: ['bad', 'terrible', 'awful', 'horrible', 'worst', 'suck', 'fail', 'wrong', 'annoying', 'dislike', 'hate', 'sad', 'upset', 'angry', 'pointless', 'sarcasm', 'sarcastic', 'ironic', 'mocking', 'ridiculous', 'absurd', 'pathetic', 'lame', 'boring', 'useless', 'whatever', 'seriously', 'obviously', 'clearly', 'sure thing', 'yeah right', 'oh great', 'fantastic', 'wonderful', 'perfect', 'brilliant', 'genius', 'depressed', 'irritated', 'frustrated', 'resentful', 'anxious', 'nervous', 'worried', 'guilty', 'regretful', 'lonely', 'isolated', 'jealous', 'envious', 'sorrow', 'sorrowful', 'grief', 'grieving', 'mourning', 'heartbroken', 'devastated', 'insecure', 'insecurity', 'doubtful', 'uncertain', 'fearful', 'scared', 'afraid', 'terrified', 'panicked', 'overwhelmed', 'stressed', 'exhausted', 'drained', 'hopeless', 'helpless', 'powerless', 'worthless', 'ashamed', 'embarrassed', 'humiliated', 'rejected', 'abandoned', 'betrayed', 'disappointed', 'discouraged', 'defeated', 'broken', 'empty', 'numb', 'lost', 'confused', 'troubled', 'disturbed', 'miserable', 'wretched', 'gloomy', 'melancholy', 'despondent', 'despairing', 'bitter', 'resentful', 'vengeful', 'hostile', 'aggressive', 'violent', 'cruel', 'mean', 'nasty', 'rude', 'disrespectful'],
            positive: ['good', 'great', 'awesome', 'amazing', 'excellent', 'wonderful', 'fantastic', 'love', 'best', 'happy', 'nice', 'killer', 'kill this', 'so bad it was good', 'jovial', 'cheerful', 'upbeat', 'lighthearted', 'buoyant', 'spirited', 'joyful', 'excited', 'enthusiastic', 'energized', 'eager', 'relaxed', 'calm', 'peaceful', 'optimistic', 'hopeful', 'grateful', 'content', 'satisfied', 'thankful', 'affectionate', 'loving', 'friendly', 'playful', 'sociable'],
            neutral: ['bored', 'indifferent', 'confused', 'uncertain', 'unsure', 'conflicted', 'indecisive', 'curious', 'inquisitive', 'reflective', 'thoughtful', 'contemplative', 'introspective', 'nostalgic']
        };
        
        // Critical negative contexts that override positive keywords
        this.criticalNegativeContexts = [
            'suicide', 'kill myself', 'end my life', 'want to die', 'love to suicide', 'love suicide',
            'self harm', 'hurt myself', 'cut myself', 'overdose', 'jump off'
        ];
        
        // Sarcastic phrases that indicate negative sentiment
        this.sarcasticPhrases = [
            'oh great', 'yeah right', 'sure thing', 'how wonderful', 'just perfect', 'absolutely brilliant',
            'oh fantastic', 'really helpful', 'so exciting', 'cant wait', 'love that', 'just what i needed'
        ];
        
        // Context-aware positive phrases that override negative keywords
        this.positiveContexts = [
            'so bad it was good', 'bad it was good', 'killer guitarist', 'killer musician', 'killer performance',
            'kill this presentation', 'kill it', 'going to kill', 'killer app', 'killer feature'
        ];
        
        // Neutral academic contexts
        this.neutralContexts = [
            'word ass is', 'bible', 'dictionary', 'academic', 'research', 'study', 'example'
        ];
        
        // Enhanced replacement mappings for constructive redaction
        this.replacements = {
            'idiot': ['person', 'individual', 'someone'],
            'stupid': ['unwise', 'flawed', 'challenging', 'questionable'],
            'stuppid': ['unwise', 'flawed', 'challenging', 'questionable'],
            'dumb': ['simple', 'unclear', 'confusing', 'basic'],
            'moron': ['person', 'individual', 'someone'],
            'pathetic': ['disappointing', 'concerning', 'unfortunate'],
            'worthless': ['limited', 'insufficient', 'inadequate'],
            'asshole': ['person', 'individual', 'rude person'],
            'fucking': ['very', 'extremely', 'really'],
            'shit': ['poor', 'bad', 'subpar'],
            'damn': ['very', 'quite', 'really'],
            'pointless': ['futile', 'unnecessary', 'ineffective'],
            'self-harm content': ['seek support', 'talk to someone', 'get help'],
            'sarcastic': ['direct', 'straightforward', 'honest'],
            'ridiculous': ['unusual', 'different', 'unique'],
            'lame': ['simple', 'basic', 'straightforward'],
            'useless': ['limited', 'basic', 'simple'],
            'whatever': ['okay', 'fine', 'alright'],
            'depressed': ['feeling down', 'need support', 'could use help'],
            'frustrated': ['challenged', 'working through', 'processing'],
            'anxious': ['concerned', 'thoughtful', 'careful'],
            'lonely': ['seeking connection', 'wanting company', 'looking for friends'],
            'jealous': ['admiring', 'inspired by', 'motivated by'],
            'aggressive': ['assertive', 'direct', 'focused'],
            'sorrow': ['sadness', 'reflection', 'processing emotions'],
            'grief': ['mourning', 'remembering', 'healing'],
            'heartbroken': ['deeply hurt', 'processing loss', 'healing'],
            'insecure': ['uncertain', 'cautious', 'thoughtful'],
            'scared': ['careful', 'cautious', 'alert'],
            'overwhelmed': ['busy', 'handling much', 'working through'],
            'hopeless': ['challenged', 'seeking solutions', 'working through'],
            'ashamed': ['learning', 'growing', 'reflecting'],
            'rejected': ['redirected', 'finding new paths', 'exploring options'],
            'disappointed': ['surprised', 'learning', 'adjusting expectations'],
            'broken': ['healing', 'rebuilding', 'growing stronger'],
            'lost': ['exploring', 'finding direction', 'discovering'],
            'miserable': ['struggling', 'working through challenges', 'seeking improvement']
        };
        
        // Positive alternatives for critical negative contexts
        this.criticalReplacements = {
            'suicide': 'seek support',
            'kill myself': 'talk to someone',
            'end my life': 'find help',
            'want to die': 'need support',
            'love to suicide': 'love to find peace',
            'love suicide': 'love getting help',
            'self harm': 'self care',
            'hurt myself': 'help myself',
            'cut myself': 'care for myself',
            'oh great': 'thats interesting',
            'yeah right': 'i see',
            'sure thing': 'understood',
            'just perfect': 'thats fine',
            'really helpful': 'thanks for that',
            'sorrow': 'finding peace',
            'grief': 'healing process',
            'heartbroken': 'finding strength',
            'insecure': 'building confidence',
            'scared': 'being brave',
            'overwhelmed': 'taking it step by step',
            'hopeless': 'finding hope',
            'ashamed': 'learning and growing',
            'rejected': 'finding new opportunities',
            'disappointed': 'staying optimistic',
            'broken': 'becoming stronger',
            'lost': 'finding my way',
            'miserable': 'seeking happiness'
        };
    }

    initializeElements() {
        this.messageInput = document.getElementById('message-input');
        this.sendBtn = document.getElementById('send-btn');
        this.charCount = document.getElementById('char-count');
        this.previewCard = document.getElementById('preview-card');
        this.sentimentEmoji = document.getElementById('sentiment-emoji');
        this.sentimentText = document.getElementById('sentiment-text');
        this.previewMessage = document.getElementById('preview-message');
        this.chatMessages = document.getElementById('chat-messages');
        this.warningModal = document.getElementById('warning-modal');
        this.warningText = document.getElementById('warning-text');
        this.understandBtn = document.getElementById('understand-btn');
        this.loading = document.getElementById('loading');
        this.suggestionBox = document.getElementById('suggestion-box');
        this.suggestedText = document.getElementById('suggested-text');
        this.useSuggestionBtn = document.getElementById('use-suggestion-btn');
    }

    setupEventListeners() {
        this.messageInput.addEventListener('input', this.debounce(this.handleInput.bind(this), 300));
        this.sendBtn.addEventListener('click', this.handleSend.bind(this));
        this.understandBtn.addEventListener('click', this.closeModal.bind(this));
        this.useSuggestionBtn.addEventListener('click', this.useSuggestion.bind(this));
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && !this.sendBtn.disabled) {
                e.preventDefault();
                this.handleSend();
            }
        });
    }

    async loadToxicityModel() {
        try {
            this.toxicityModel = await toxicity.load(0.7);
            console.log('Toxicity model loaded successfully');
        } catch (error) {
            console.error('Failed to load toxicity model:', error);
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    async handleInput() {
        const message = this.messageInput.value.trim();
        this.updateCharCount();
        
        if (!message) {
            this.resetPreview();
            this.hideSuggestion();
            return;
        }

        const analysis = await this.analyzeMessage(message);
        this.updatePreview(analysis);
        
        if (analysis.sentiment === 'toxic') {
            await this.showSuggestion(analysis);
            this.sendBtn.disabled = true;
        } else {
            this.hideSuggestion();
            this.sendBtn.disabled = !message;
        }
    }

    updateCharCount() {
        const count = this.messageInput.value.length;
        this.charCount.textContent = `${count}/150`;
        this.charCount.style.color = count > 140 ? '#e53e3e' : '#666';
    }

    async analyzeMessage(message) {
        // Rule-based analysis (fast first pass)
        const ruleBasedResult = this.ruleBasedAnalysis(message);
        
        // AI enhancement for context awareness
        let aiResult = null;
        if (this.toxicityModel) {
            try {
                const predictions = await this.toxicityModel.classify([message]);
                aiResult = this.processToxicityPredictions(predictions);
            } catch (error) {
                console.error('AI analysis failed:', error);
            }
        }

        // Smart combination: rule-based for context-aware cases, AI for ambiguous cases
        let finalSentiment;
        if (ruleBasedResult.confidence >= 0.8) {
            finalSentiment = ruleBasedResult.sentiment;
        } else if (aiResult?.isToxic) {
            finalSentiment = 'toxic';
        } else if (aiResult?.confidence > 0.7) {
            finalSentiment = aiResult.sentiment;
        } else {
            finalSentiment = ruleBasedResult.sentiment;
        }

        return {
            sentiment: finalSentiment,
            confidence: aiResult?.confidence || ruleBasedResult.confidence,
            toxicWords: ruleBasedResult.toxicWords,
            originalMessage: message
        };
    }

    ruleBasedAnalysis(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for critical negative contexts first (highest priority)
        const hasCriticalNegativeContext = this.criticalNegativeContexts.some(context => 
            lowerMessage.includes(context)
        );
        
        if (hasCriticalNegativeContext) {
            const detectedContext = this.criticalNegativeContexts.find(context => 
                lowerMessage.includes(context)
            );
            return { sentiment: 'toxic', confidence: 0.95, toxicWords: [detectedContext] };
        }
        
        // Check for sarcastic phrases (indicates negative sentiment)
        const hasSarcasticPhrase = this.sarcasticPhrases.some(phrase => 
            lowerMessage.includes(phrase)
        );
        
        if (hasSarcasticPhrase) {
            return { sentiment: 'negative', confidence: 0.85, toxicWords: [] };
        }
        
        // Check for positive contexts (overrides negative keywords)
        const hasPositiveContext = this.positiveContexts.some(context => 
            lowerMessage.includes(context)
        );
        
        // Check for neutral academic contexts
        const hasNeutralContext = this.neutralContexts.some(context => 
            lowerMessage.includes(context)
        );
        
        if (hasPositiveContext) {
            return { sentiment: 'positive', confidence: 0.9, toxicWords: [] };
        }
        
        if (hasNeutralContext) {
            return { sentiment: 'neutral', confidence: 0.8, toxicWords: [] };
        }
        
        let toxicWords = [];
        let negativeCount = 0;
        let positiveCount = 0;

        // Check for toxic words (excluding context-dependent ones)
        this.keywords.toxic.forEach(toxic => {
            if (lowerMessage.includes(toxic)) {
                // Skip if it's in a positive context
                if (toxic === 'kill' && (lowerMessage.includes('kill this') || lowerMessage.includes('going to kill'))) {
                    return;
                }
                toxicWords.push(toxic);
            }
        });
        
        // Check for leet speak and special character substitutions
        if (lowerMessage.includes('$#!+') || lowerMessage.includes('sh!t') || lowerMessage.includes('$h!t')) {
            toxicWords.push('shit');
        }

        // Check for negative words
        this.keywords.negative.forEach(neg => {
            if (lowerMessage.includes(neg)) {
                // Skip 'bad' if in positive context like 'so bad it was good'
                if (neg === 'bad' && lowerMessage.includes('so bad it was good')) {
                    return;
                }
                // Skip positive uses of words like 'brilliant', 'fantastic' when genuinely positive
                if (['brilliant', 'fantastic', 'wonderful', 'perfect'].includes(neg) && 
                    !this.sarcasticPhrases.some(phrase => lowerMessage.includes(phrase))) {
                    return;
                }
                negativeCount++;
            }
        });
        
        // Check for neutral words
        let neutralCount = 0;
        this.keywords.neutral.forEach(neutral => {
            if (lowerMessage.includes(neutral)) {
                neutralCount++;
            }
        });

        // Check for positive words (but not if they're in sarcastic context)
        this.keywords.positive.forEach(pos => {
            if (lowerMessage.includes(pos)) {
                // Don't count as positive if it's part of a sarcastic phrase
                if (!hasSarcasticPhrase) {
                    positiveCount++;
                }
            }
        });

        let sentiment, confidence;
        if (toxicWords.length > 0) {
            sentiment = 'toxic';
            confidence = 0.9;
        } else if (hasSarcasticPhrase || negativeCount > positiveCount) {
            sentiment = 'negative';
            confidence = hasSarcasticPhrase ? 0.85 : 0.8;
        } else if (positiveCount > negativeCount) {
            sentiment = 'positive';
            confidence = 0.8;
        } else if (neutralCount > 0) {
            sentiment = 'neutral';
            confidence = 0.7;
        } else {
            sentiment = 'neutral';
            confidence = 0.6;
        }

        return { sentiment, confidence, toxicWords };
    }

    processToxicityPredictions(predictions) {
        let maxToxicity = 0;
        let isToxic = false;

        predictions.forEach(prediction => {
            if (prediction.results[0].probabilities[1] > maxToxicity) {
                maxToxicity = prediction.results[0].probabilities[1];
            }
            if (prediction.results[0].match) {
                isToxic = true;
            }
        });

        return {
            isToxic,
            confidence: maxToxicity,
            sentiment: isToxic ? 'toxic' : (maxToxicity > 0.5 ? 'negative' : 'neutral')
        };
    }

    updatePreview(analysis) {
        const { sentiment, originalMessage } = analysis;
        
        // Update sentiment indicator
        const sentimentConfig = {
            positive: { emoji: '😊', text: 'Positive', class: 'positive' },
            neutral: { emoji: '😐', text: 'Neutral', class: 'neutral' },
            negative: { emoji: '😠', text: 'Negative', class: 'negative' },
            toxic: { emoji: '🚫', text: 'Toxic', class: 'toxic' }
        };

        const config = sentimentConfig[sentiment];
        this.sentimentEmoji.textContent = config.emoji;
        this.sentimentText.textContent = config.text;
        this.previewCard.className = `preview-card ${config.class}`;
        this.previewMessage.textContent = originalMessage;
        this.previewMessage.style.fontStyle = 'normal';
    }

    resetPreview() {
        this.sentimentEmoji.textContent = '😐';
        this.sentimentText.textContent = 'Neutral';
        this.previewCard.className = 'preview-card neutral';
        this.previewMessage.textContent = 'Start typing to see live analysis...';
        this.previewMessage.style.fontStyle = 'italic';
        this.sendBtn.disabled = true;
    }
    
    async showSuggestion(analysis) {
        const processedMessage = await this.processMessage(analysis);
        this.suggestedText.textContent = processedMessage.text;
        this.suggestionBox.style.display = 'block';
        this.currentSuggestion = processedMessage.text;
    }
    
    hideSuggestion() {
        this.suggestionBox.style.display = 'none';
        this.currentSuggestion = null;
    }
    
    useSuggestion() {
        if (this.currentSuggestion) {
            this.messageInput.value = this.currentSuggestion;
            this.hideSuggestion();
            this.handleInput(); // Re-analyze the suggested text
        }
    }

    async handleSend() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        this.loading.style.display = 'block';
        
        try {
            const analysis = await this.analyzeMessage(message);
            
            if (analysis.sentiment === 'toxic') {
                this.showWarningModal(analysis);
                return;
            }

            // Process message (apply constructive redaction if needed)
            const processedMessage = await this.processMessage(analysis);
            this.addMessageToChat(processedMessage, analysis.sentiment);
            this.clearInput();
            
        } catch (error) {
            console.error('Error processing message:', error);
        } finally {
            this.loading.style.display = 'none';
        }
    }

    async processMessage(analysis) {
        let processedMessage = analysis.originalMessage;
        let wasModerated = false;

        // Apply constructive redaction for detected toxic words
        if (analysis.toxicWords && analysis.toxicWords.length > 0) {
            for (const toxicWord of analysis.toxicWords) {
                const replacement = await this.findReplacement(toxicWord);
                if (replacement) {
                    // Handle leet speak and special characters
                    const cleanWord = toxicWord.replace(/[^a-zA-Z]/g, '');
                    // Create comprehensive regex for word variations
                    const patterns = [
                        `\\b${this.escapeRegex(toxicWord)}\\b`,
                        `\\b${this.escapeRegex(cleanWord)}\\b`
                    ];
                    
                    // Add leet speak patterns
                    if (toxicWord === 'shit') {
                        patterns.push('\\$#!\\+', 'sh!t', '\\$h!t');
                    }
                    
                    const regex = new RegExp(patterns.join('|'), 'gi');
                    processedMessage = processedMessage.replace(regex, replacement);
                    wasModerated = true;
                }
            }
        }

        return { text: processedMessage, wasModerated };
    }
    
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    async findReplacement(word) {
        const lowerWord = word.toLowerCase();
        
        // Check critical replacements first
        if (this.criticalReplacements[lowerWord]) {
            return this.criticalReplacements[lowerWord];
        }
        
        // Check local replacement dictionary
        if (this.replacements[lowerWord]) {
            const options = this.replacements[lowerWord];
            return options[Math.floor(Math.random() * options.length)];
        }

        // Fallback to Datamuse API for synonyms
        try {
            const response = await fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(lowerWord)}&max=5`);
            const synonyms = await response.json();
            
            if (synonyms.length > 0) {
                // Filter for more positive alternatives
                const positiveSynonyms = synonyms.filter(syn => 
                    !this.keywords.toxic.includes(syn.word) && 
                    !this.keywords.negative.includes(syn.word)
                );
                
                if (positiveSynonyms.length > 0) {
                    return positiveSynonyms[0].word;
                }
            }
        } catch (error) {
            console.error('Datamuse API error:', error);
        }

        // Final fallback
        return 'something';
    }

    showWarningModal(analysis) {
        const toxicWords = analysis.toxicWords || [];
        const wordList = toxicWords.length > 1 ? 
            toxicWords.slice(0, -1).join(', ') + ' and ' + toxicWords.slice(-1) :
            toxicWords[0] || 'inappropriate language';
            
        this.warningText.innerHTML = `
            Warning: Your message contains language that may be harmful: 
            <span class="toxic-word">${wordList}</span><br><br>
            ${toxicWords.length > 1 ? 'These words have' : 'This word has'} been flagged to foster a more positive environment. 
            Please consider rephrasing your message.
        `;
        this.warningModal.style.display = 'block';
    }

    closeModal() {
        this.warningModal.style.display = 'none';
    }

    addMessageToChat(processedMessage, sentiment) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sentiment}`;
        
        if (processedMessage.wasModerated) {
            messageDiv.classList.add('moderated');
            messageDiv.innerHTML = `
                ${processedMessage.text}
                <span class="moderated-icon tooltip" data-tooltip="Moderated for a healthier chat">🛡️</span>
            `;
        } else {
            messageDiv.textContent = processedMessage.text;
        }

        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    clearInput() {
        this.messageInput.value = '';
        this.updateCharCount();
        this.resetPreview();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new SentinelGuard();
});