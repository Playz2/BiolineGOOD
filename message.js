// Replace this with your actual API implementation
async function callOpenAI(message) {
    const OPENAI_API_KEY = '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';
    
    // Predefined responses for specific topics
    const responses = {
      "schelet": "Secțiunea despre **schelet** îți oferă informații detaliate despre oasele corpului uman, structura acestora și funcțiile acestora. Poți accesa această secțiune din meniul principal.",
      "muschi": "Secțiunea despre **mușchi** îți oferă informații despre sistemul muscular al corpului uman, tipurile de mușchi și rolurile lor. Găsești detalii complete în meniul principal.",
      "reprezentari 3d": "În secțiunea **Reprezentări 3D**, poți explora un model interactiv al corpului uman. Este un instrument util pentru studiu.",
      "cariera": "Secțiunea **Carieră** îți oferă informații despre universități din România care formează specialiști în domeniul medical, dar și locuri de muncă disponibile.",
      "teste": "Secțiunea **Teste** conține teste interactive despre anatomie: 6 teste despre **schelet** și 6 teste despre **mușchi**."
    };
  
    try {
      // If the message matches one of the predefined topics, return the relevant response
      if (responses[message.toLowerCase()]) {
        return responses[message.toLowerCase()];
      }
        // Otherwise, make a request to the OpenAI API for a custom response
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'Ești un asistent virtual pentru un site educațional despre anatomia umană numit Bioline. Vorbești în limba română și ajuți utilizatorii să navigheze pe site și să găsească informații despre anatomie. Răspunsurile tale sunt scurte, prietenoase și precise. Bioline este împărțit în 5 secțiuni: Schelete, Mușchi, Reprezentări 3D, Carieră, Teste. Scopul tău este să ajuți utilizatorii să înțeleagă structura site-ului și să răspunzi la întrebările lor.'
              },
              {
                role: 'user',
                content: message
              }
            ],
            max_tokens: 300,
            temperature: 0.9
          })
        });
  
        // Parse the response from OpenAI
        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
          return data.choices[0].message.content;
        } else {
          return 'Îmi pare rău, nu am găsit informațiile exacte. Te rog să reformulezi întrebarea.';
        }
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return 'Îmi pare rău, am întâmpinat o problemă de comunicare. Te rog să încerci din nou.';
    }
  