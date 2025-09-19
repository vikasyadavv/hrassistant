// Interview FAQ Chat Application
const WEBHOOK_URL = 'https://n8n.vikasyadav.live/webhook/hrassistant';

// Get DOM elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');

// Generate session ID
function getSessionId() {
    let sessionId = localStorage.getItem('faqSessionId');
    if (!sessionId) {
        sessionId = 'faq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('faqSessionId', sessionId);
    }
    return sessionId;
}

// Add message to chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    // Handle newlines properly
    const lines = text.replace(/\\n/g, '\n').split('\n');
    lines.forEach((line, index) => {
        if (line.trim()) {
            const p = document.createElement('p');
            p.textContent = line.trim();
            content.appendChild(p);
        }
    });
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message to webhook
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    messageInput.value = '';
    
    // Show typing indicator
    typingIndicator.style.display = 'block';
    sendButton.disabled = true;
    messageInput.disabled = true;
    
    try {
        console.log('Sending to n8n webhook:', WEBHOOK_URL);
        console.log('Payload:', { message, sessionId: getSessionId() });
        
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                sessionId: getSessionId()
            })
        });
        
        console.log('Response Status:', response.status);
        console.log('Response Headers:', [...response.headers.entries()]);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error Response Body:', errorText);
            throw new Error(`Webhook returned ${response.status}: ${response.statusText} - ${errorText}`);
        }
        
        const responseText = await response.text();
        console.log('Raw Response:', responseText);
        console.log('Response Length:', responseText.length);
        
        // Parse response
        let botResponse = 'No response received';
        
        try {
            const json = JSON.parse(responseText);
            console.log('Parsed Response:', json);
            
            // Handle different response formats
            if (Array.isArray(json) && json.length > 0) {
                const item = json[0];
                botResponse = item.output || item.text || item.message || item.response || responseText;
            } else if (json.output) {
                botResponse = json.output;
            } else if (json.text) {
                botResponse = json.text;
            } else if (json.message) {
                botResponse = json.message;
            } else if (json.response) {
                botResponse = json.response;
            } else {
                botResponse = responseText;
            }
        } catch (parseError) {
            console.log('Response is not JSON, using as text');
            botResponse = responseText;
        }
        
        addMessage(botResponse);
        
    } catch (error) {
        console.error('Error:', error);
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        
        // Show the actual error for debugging
        let errorMessage = `Error: ${error.message}`;
        
        // Also provide helpful context
        if (error.message.includes('CORS') || error.message.includes('fetch')) {
            errorMessage += ' (CORS issue - n8n webhook needs CORS headers)';
        } else if (error.message.includes('network') || error.message.includes('Failed to fetch')) {
            errorMessage += ' (Network connectivity issue)';
        } else if (error.message.includes('500')) {
            errorMessage += ' (Server error)';
        }
        
        addMessage(errorMessage);
    } finally {
        // Hide typing indicator and re-enable inputs
        typingIndicator.style.display = 'none';
        sendButton.disabled = false;
        messageInput.disabled = false;
        messageInput.focus();
    }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});

// Focus input on load
document.addEventListener('DOMContentLoaded', () => {
    messageInput.focus();
    console.log('Interview FAQ Chat loaded');
    console.log('Webhook URL:', WEBHOOK_URL);
    console.log('Session ID:', getSessionId());
});
