// Combined chatbot.js file with OpenRouter integration
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const chatIcon = document.getElementById('chat-icon');
  const chatContainer = document.getElementById('chat-container');
  const closeBtn = document.getElementById('close-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const minimizeBtn = document.getElementById('minimize-btn');
  const sendBtn = document.getElementById('send-btn');
  const userInput = document.getElementById('user-input');
  const chatMessages = document.getElementById('chat-messages');
  
  // OpenRouter API Key - Replace with your actual key
  const OPENROUTER_API_KEY = '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';
  const SITE_URL = window.location.href; // Your site URL
  const SITE_NAME = "Bioline"; // Your site name
  
  // Hide minimize button initially (only visible in fullscreen)
  minimizeBtn.style.display = 'none';
  
  // Make sure chat container is initially hidden
  chatContainer.style.display = 'none';
  
  // Toggle chat container when icon is clicked
  chatIcon.addEventListener('click', function() {
    console.log('Chat icon clicked'); // Add this for debugging
    chatContainer.style.display = 'flex';
    chatIcon.style.display = 'none';
  });
  
  // Close chat when close button is clicked
  closeBtn.addEventListener('click', function() {
    chatContainer.style.display = 'none';
    chatIcon.style.display = 'flex';
  });
  
  // Toggle fullscreen
  fullscreenBtn.addEventListener('click', function() {
    chatContainer.classList.add('fullscreen');
    fullscreenBtn.style.display = 'none';
    minimizeBtn.style.display = 'block';
  });
  
  // Minimize from fullscreen
  minimizeBtn.addEventListener('click', function() {
    chatContainer.classList.remove('fullscreen');
    fullscreenBtn.style.display = 'block';
    minimizeBtn.style.display = 'none';
  });
  
  // Send message when send button is clicked
  sendBtn.addEventListener('click', sendMessage);
  
  // Send message when Enter is pressed (Shift+Enter for new line)
  userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // Function to send message
  function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
      // Add user message to chat
      addMessage('user', message);
      
      // Clear input
      userInput.value = '';
      
      // Get response from AI
      getBotResponse(message);
    }
  }
  
  // Add a message to the chat (type: 'user' or 'bot')
  function addMessage(type, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(type === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Get response from AI API
  async function getBotResponse(message) {
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('bot-message', 'typing-indicator');
    typingIndicator.textContent = 'Se scrie...';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    try {
      const response = await callOpenRouterAPI(message);
      
      // Log the exact response for debugging
      console.log('Final response text:', response);
      
      // Remove typing indicator
      chatMessages.removeChild(typingIndicator);
      
      // Check if response is actually defined and not empty
      if (response && response.trim() !== '') {
        // Add bot response
        addMessage('bot', response);
      } else {
        // If response is empty, use a fallback
        addMessage('bot', "Îmi pare rău, nu am putut genera un răspuns. Te rog să încerci din nou.");
      }
    } catch (error) {
      console.error('Error getting response:', error);
      // Remove typing indicator
      chatMessages.removeChild(typingIndicator);
      // Add error message
      addMessage('bot', 'Îmi pare rău, am întâmpinat o problemă. Te rog să încerci din nou.');
    }
  }
  
  // Call OpenRouter API with Deepseek model
  // Update the callOpenRouterAPI function to better handle empty responses and add a fallback model
// Call OpenRouter API with Gemini model (with optional image support)
async function callOpenRouterAPI(message, imageUrl = null) {
  try {
    console.log('Calling OpenRouter API with message:', message);
    
    // Create the messages array
    const messages = [
      {
        role: 'system',
        content: 'Ești un asistent virtual pentru un site despre anatomia umană numit BioBot. ' +
                 'Răspunzi în română. Ajuți vizitatorii să găsească informații despre scheletul uman și ' +
                 'sistemul muscular. Răspunsurile tale sunt concise, prietenoase și informative.'
      }
    ];
    
    // If there's an image, add it to the user message as multimodal content
    if (imageUrl) {
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: message
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl
            }
          }
        ]
      });
    } else {
      // Regular text message
      messages.push({
        role: 'user',
        content: message
      });
    }
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        "Authorization": "Bearer " + OPENROUTER_API_KEY,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
        messages: messages,
        max_tokens: 200,
        temperature: 0.8
      })
    });

    // Rest of the function remains the same
    const data = await response.json();
    console.log('API response data:', data);
    
    if (data.error) {
      console.error('API returned an error:', data.error);
      return getFallbackResponse(message);
    }
    
    if (data.choices && data.choices.length > 0) {
      console.log('First choice object:', data.choices[0]);
      
      if (data.choices[0].message && data.choices[0].message.content) {
        return data.choices[0].message.content;
      } else if (data.choices[0].text) {
        return data.choices[0].text;
      } else if (data.choices[0].content) {
        return data.choices[0].content;
      } else {
        console.error('Empty content in response:', data.choices[0]);
        return getFallbackResponse(message);
      }
    } else {
      console.error('No choices in API response:', data);
      return getFallbackResponse(message);
    }
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    return getFallbackResponse(message);
  }
}
  function getFallbackResponse(message) {
    const responses = [
      "Bună! Sunt asistentul virtual Bioline Pot să te ajut cu informații despre anatomia umană.",
      "Poți să mă întrebi despre sistemul muscular sau scheletul uman.",
      "Pentru informații mai detaliate, te rugăm să consulți secțiunile relevante de pe site.",
      "Nu sunt sigur cum să răspund la această întrebare. Poți să reformulezi?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Test API function that you can call from the browser console
  window.testOpenRouterAPI = async function() {
    try {
      console.log("Testing OpenRouter API...");
      const message = "Ce sunt mușchii?";
      const response = await callOpenRouterAPI(message);
      console.log("API test successful! Response:", response);
      return true;
    } catch (error) {
      console.error("API test failed:", error);
      return false;
    }
  }
  
  // Check if chat icon exists and log its status
  if (!chatIcon) {
    console.error('Chat icon element not found! Check your HTML for an element with id="chat-icon"');
  } else {
    console.log('Chat icon element found and event listener attached');
  }
});