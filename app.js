// Global State Management
const appState = {
    currentStep: 'landing',
    selectedEvent: null,
    selectedTheme: null,
    customization: {
        background: 'gradient',
        font: 'modern',
        decorations: []
    },
    personalization: {
        recipientName: '',
        relationship: '',
        tone: 2,
        hobbies: [],
        language: 'en',
        message: '',
        designPreference: ''
    },
    enhancements: {
        photo: null,
        aiArtwork: null,
        music: null,
        voice: null,
        soulfulMode: false,
        affirmation: ''
    },
    geminiAPIKey: localStorage.getItem('geminiAPIKey') || ''
};

// Navigation Stack
const navigationStack = [];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    checkAPIKey();
    loadSavedCards();
});

function initializeApp() {
    // Check for saved progress
    const savedProgress = localStorage.getItem('cardProgress');
    if (savedProgress) {
        Object.assign(appState, JSON.parse(savedProgress));
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Load upcoming events from calendar (simulated)
    loadUpcomingEvents();
}

function setupEventListeners() {
    // Tone slider
    const toneSlider = document.getElementById('toneSlider');
    if (toneSlider) {
        toneSlider.addEventListener('input', updateToneDescription);
    }
    
    // Music select
    const musicSelect = document.getElementById('musicSelect');
    if (musicSelect) {
        musicSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                document.getElementById('customMusic').style.display = 'block';
                document.getElementById('customMusic').click();
            }
        });
    }
    
    // Save progress on any input change
    document.addEventListener('input', debounce(saveProgress, 1000));
}

// Step 1: Landing Page Functions
function showEventSelection() {
    navigateTo('eventSelection');
    updateProgressBar(1);
}

function showTemplates() {
    alert('Template browser coming soon!');
}

function showUpcomingEvents() {
    navigateTo('eventSelection');
    updateProgressBar(1);
}

function quickStart(eventType) {
    appState.selectedEvent = eventType;
    applyAutoDesign(eventType);
    navigateTo('personalization');
    updateProgressBar(2);
    setupPersonalizationForm();
}

// Load Upcoming Events (simulated calendar integration)
function loadUpcomingEvents() {
    const upcomingList = document.getElementById('upcomingEventsList');
    if (!upcomingList) return;
    
    // Simulated upcoming events
    const events = [
        { name: "Sarah's Birthday", date: "Feb 15", type: "birthday", days: 11 },
        { name: "Anniversary", date: "Mar 1", type: "anniversary", days: 25 }
    ];
    
    if (events.length === 0) {
        upcomingList.innerHTML = '<p style="color:#999;">No upcoming events. <a href="#" onclick="connectCalendar()">Connect your calendar</a></p>';
    } else {
        upcomingList.innerHTML = events.map(event => `
            <div class="event-suggestion" onclick="selectEvent('${event.type}', '${event.name}')">
                <strong>${event.name}</strong>
                <span>${event.date} (${event.days} days)</span>
            </div>
        `).join('');
    }
}

// Step 2: Event Selection
function selectEvent(eventType, prefillName = '') {
    appState.selectedEvent = eventType;
    if (prefillName) {
        appState.personalization.recipientName = prefillName;
    }
    applyAutoDesign(eventType);
    navigateTo('personalization');
    updateProgressBar(2);
    setupPersonalizationForm();
    saveProgress();
}

