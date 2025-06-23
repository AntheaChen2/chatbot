function init() {
  const chatContainer = document.getElementById("chat-container");

  const template = `
    <button class='chat-btn'><img src='./icons/comment.png' class='icon'></button>
    <div class='chat-popup'>
      <div class='chat-header'>
        <img src='${botLogoPath}' class='bot-img'>
        <h3 class='bot-title'>Loading...</h3>
      </div>
      <div class='chat-area'></div>
      <div class='chat-input-area'>
        <input type='text' class='chat-input' placeholder='Type a message ...'>
        <button class='chat-submit'><i class='material-icons'>send</i></button>
      </div>
    </div>`;

  chatContainer.innerHTML = template;

  const chatBtn = document.querySelector(".chat-btn");
  const chatPopup = document.querySelector(".chat-popup");
  chatInput = document.querySelector(".chat-input");
  chatSubmit = document.querySelector(".chat-submit");
  chatArea = document.querySelector(".chat-area");
  const botTitle = document.querySelector(".bot-title");
  const msg = document.createElement("div");
  msg.classList.add("bot-msg");
  msg.innerHTML = `<img class='bot-img' src='${botLogoPath}' /><span class='msg'>${welcomeMessage}</span>`;
  chatArea.appendChild(msg);

  chatBtn.onclick = () => {
    chatPopup.style.display = chatPopup.style.display === "flex" ? "none" : "flex";
    chatInput.focus();
  };

  chatSubmit.onclick = () => {
    const userText = chatInput.value.trim();
    if (userText) {
      chatArea.innerHTML += `<div class='user-msg'><span class='msg'>${userText}</span></div>`;
      chatInput.value = "";
      scrollToBottomOfResults();
      send(userText);
    }
  };

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      chatSubmit.click();
    }
  });
}

function setBotResponse(val) {
  let msg = inactiveMessage;

  if (val && val.text) {
    msg = val.text;
  }

  const BotResponse = `
    <div class='bot-msg'>
      <img class='bot-img' src='${botLogoPath}' />
      <span class='msg'>${msg}</span>
    </div>`;

  document.querySelector('.chat-area').innerHTML += BotResponse;
  scrollToBottomOfResults();
  chatInput.disabled = false;
  chatInput.focus();
}

function send(message) {
  const webhookURL = "https://hook.eu2.make.com/2zapkt3jsgdgnf3za0z5mfkhcoedt5ff"; // ✅ Your real Make webhook

  chatInput.type = "text";
  chatInput.focus();

  console.log("Sending message:", message);

  fetch(webhookURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: message,
      sender: "User"
    })
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to reach webhook");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Make Response:", data);
      if (data && data.text) {
        setBotResponse(data);
      } else {
        setBotResponse({ text: inactiveMessage });
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      setBotResponse({ text: inactiveMessage });
    });
}


function scrollToBottomOfResults() {
  chatArea.scrollTop = chatArea.scrollHeight;
}

function showInactiveMessage() {
  chatArea.innerHTML += `<div class='bot-msg'><img class='bot-img' src='${botLogoPath}' /><span class='msg'>${inactiveMessage}</span></div>`;
}

function createChatBot(hostURL, botLogo, title, welcome, inactiveMsg, theme = "blue") {
  host = hostURL;
  botLogoPath = botLogo;
  welcomeMessage = welcome;
  inactiveMessage = inactiveMsg;
  init();
}
