(function() {
    //const WEBHOOK_URL = "https://hook.us1.make.com/7obx2jgtkfdp6i36mx78yamsguub13ah"; 
    const WEBHOOK_URL = "https://n8n.srv960709.hstgr.cloud/webhook-test/5c042697-f9ac-4c8c-8e5b-aa863baef885"
    const CHATBOT_NAME = "Blickbot Assistant.";  
    const AVATAR_URL = "https://luciano234.github.io/jshosting/logo_v3_blickbot.jpg";  
 
    // Create chat bubble
    let chatBubble = document.createElement("div");
    chatBubble.id = "chatbot-bubble";
    chatBubble.innerHTML = "💬";
    document.body.appendChild(chatBubble);

    // Create chatbot container
    let chatContainer = document.createElement("div");
    chatContainer.id = "chatbot-container";
    chatContainer.style.display = "none";
    document.body.appendChild(chatContainer);

    // Create chatbot header
    let chatHeader = document.createElement("div");
    chatHeader.id = "chatbot-header";
    chatHeader.innerHTML = `
        <img src="${AVATAR_URL}" id="chatbot-avatar">
        <span>${CHATBOT_NAME}</span>
        <button id="close-chatbot">✖</button>
    `;
    chatContainer.appendChild(chatHeader);

    // Create chat area (scrollable)
    let chatArea = document.createElement("div");
    chatArea.id = "chatbot-area";
    chatContainer.appendChild(chatArea);

    // Create input wrapper (fixed at bottom)
    let inputWrapper = document.createElement("div");
    inputWrapper.id = "chatbot-input-wrapper";
    
    let inputField = document.createElement("input");
    inputField.id = "chatbot-input";
    inputField.type = "text";
    inputField.placeholder = "Type a message...";
    
    inputWrapper.appendChild(inputField);
    chatContainer.appendChild(inputWrapper);

    // Apply styles
    let style = document.createElement("style");
    style.innerHTML = `
        #chatbot-bubble {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: blue;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        #chatbot-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 320px;
            height: 450px;
            background: white;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        #chatbot-header {
            display: flex;
            align-items: center;
            padding: 10px;
            background: #0078ff;
            color: white;
            font-weight: bold;
            font-size: 16px;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            justify-content: space-between;
        }
        #chatbot-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 10px;
        }
        #close-chatbot {
            background: transparent;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
        }
        #chatbot-area {
            flex-grow: 1;
            overflow-y: auto;
            padding: 10px;
            background: #f9f9f9;
            display: flex;
            flex-direction: column;
            height: 100%;
            max-height: 350px;
        }
        .chat-message {
            padding: 8px;
            margin: 5px;
            border-radius: 5px;
            max-width: 80%;
            word-wrap: break-word;
        }
        .chat-message.user {
            background: #0078ff;
            color: white;
            align-self: flex-end;
        }
        .chat-message.bot {
            background: #e1ecff;
            color: black;
            align-self: flex-start;
        }
        #chatbot-input-wrapper {
            background: white;
            padding: 10px;
            display: flex;
            position: sticky;
            bottom: 0;
            width: 100%;
            box-sizing: border-box;
            border-top: 1px solid #ddd;
        }
        #chatbot-input {
            flex: 1;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            outline: none;
        }
    `;
    document.head.appendChild(style);

    // Toggle chatbot visibility
    chatBubble.addEventListener("click", function() {
        chatContainer.style.display = "flex";
        inputField.focus();
    });

    document.getElementById('close-chatbot').addEventListener("click", function() {
        chatContainer.style.display = "none";
    });

    // Handle user input
    inputField.addEventListener("keypress", async function(event) {
        if (event.key === "Enter") {
            let message = inputField.value.trim();
            if (!message) return;
            inputField.value = "";

            addMessage("user", message);
            scrollToBottom();

            let botResponse = await sendToWebhook(message);
            addMessage("bot", botResponse);
            scrollToBottom();
        }
    });

    // Function to add messages to chat area
    function addMessage(sender, message) {
        let messageDiv = document.createElement("div");
        messageDiv.className = "chat-message " + sender;
        messageDiv.textContent = message;
        chatArea.appendChild(messageDiv);
        scrollToBottom();
    }

    // Scroll to latest message
    function scrollToBottom() {
        setTimeout(() => {
            chatArea.scrollTop = chatArea.scrollHeight;
        }, 100);
    }

    // Function to send message to webhook
    async function sendToWebhook(message) {
        try {
            const response = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: message })
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            return data.response || "No response from bot.";
        } catch (error) {
            console.error("Error:", error);
            return "Error: Unable to connect.";
        }
    }
})();