// Step 3: Design Selection
function selectTheme(theme) {
    appState.selectedTheme = theme;
    
    // Visual feedback
    document.querySelectorAll('.theme-pack').forEach(pack => {
        pack.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Theme selection is internal now
    saveProgress();
    navigateTo('personalization');
    updateProgressBar(2);
    setupPersonalizationForm();
}

function applyAutoDesign(eventType) {
    const themeMap = {
        birthday: 'playful',
        anniversary: 'elegant',
        engagement: 'elegant',
        wedding: 'elegant',
        babyshower: 'playful',
        graduation: 'professional',
        promotion: 'professional',
        retirement: 'spiritual',
        getwell: 'spiritual',
        thankyou: 'elegant',
        holiday: 'playful',
        custom: 'elegant'
    };

    appState.selectedTheme = themeMap[eventType] || 'elegant';
    appState.customization.background = 'gradient';
    appState.customization.font = 'modern';
    appState.customization.decorations = [];
}

function applyDesignPreference(text) {
    const preference = (text || '').toLowerCase();
    appState.personalization.designPreference = text || '';

    if (preference.includes('minimal') || preference.includes('clean')) {
        appState.selectedTheme = 'professional';
        appState.customization.background = 'solid';
        appState.customization.decorations = [];
        return;
    }

    if (preference.includes('pastel') || preference.includes('soft')) {
        appState.selectedTheme = 'spiritual';
        appState.customization.background = 'gradient';
        appState.customization.decorations = ['sparkles'];
        return;
    }

    if (preference.includes('festive') || preference.includes('party') || preference.includes('confetti')) {
        appState.selectedTheme = 'playful';
        appState.customization.background = 'pattern';
        appState.customization.decorations = ['confetti', 'balloons'];
        return;
    }

    if (preference.includes('floral') || preference.includes('flowers')) {
        appState.selectedTheme = 'elegant';
        appState.customization.background = 'gradient';
        appState.customization.decorations = ['flowers'];
        return;
    }
}

function selectBackground(bgType) {
    appState.customization.background = bgType;
    
    document.querySelectorAll('.option-item').forEach(item => {
        item.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    updateLivePreview();
}

function selectFont(fontType) {
    appState.customization.font = fontType;
    
    document.querySelectorAll('.option-item').forEach(item => {
        item.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    updateLivePreview();
}

function toggleDecoration(decoration) {
    const index = appState.customization.decorations.indexOf(decoration);
    if (index > -1) {
        appState.customization.decorations.splice(index, 1);
    } else {
        appState.customization.decorations.push(decoration);
    }
    updateLivePreview();
}

function updateLivePreview() {
    const preview = document.getElementById('livePreview');
    if (!preview) return;
    
    const { background, font, decorations } = appState.customization;
    const theme = appState.selectedTheme;
    
    // Apply theme
    preview.className = `live-preview-card ${theme}-preview`;
    
    // Apply background
    switch(background) {
        case 'gradient':
            preview.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            break;
        case 'pattern':
            preview.style.background = 'repeating-linear-gradient(45deg, #667eea, #667eea 10px, #764ba2 10px, #764ba2 20px)';
            break;
        case 'solid':
            preview.style.background = '#667eea';
            break;
    }
    
    // Apply font
    const content = preview.querySelector('.preview-content');
    if (content) {
        switch(font) {
            case 'handwritten':
                content.style.fontFamily = 'cursive';
                break;
            case 'modern':
                content.style.fontFamily = 'Arial, sans-serif';
                break;
            case 'classic':
                content.style.fontFamily = 'Times New Roman, serif';
                break;
            case 'playful':
                content.style.fontFamily = 'Comic Sans MS, cursive';
                break;
        }
    }
    
    // Add decorations
    preview.querySelectorAll('.decoration').forEach(d => d.remove());
    decorations.forEach(dec => {
        const elem = document.createElement('div');
        elem.className = `decoration ${dec}`;
        elem.textContent = getDecorationEmoji(dec);
        preview.appendChild(elem);
    });
}

function getDecorationEmoji(decoration) {
    const emojis = {
        balloons: '🎈',
        flowers: '🌸',
        confetti: '🎊',
        sparkles: '✨',
        hearts: '💕',
        stars: '⭐'
    };
    return emojis[decoration] || '';
}

function proceedToPersonalization() {
    if (!appState.selectedTheme) {
        alert('Please select a theme first!');
        return;
    }
    navigateTo('personalization');
    updateProgressBar(3);
    setupPersonalizationForm();
}

// Step 4: Personalization
function setupPersonalizationForm() {
    const additionalInfo = document.getElementById('additionalInfo');
    if (!additionalInfo) return;
    
    // Add event-specific fields
    const eventType = appState.selectedEvent;
    let html = '';
    
    switch(eventType) {
        case 'birthday':
            html = '<label>Age</label><input type="number" id="age" placeholder="Age turning">';
            break;
        case 'anniversary':
            html = '<label>Years Together</label><input type="number" id="years" placeholder="How many years?">';
            break;
        case 'promotion':
            html = '<label>New Position</label><input type="text" id="jobTitle" placeholder="e.g., Senior Manager">';
            break;
        case 'wedding':
            html = '<label>Partner\'s Name</label><input type="text" id="partnerName" placeholder="Partner\'s name">';
            break;
    }
    
    additionalInfo.innerHTML = '<div class="form-group">' + html + '</div>';
}

function updateToneDescription() {
    const slider = document.getElementById('toneSlider');
    const description = document.getElementById('toneDescription');
    if (!slider || !description) return;
    
    const descriptions = {
        1: 'Professional and respectful messaging',
        2: 'Warm and heartfelt expressions',
        3: 'Fun and playful communication',
        4: 'Deeply poetic and emotional'
    };
    
    description.textContent = descriptions[slider.value];
    appState.personalization.tone = parseInt(slider.value);
}

// AI Message Generation
async function generateAIMessages() {
    if (!appState.geminiAPIKey) {
        showAPIConfig();
        return;
    }
    
    // Show loading
    const btn = event.currentTarget;
    const originalText = btn.textContent;
    btn.textContent = '⏳ Generating...';
    btn.disabled = true;
    
    try {
        // Gather data
        const name = document.getElementById('recipientName').value;
        if (!name) {
            alert('Please enter the recipient\'s name first!');
            return;
        }
        
        const relationship = 'friend';
        const tone = 'warm';
        const hobbies = Array.from(document.querySelectorAll('.hobby-badge input:checked')).map(cb => cb.value);
        const language = document.getElementById('languageSelect').value;
        
        // Generate 3 different messages in a single request to reduce quota usage
        const messages = await generateMessagesBatch(name, relationship, tone, hobbies, language);
        
        displayAISuggestions(messages);
        
    } catch (error) {
        console.error('Error generating messages:', error);
        let errorMessage = 'Failed to generate messages.\n\n';
        
        if (error.message.includes('API_KEY_INVALID')) {
            errorMessage += 'Your API key appears to be invalid. Please check it and try again.';
        } else if (error.message.includes('quota')) {
            errorMessage += 'You may have exceeded your API quota. Please try again later.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
            errorMessage += 'Network error. Please check your internet connection.';
        } else {
            errorMessage += 'Error: ' + error.message + '\n\nTroubleshooting:\n1. Verify your API key is correct\n2. Check your internet connection\n3. Make sure you have API quota remaining\n4. Try refreshing the page';
        }
        
        alert(errorMessage);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

async function generateMessage(name, relationship, tone, hobbies, language, variant) {
    const eventType = appState.selectedEvent;
    
    const prompt = `Generate a ${tone} ${eventType} card message for ${name}, who is my ${relationship}. 
${hobbies.length > 0 ? 'We enjoy ' + hobbies.join(', ') + ' together.' : ''}
Generate variant ${variant} in ${language} language.
Keep it heartfelt, concise (100-150 words), and appropriate for the relationship and event.`;
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${appState.geminiAPIKey}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 500
                }
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
        }
        
        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response format from API');
        }
        
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error generating message:', error);
        throw error;
    }
}

async function generateMessagesBatch(name, relationship, tone, hobbies, language) {
    const eventType = appState.selectedEvent;
    const hobbyText = hobbies.length > 0 ? `Include these hobbies: ${hobbies.join(', ')}.` : 'No hobbies provided. Keep it generally warm.';
    const prompt = `Generate 3 distinct heart-warming ${eventType} card messages for ${name}.
${hobbyText}
Language: ${language}.
Each message should be kind, heartfelt, and concise (80-130 words).
Return ONLY a JSON array of 3 strings.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${appState.geminiAPIKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.9,
                topK: 1,
                topP: 1,
                maxOutputTokens: 900
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let messages = [];
    try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
            messages = parsed.map(String);
        }
    } catch (err) {
        const lines = text
            .split('\n')
            .map(line => line.replace(/^\s*[\d\-\*\.)]+\s*/, '').trim())
            .filter(Boolean);
        messages = lines.slice(0, 3);
    }

    if (messages.length < 3) {
        const fallback = text.trim();
        while (messages.length < 3) {
            messages.push(fallback || '');
        }
    }

    return messages.slice(0, 3);
}

async function summarizeMessage() {
    const currentMessage = document.getElementById('customMessage').value;
    if (!currentMessage) {
        alert('Please write a message first!');
        return;
    }

    if (!appState.geminiAPIKey) {
        showAPIConfig();
        return;
    }

    try {
        const prompt = `Summarize this message into a short, heart-warming version (2-3 sentences max): "${currentMessage}"`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${appState.geminiAPIKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.5,
                    maxOutputTokens: 200
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text;
        document.getElementById('customMessage').value = summary;
    } catch (error) {
        console.error('Error summarizing message:', error);
        alert('Failed to summarize. Please check your API key.');
    }
}

function startSpeechToText() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert('Speech-to-text is not supported in this browser. Please type your message instead.');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = document.getElementById('languageSelect')?.value || 'en';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const textarea = document.getElementById('customMessage');
        textarea.value = (textarea.value ? textarea.value + ' ' : '') + transcript;
    };

    recognition.onerror = () => {
        alert('Speech-to-text failed. Please try again or type your message.');
    };

    recognition.start();
}

async function suggestMessage() {
    const currentMessage = document.getElementById('customMessage').value.trim();
    const name = document.getElementById('recipientName').value.trim();
    const hobbies = Array.from(document.querySelectorAll('.hobby-badge input:checked')).map(cb => cb.value);
    const language = document.getElementById('languageSelect')?.value || 'en';

    if (!appState.geminiAPIKey) {
        showAPIConfig();
        return;
    }

    if (!name) {
        alert('Please enter the recipient\'s name first!');
        return;
    }

    try {
        const hobbyText = hobbies.length > 0 ? `Include these hobbies: ${hobbies.join(', ')}.` : 'No hobbies provided.';
        const prompt = currentMessage
            ? `Improve this message to be more heart-warming, concise, and clear. Keep the meaning the same. Message: "${currentMessage}"`
            : `Write a heart-warming ${appState.selectedEvent} card message for ${name}. ${hobbyText} Keep it concise (80-130 words).`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${appState.geminiAPIKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const suggestion = data.candidates[0].content.parts[0].text;
        document.getElementById('customMessage').value = suggestion;
    } catch (error) {
        console.error('Error suggesting message:', error);
        alert('Failed to generate AI suggestion. Please check your API key.');
    }
}

async function generateCard() {
    const name = document.getElementById('recipientName').value.trim();
    const language = document.getElementById('languageSelect')?.value || 'en';
    const hobbies = Array.from(document.querySelectorAll('.hobby-badge input:checked')).map(cb => cb.value);
    const messageBox = document.getElementById('customMessage');
    const designPreference = document.getElementById('designPreference')?.value || '';

    if (!name) {
        alert('Please enter the recipient\'s name first!');
        return;
    }

    if (!messageBox.value.trim()) {
        if (!appState.geminiAPIKey) {
            alert('Please write a message or add your API key to generate one.');
            return;
        }

        try {
            const [msg] = await generateMessagesBatch(name, 'friend', 'warm', hobbies, language);
            messageBox.value = msg || '';
        } catch (error) {
            console.error('Error generating message for card:', error);
            alert('Failed to generate message. Please try again.');
            return;
        }
    }

    if (designPreference) {
        applyDesignPreference(designPreference);
    }

    appState.personalization.message = messageBox.value.trim();
    renderFinalCard();

    const previewSection = document.getElementById('preview');
    if (previewSection) {
        previewSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function getToneName(toneValue) {
    const tones = { 1: 'formal', 2: 'warm', 3: 'funny', 4: 'poetic' };
    return tones[toneValue] || 'warm';
}

function displayAISuggestions(messages) {
    const container = document.getElementById('messageSuggestions');
    const section = document.getElementById('aiSuggestions');
    
    container.innerHTML = messages.map((msg, idx) => `
        <div class="message-suggestion" onclick="selectMessage(${idx})">
            <span class="suggestion-label">${['Option 1', 'Option 2', 'Option 3'][idx]}</span>
            <p>${msg}</p>
        </div>
    `).join('');
    
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth' });
    
    appState.aiSuggestions = messages;
}

function selectMessage(index) {
    const message = appState.aiSuggestions[index];
    document.getElementById('customMessage').value = message;
    appState.personalization.message = message;
    
    // Visual feedback
    document.querySelectorAll('.message-suggestion').forEach((elem, idx) => {
        elem.classList.toggle('selected', idx === index);
    });
}

async function refineMessage() {
    const currentMessage = document.getElementById('customMessage').value;
    if (!currentMessage) {
        alert('Please enter a message first!');
        return;
    }
    
    if (!appState.geminiAPIKey) {
        showAPIConfig();
        return;
    }
    
    const btn = event.currentTarget;
    btn.textContent = '⏳ Refining...';
    btn.disabled = true;
    
    try {
        const prompt = `Improve and refine this message while keeping the core sentiment: "${currentMessage}"`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${appState.geminiAPIKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        const refined = data.candidates[0].content.parts[0].text;
        document.getElementById('customMessage').value = refined;
        
    } catch (error) {
        console.error('Error refining message:', error);
        alert('Failed to refine message. Please check your API key and connection.');
    } finally {
        btn.textContent = '🔄 Refine with AI';
        btn.disabled = false;
    }
}

function speakMessage() {
    const message = document.getElementById('customMessage').value;
    if (!message) {
        alert('No message to read!');
        return;
    }
    
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = document.getElementById('languageSelect').value;
    speechSynthesis.speak(utterance);
}

async function translateMessage() {
    const message = document.getElementById('customMessage').value;
    const targetLang = prompt('Enter target language code (e.g., es, fr, de):');
    
    if (!message || !targetLang) return;
    
    if (!appState.geminiAPIKey) {
        showAPIConfig();
        return;
    }
    
    try {
        const prompt = `Translate this message to ${targetLang}: "${message}"`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${appState.geminiAPIKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 500
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        const translated = data.candidates[0].content.parts[0].text;
        document.getElementById('customMessage').value = translated;
        
    } catch (error) {
        console.error('Translation error:', error);
        alert('Translation failed! Please check your API key.');
    }
}

function proceedToEnhancements() {
    const message = document.getElementById('customMessage').value;
    if (!message) {
        alert('Please generate or write a message first!');
        return;
    }
    appState.personalization.message = message;
    navigateTo('enhancements');
    updateProgressBar(3);
}

// Step 5: Enhancements
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        appState.enhancements.photo = e.target.result;
        document.getElementById('photoPreview').innerHTML = `
            <img src="${e.target.result}" style="max-width:100%; border-radius:10px; margin-top:15px;">
        `;
    };
    reader.readAsDataURL(file);
}

async function generateAIArtwork() {
    const prompt = document.getElementById('artworkPrompt').value;
    if (!prompt) {
        alert('Please describe the artwork you want!');
        return;
    }
    
    alert('AI Artwork generation will be integrated with DALL-E or Stable Diffusion. For now, showing placeholder.');
    
    // Placeholder: In production, integrate with image generation API
    document.getElementById('artworkPreview').innerHTML = `
        <div style="padding:40px; background:#f0f0f0; text-align:center; border-radius:10px; margin-top:15px;">
            <p>🎨 Generated: ${prompt}</p>
        </div>
    `;
}

function previewMusic() {
    const selected = document.getElementById('musicSelect').value;
    const player = document.getElementById('musicPlayer');
    
    if (selected && selected !== 'custom') {
        player.innerHTML = `<p style="margin-top:15px;">🎵 Playing: ${selected}</p>`;
        appState.enhancements.music = selected;
    }
}

function recordVoice() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                alert('Voice recording feature coming soon! For now, use the file upload.');
            })
            .catch(err => {
                alert('Microphone access denied.');
            });
    } else {
        alert('Voice recording not supported in this browser.');
    }
}

function toggleSoulfulMode() {
    const checked = document.getElementById('soulfulMode').checked;
    appState.enhancements.soulfulMode = checked;
    document.getElementById('soulfulContent').style.display = checked ? 'block' : 'none';
}

async function generateAffirmation() {
    if (!appState.geminiAPIKey) {
        showAPIConfig();
        return;
    }
    
    try {
        const prompt = 'Generate an inspiring, positive affirmation or wisdom quote suitable for a greeting card (20-30 words).';
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${appState.geminiAPIKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 200
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        const quote = data.candidates[0].content.parts[0].text;
        document.getElementById('affirmation').value = quote;
        appState.enhancements.affirmation = quote;
        
    } catch (error) {
        console.error('Error generating affirmation:', error);
        alert('Failed to generate affirmation. Please check your API key.');
    }
}

function proceedToPreview() {
    navigateTo('preview');
    updateProgressBar(4);
    renderFinalCard();
}

// Step 6: Preview
function renderFinalCard() {
    const card = document.getElementById('finalCard');
    if (!card) return;
    
    const { recipientName, message, designPreference } = appState.personalization;
    const { photo, soulfulMode, affirmation } = appState.enhancements;
    const { background, font, decorations } = appState.customization;
    const theme = appState.selectedTheme;
    
    // Apply styling
    card.className = `final-card ${theme}-theme`;
    
    switch(font) {
        case 'handwritten': card.style.fontFamily = 'cursive'; break;
        case 'modern': card.style.fontFamily = 'Arial, sans-serif'; break;
        case 'classic': card.style.fontFamily = 'Times New Roman, serif'; break;
        case 'playful': card.style.fontFamily = 'Comic Sans MS, cursive'; break;
    }
    
    // Build content
    let html = '';
    
    // Photo
    if (photo) {
        html += `<div style="text-align:center; margin-bottom:30px;">
            <img src="${photo}" style="max-width:100%; max-height:300px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.2);">
        </div>`;
    }
    
    // Main message
    html += `<h2 style="text-align:center; margin-bottom:25px; font-size:2rem;">
        ${getEventIcon(appState.selectedEvent)} ${getEventTitle(appState.selectedEvent)}
    </h2>`;

    if (designPreference) {
        html += `<div style="text-align:center; margin-bottom:15px; font-size:0.95rem; opacity:0.75;">
            Style: ${designPreference}
        </div>`;
    }
    
    html += `<div style="font-size:1.2rem; line-height:1.8; margin-bottom:30px; text-align:center;">
        ${message}
    </div>`;
    
    // Signature
    html += `<div style="text-align:right; font-style:italic; margin-top:30px;">
        With love,<br>Your Name
    </div>`;
    
    // Soulful mode
    if (soulfulMode && affirmation) {
        html += `<div style="margin-top:40px; padding:20px; background:rgba(255,255,255,0.3); border-radius:15px; text-align:center; font-style:italic;">
            ✨ ${affirmation} ✨
        </div>`;
    }
    
    // Footer
    html += `<div style="margin-top:50px; text-align:center; font-size:0.9rem; opacity:0.7;">
        💕 Made with Soulvest Card Generator 💕
    </div>`;
    
    card.innerHTML = html;
    
    // Add decorations
    addCardDecorations(card, decorations);
}

function addCardDecorations(card, decorations) {
    decorations.forEach((dec, idx) => {
        const elem = document.createElement('div');
        elem.className = dec;
        elem.style.position = 'absolute';
        elem.style.fontSize = '2rem';
        elem.textContent = getDecorationEmoji(dec);
        elem.style.left = `${(idx * 20) % 80}%`;
        elem.style.top = `${(idx * 15) % 70}%`;
        card.style.position = 'relative';
        card.appendChild(elem);
    });
}

function getEventIcon(event) {
    const icons = {
        birthday: '🎂',
        anniversary: '💍',
        wedding: '💒',
        graduation: '🎓',
        promotion: '🚀',
        holiday: '🎄',
        thankyou: '🙏'
    };
    return icons[event] || '🎉';
}

function getEventTitle(event) {
    const titles = {
        birthday: 'Happy Birthday!',
        anniversary: 'Happy Anniversary!',
        wedding: 'Congratulations!',
        graduation: 'Congratulations Graduate!',
        promotion: 'Congratulations on Your Promotion!',
        holiday: 'Happy Holidays!',
        thankyou: 'Thank You!'
    };
    return titles[event] || 'Celebrate!';
}

function toggleFullscreen() {
    const container = document.getElementById('cardPreviewContainer');
    if (!document.fullscreenElement) {
        container.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function toggleFormat() {
    const card = document.getElementById('finalCard');
    card.style.width = card.style.width === '800px' ? '600px' : '800px';
}

function playAnimations() {
    const card = document.getElementById('finalCard');
    
    // Add confetti animation
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.background = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#667eea'][Math.floor(Math.random() * 4)];
        card.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

function provideFeedback(type) {
    console.log('User feedback:', type);
    
    if (type === 'edit') {
        goBack();
    } else {
        alert('Thank you for your feedback! 💕');
        if (type === 'love') {
            proceedToShare();
        }
    }
}

function proceedToShare() {
    navigateTo('share');
    updateProgressBar(5);
}

// Step 7: Share & Deliver
async function shareToWhatsApp() {
    const message = appState.personalization.message;
    const text = encodeURIComponent(`${message}\n\n💕 Created with Soulvest Card Generator`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function shareToInstagram() {
    alert('Instagram sharing will open after downloading the card image. Please save and share manually on Instagram.');
    downloadPNG();
}

function shareToLinkedIn() {
    alert('LinkedIn sharing coming soon! Download the card and share manually for now.');
    downloadPNG();
}

function shareViaEmail() {
    const subject = encodeURIComponent(`${getEventTitle(appState.selectedEvent)} Card`);
    const body = encodeURIComponent(appState.personalization.message);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

async function downloadPNG() {
    const card = document.getElementById('finalCard');
    
    // Import html2canvas if not already loaded
    if (typeof html2canvas === 'undefined') {
        alert('Loading... please try again in a moment.');
        return;
    }
    
    try {
        const canvas = await html2canvas(card, {
            backgroundColor: '#ffffff',
            scale: 3,
            logging: false,
            useCORS: true,
            width: 1200,
            height: 1200
        });
        
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `soulvest-card-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    } catch (error) {
        console.error('Error generating image:', error);
        alert('Failed to generate image. Please try again.');
    }
}

function downloadPDF() {
    alert('PDF download feature coming soon! For now, use "Print to PDF" from your browser.');
    window.print();
}

function downloadHD() {
    alert('HD download feature will generate a 2400x2400px image. Coming soon!');
    downloadPNG(); // Fallback to PNG for now
}

function generateQRCode() {
    const container = document.getElementById('qrCodeContainer');
    container.innerHTML = '';
    
    // Generate shareable link (in production, save card to cloud and get link)
    const shareLink = 'https://soulvest.com/cards/' + Date.now();
    
    if (typeof QRCode !== 'undefined') {
        new QRCode(container, {
            text: shareLink,
            width: 200,
            height: 200
        });
    } else {
        container.innerHTML = '<p>QR Code library loading...</p>';
    }
}

function saveToFavorites() {
    const title = document.getElementById('cardTitle').value || 'Untitled Card';
    
    const savedCards = JSON.parse(localStorage.getItem('savedCards') || '[]');
    savedCards.push({
        id: Date.now(),
        title,
        ...appState,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('savedCards', JSON.stringify(savedCards));
    
    document.getElementById('savedMessage').style.display = 'block';
    setTimeout(() => {
        document.getElementById('savedMessage').style.display = 'none';
    }, 3000);
}

function loadSavedCards() {
    // Load from localStorage
    const savedCards = JSON.parse(localStorage.getItem('savedCards') || '[]');
    console.log(`Loaded ${savedCards.length} saved cards`);
}

function createAnother() {
    if (confirm('Create a new card? Current progress will be saved.')) {
        saveProgress();
        location.reload();
    }
}

function viewCollection() {
    alert('Card collection viewer coming soon!');
}

// API Configuration
function checkAPIKey() {
    if (!appState.geminiAPIKey) {
        const banner = document.getElementById('apiConfigBanner');
        if (banner) banner.style.display = 'flex';
    }
}

function showAPIConfig() {
    const modal = document.getElementById('apiModal');
    modal.classList.add('show');
}

function closeAPIModal() {
    const modal = document.getElementById('apiModal');
    modal.classList.remove('show');
}

function saveAPIKey() {
    const key = document.getElementById('apiKeyInput').value.trim();
    if (!key) {
        alert('Please enter an API key!');
        return;
    }
    
    appState.geminiAPIKey = key;
    localStorage.setItem('geminiAPIKey', key);
    
    const banner = document.getElementById('apiConfigBanner');
    if (banner) banner.style.display = 'none';
    
    closeAPIModal();
    alert('API key saved successfully! ✨');
}

// Navigation & Utility Functions
function navigateTo(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show target view
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
        window.scrollTo(0, 0);
    }
    
    // Update navigation stack
    navigationStack.push(appState.currentStep);
    appState.currentStep = viewId;
    
    // Show/hide progress bar
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.display = viewId === 'landing' ? 'none' : 'block';
    }
}

function goBack() {
    if (navigationStack.length > 0) {
        const previousView = navigationStack.pop();
        
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        const targetView = document.getElementById(previousView);
        if (targetView) {
            targetView.classList.add('active');
            window.scrollTo(0, 0);
        }
        
        appState.currentStep = previousView;
        
        // Update progress bar
        const stepMap = {
            landing: 0,
            eventSelection: 1,
            personalization: 2,
            enhancements: 3,
            preview: 4,
            share: 5
        };
        updateProgressBar(stepMap[previousView] || 0);
    }
}

function updateProgressBar(step) {
    document.querySelectorAll('.progress-step').forEach((elem, idx) => {
        elem.classList.remove('active', 'completed');
        if (idx + 1 === step) {
            elem.classList.add('active');
        } else if (idx + 1 < step) {
            elem.classList.add('completed');
        }
    });
}

function saveProgress() {
    localStorage.setItem('cardProgress', JSON.stringify(appState));
}

function debounce(func, wait) {
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

function connectCalendar() {
    alert('Calendar integration coming soon! This will sync with Google Calendar, Outlook, and Apple Calendar.');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAPIModal();
    }
});
