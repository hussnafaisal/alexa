const jokes = [
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "Why don’t scientists trust atoms? Because they make up everything!",
  "I told my computer I needed a break, and it said 'No problem, I’ll go to sleep.'"
];

function getTime() {
  const now = new Date();
  return `The time is ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function getDate() {
  const now = new Date();
  return `Today's date is ${now.toLocaleDateString()}`;
}

function getJoke() {
  return jokes[Math.floor(Math.random() * jokes.length)];
}

function commands(text) {
  const t = text.toLowerCase();
  if (t.includes('time')) {
    return { reply: getTime() };
  }
  if (t.includes('date')) {
    return { reply: getDate() };
  }
  if (t.includes('joke')) {
    return { reply: getJoke() };
  }
  if (t.includes('hello') || t.includes('hi')) {
    return { reply: 'Hello! How can I help you?' };
  }
  if (t.includes('open google')) {
    return {
      reply: 'Opening Google.',
      action: () => window.open('https://www.google.com', '_blank')
    };
  }
  if (t.includes('stop')) {
    return {
      reply: 'Stopping.',
      action: () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      }
    };
  }
  // Default: search Google for any other command
  return {
    reply: `Searching Google for "${text}"...`,
    action: () => window.open(`https://www.google.com/search?q=${encodeURIComponent(text)}`, '_blank')
  };
}

export default commands; 