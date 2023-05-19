let login = document.querySelector(".login-form");

document.querySelector("#login-btn").onclick = () =>{
    login.classList.toggle('active');
    navbar.classList.remove('active');
}

let navbar = document.querySelector(".header .navbar");

document.querySelector('#menu-btn').onclick = () =>{
    login.classList.remove('active');
    navbar.classList.toggle('active');
}

window.onscroll = () =>{
    login.classList.remove('active');
    navbar.classList.remove('active');
}

var swiper = new Swiper(".gallery-slider", {
    grabCursor:true,
    loop:true,
    centeredSlides:true,
    spaceBetween:20,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        0:{
            slidesPerView:1,
        },
        700:{
            slidesPerView:2,
        },
    }
})


//CHAT BOT integrate API CHAT GPT and speech recognition
const SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition ;

// const recorder=new SpeechRecognition();
const container = document.getElementById('chatbot-container');
const btn = document.getElementById('btn');
const form = document.getElementById('form');
const chatbot_response_typing = document.getElementById('chatbot-response-typing');

const apiKey = "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";

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`
};
const chatGptEndpoint = 'https://api.openai.com/v1/engines/text-davinci-002/completions';

const chat = async (message) => {
  const prompt = `Question: ${message}\nAnswer: `;
  
  const data = {
    'prompt': prompt,
    'max_tokens': 1024, //50-100
    'temperature': 0.5, //0.5-0.8
    'top_p': 1,
    'frequency_penalty': 0,
    'presence_penalty': 0,
    'stop': "###"
  };
  const response = await fetch(chatGptEndpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  });
  const json = await response.json();
  let answer = json.choices[0].text.trim();
  //Typing animation effect
  
  return answer;
};


const botVoice = async (message) => {

  const speech = new SpeechSynthesisUtterance();
  speech.text = await chat(message);
  container.innerHTML += `<p class="speech">${speech.text}</p>`;
  speech.volume = 1;
  speech.rate = 1.5;
  speech.pitch = 1;
  window.speechSynthesis.speak(speech);
};

const recorder = new SpeechRecognition();
recorder.onstart = () => {
  console.log('voice is active');
  btn.innerHTML = 'voice is active';
};
recorder.onend = () => {
  btn.innerHTML = 'start voice';
};
recorder.onresult = async (event) => {
  const current = event.resultIndex;
  const transcript = event.results[current][0].transcript;
  container.innerHTML += `<p class="recorder">${transcript}</p>`;
  await botVoice(transcript.toLowerCase());
};
const startVoice = () => {
  recorder.start();
};

form.onsubmit = (e) => {
  e.preventDefault();
  const formInput = document.getElementById('botvalue').value;
  if (formInput === '') {
    return false;
  } else {
    container.innerHTML += `<p class="recorder">${formInput}</p>`;
    botVoice(formInput.toLowerCase());
    form.reset();
    return true;
  }
};

