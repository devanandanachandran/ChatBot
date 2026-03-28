// Enable/Disable send button based on input content
const inputField = document.getElementById("input");
const sendButton = document.getElementById("send-btn");

inputField.addEventListener("input", function() {
  if (this.value.trim().length > 0) {
    sendButton.removeAttribute("disabled");
  } else {
    sendButton.setAttribute("disabled", "true");
  }
});

// Initialize button as disabled initially
sendButton.setAttribute("disabled", "true");

// Add event listener for Enter key
inputField.addEventListener("keypress", function (e) {
  if (e.key === "Enter" && !sendButton.disabled) {
    sendMessage();
  }
});

async function sendMessage() {
  const input = document.getElementById("input");
  const message = input.value.trim();

  // Input validation: stop if empty
  if (!message) return;

  // Add user message to UI
  addMessage(message, "user");
  
  // Clear input field and disable button immediately
  input.value = "";
  sendButton.setAttribute("disabled", "true");
  
  // Show typing indicator
  const typingIndicatorId = showTypingIndicator();

  try {
    // Send message to backend
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    
    // Remove typing indicator
    removeElement(typingIndicatorId);

    // Display bot reply
    // Automatically handles multiple potential reply fields from backend
    if (data.reply) {
      addMessage(data.reply, "bot");
    } else if (data.message) { 
      addMessage(data.message, "bot");
    } else {
      addMessage("Sorry, I received an invalid response.", "bot");
    }

  } catch (error) {
    console.error("Error communicating with backend:", error);
    removeElement(typingIndicatorId);
    addMessage("Connection error. Please ensure the backend server is running on localhost:3000.", "bot");
  }
}

function addMessage(text, type) {
  const chatBox = document.getElementById("chat-box");
  
  const msg = document.createElement("div");
  msg.classList.add("message", type);
  // Using textContent instead of innerText for better safety and performance
  msg.textContent = text;
  
  chatBox.appendChild(msg);

  // Auto-scroll to bottom smoothly
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
  const chatBox = document.getElementById("chat-box");
  const id = "typing-" + Date.now();
  
  const typingDiv = document.createElement("div");
  typingDiv.id = id;
  typingDiv.classList.add("typing-indicator");
  
  for(let i=0; i<3; i++) {
    const dot = document.createElement("div");
    dot.classList.add("typing-dot");
    typingDiv.appendChild(dot);
  }
  
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  
  return id;
}

function removeElement(id) {
  const el = document.getElementById(id);
  if (el) {
    el.remove();
  }
}
