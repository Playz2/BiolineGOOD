// Improved chatbot.js file with OpenRouter integration
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
  const OPENROUTER_API_KEY = '#';
  const SITE_URL = window.location.href; // Your site URL
  const SITE_NAME = "Bioline"; // Your site name
  
  // Track API usage to prevent rate limiting
  let lastApiCallTime = 0;
  const MIN_TIME_BETWEEN_CALLS = 1000; // Min 1 second between API calls
  let apiCallsInLastMinute = 0;
  const MAX_CALLS_PER_MINUTE = 5; // Adjust based on your API limits
  
  // Store conversation history for context (up to 5 exchanges)
  let conversationHistory = [];
  const MAX_HISTORY_LENGTH = 5;
  
  // Hide minimize button initially (only visible in fullscreen)
  minimizeBtn.style.display = 'none';
  
  // Make sure chat container is initially hidden
  chatContainer.style.display = 'none';
  
  // Toggle chat container when icon is clicked
  chatIcon.addEventListener('click', function() {
    console.log('Chat icon clicked');
    chatContainer.style.display = 'flex';
    chatIcon.style.display = 'none';
    
    // Add welcome message if chat is empty
    if (chatMessages.children.length === 0) {
      addMessage('bot', 'Bună! Sunt asistentul virtual Bioline. Cu ce te pot ajuta astăzi despre anatomia umană?');
    }
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

  // Add message to chat container
  function addMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${type}-message`);
    
    // Create avatar for bot messages
    if (type === 'bot') {
      const avatar = document.createElement('div');
      avatar.classList.add('bot-avatar');
      messageDiv.appendChild(avatar);
    }
    
    const textDiv = document.createElement('div');
    textDiv.classList.add('message-text');
    textDiv.innerHTML = content;
    messageDiv.appendChild(textDiv);
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Send message function
  async function sendMessage() {
    const message = userInput.value.trim();
    
    if (!message) return; // Don't send empty messages
    
    // Add user message to chat
    addMessage('user', message);
    
    // Clear input field
    userInput.value = '';
    
    // Add loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'bot-message', 'loading');
    const loadingText = document.createElement('div');
    loadingText.classList.add('message-text');
    loadingText.textContent = 'Se încarcă...';
    loadingDiv.appendChild(loadingText);
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    try {
      // Rate limiting checks
      const now = Date.now();
      if (now - lastApiCallTime < MIN_TIME_BETWEEN_CALLS) {
        await new Promise(resolve => setTimeout(resolve, MIN_TIME_BETWEEN_CALLS));
      }
      
      if (apiCallsInLastMinute >= MAX_CALLS_PER_MINUTE) {
        chatMessages.removeChild(loadingDiv);
        addMessage('bot', 'Îmi pare rău, am primit prea multe mesaje. Te rog să încerci din nou în câteva secunde.');
        
        // Reset counter after waiting
        setTimeout(() => {
          apiCallsInLastMinute = 0;
        }, 60000);
        
        return;
      }
      
      // Update API call tracking
      lastApiCallTime = Date.now();
      apiCallsInLastMinute++;
      setTimeout(() => {
        apiCallsInLastMinute--;
      }, 60000);
      
      // Add message to conversation history
      conversationHistory.push({ role: 'user', content: message });
      if (conversationHistory.length > MAX_HISTORY_LENGTH * 2) {
        conversationHistory = conversationHistory.slice(-MAX_HISTORY_LENGTH * 2);
      }
      
      // Get response from model
      const response = await testGemma3(message);
      
      // Remove loading indicator
      chatMessages.removeChild(loadingDiv);
      
      if (response.success) {
        // Add response to chat
        addMessage('bot', response.content);
        
        // Add to conversation history
        conversationHistory.push({ role: 'assistant', content: response.content });
      } else {
        // Show error message
        addMessage('bot', 'Îmi pare rău, am întâmpinat o problemă. Te rog să încerci din nou.');
        console.error('API error:', response.error || response.message);
      }
    } catch (error) {
      // Remove loading indicator
      chatMessages.removeChild(loadingDiv);
      
      // Show error message
      addMessage('bot', 'Îmi pare rău, am întâmpinat o problemă. Te rog să încerci din nou.');
      console.error('Error sending message:', error);
    }
  }
  
  async function testGemma3(message) {
    console.log('Calling Gemma 3 27B with message:', message);
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          "Authorization": "Bearer " + OPENROUTER_API_KEY,
          "HTTP-Referer": SITE_URL,
          "X-Title": SITE_NAME,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-maverick:free',
          messages: [
            {
              role: 'system',
              content: 'Ești un asistent virtual pentru un site despre anatomia umană numit BioBot. ' +
                       'Răspunzi în română. Ajuți vizitatorii să găsească informații despre scheletul uman, ' +
                       'sistemul muscular și alte aspecte ale anatomiei umane. ' +
                       'Răspunsurile tale sunt concise (maximum 3-4 propoziții), prietenoase și informative. ' +
                       'Folosești terminologie medicală corectă dar accesibilă pentru publicul general. ' +
                       'IMPORTANT: Nu arăta procesul tău de gândire sau raționament. Oferă doar răspunsul final, clar și concis.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 800,
          temperature: 0.7,
          top_p: 0.95
        })
      });
      
      const data = await response.json();
      console.log('Gemma 3 API Response:', data);
      
      if (data.error) {
        console.error('Gemma 3 API Error:', data.error);
        return {
          success: false,
          error: data.error,
          message: 'API returned an error'
        };
      }
      
      if (data.choices && data.choices.length > 0) {
        let content = '';
        
        if (data.choices[0].message && data.choices[0].message.content) {
          content = data.choices[0].message.content;
        } else if (data.choices[0].text) {
          content = data.choices[0].text;
        } else if (data.choices[0].content) {
          content = data.choices[0].content;
        }
        
        // Clean up the response to remove internal reasoning
        content = cleanModelResponse(content);
        
        return {
          success: true,
          content: content,
          usage: data.usage || {},
          model: data.model || 'meta-llama/llama-4-maverick:free'
        };
      } else {
        return {
          success: false,
          message: 'No choices in response',
          raw: data
        };
      }
    } catch (error) {
      console.error('Error in Gemma 3 call:', error);
      return {
        success: false,
        error: error.toString(),
        message: 'Exception during API call'
      };
    }
  }

  // Clean up model response to remove internal reasoning
  function cleanModelResponse(response) {
    // If the response contains internal reasoning patterns, extract the final answer
    
    // Pattern 1: Response ends with a clear statement after "The answer is..."
    const answerPattern = /(?:Răspunsul este|The answer is)[^\.]*(.*?)(?:\.|$)/i;
    const answerMatch = response.match(answerPattern);
    
    // Pattern 2: Look for the last sentence that doesn't include reasoning words
    const sentences = response.split(/\.\s+/);
    let cleanedSentences = sentences.filter(sentence => 
      !sentence.match(/(?:I'll check|But I'll|Let me|I think|Actually|However|But sometimes|might be)/i)
    );
    
    // If we have a clean final answer from pattern 1
    if (answerMatch && answerMatch[1] && answerMatch[1].length > 10) {
      return answerMatch[1].trim() + '.';
    }
    
    // If we have filtered sentences that make sense
    if (cleanedSentences.length > 0) {
      // Take up to 2 sentences max for conciseness
      if (cleanedSentences.length > 2) {
        cleanedSentences = cleanedSentences.slice(0, 2);
      }
      return cleanedSentences.join('. ') + '.';
    }
    
    // If all else fails, take the first 2-3 sentences from the original response
    if (sentences.length > 0) {
      const firstFew = sentences.slice(0, Math.min(2, sentences.length));
      return firstFew.join('. ') + '.';
    }
    
    // Fallback
    return response;
  }
  
  // Helper function to display the results in a nice format
  function displayPhi4TestResult(result) {
    if (result.success) {
      console.log('%c Phi 4 Test Successful! ', 'background: #4CAF50; color: white; padding: 5px; border-radius: 5px;');
      console.log('Response:', result.content);
      console.log('Tokens used:', result.usage);
    } else {
      console.log('%c Phi 4 Test Failed! ', 'background: #F44336; color: white; padding: 5px; border-radius: 5px;');
      console.log('Error:', result.error || result.message);
      console.log('Raw response:', result.raw);
    }
  }

  // Example anatomy questions for testing
  const testQuestions = [
    "Ce este sistemul muscular?",
    "Câte oase are corpul uman?",
    "Care este funcția inimii?",
    "Ce este coloana vertebrală?",
    "Cum funcționează plămânii?"
  ];

  // Run a batch test of all questions
  async function runGemma3BatchTest() {
    console.log('%c Starting Gemma 3 Batch Test ', 'background: #2196F3; color: white; padding: 5px; border-radius: 5px;');
    
    for (let i = 0; i < testQuestions.length; i++) {
      console.log(`\nTest ${i+1}/${testQuestions.length}: "${testQuestions[i]}"`);
      const result = await testGemma3(testQuestions[i]);
      displayGemma3TestResult(result);
      
      // Wait 3 seconds between tests to avoid rate limiting
      if (i < testQuestions.length - 1) {
        console.log('Waiting 3 seconds before next test...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    console.log('%c Gemma 3 Batch Test Complete ', 'background: #673AB7; color: white; padding: 5px; border-radius: 5px;');
  }

  // Helper function to display the results in a nice format
  function displayGemma3TestResult(result) {
    if (result.success) {
      console.log('%c Gemma 3 Test Successful! ', 'background: #4CAF50; color: white; padding: 5px; border-radius: 5px;');
      console.log('Response:', result.content);
      console.log('Tokens used:', result.usage);
    } else {
      console.log('%c Gemma 3 Test Failed! ', 'background: #F44336; color: white; padding: 5px; border-radius: 5px;');
      console.log('Error:', result.error || result.message);
      console.log('Raw response:', result.raw);
    }
  }

  // Export functions to window for testing in browser console
  window.testGemma3 = testGemma3;
  window.runGemma3BatchTest = runGemma3BatchTest;
  
  console.log('Gemma 3 test helper loaded! Use window.testGemma3("your message") or window.runGemma3BatchTest() to test.');
});