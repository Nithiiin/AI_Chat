const chat = document.getElementById('chat');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function appendMessage(sender, text) {
  const p = document.createElement('p');
  p.textContent = `${sender}: ${text}`;
  chat.appendChild(p);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const apiKey = document.getElementById('apiKey').value.trim();
  const question = userInput.value.trim();
  if (!apiKey || !question) {
    return;
  }

  appendMessage('You', question);
  userInput.value = '';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }]
      })
    });

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim() || 'No response';
    appendMessage('AI', answer);
  } catch (error) {
    appendMessage('Error', error.message);
  }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
