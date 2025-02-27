
//const ASSISTANT_ID = "asst_vtldlsu7v5qpEBKex8kAuYgF";  // Virtual Weiter assistant ID
    //const CHATBOT_NAME = "Blickbot Assitant";
    //const AVATAR_URL = "https://luciano234.github.io/jshosting/logo_v3_blickbot.jpg";

(function () {
    const OPENAI_API_KEY = "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";  // Replace with your actual OpenAI API key
    const ASSISTANT_ID = "asst_vtldlsu7v5qpEBKex8kAuYgF";  // Virtual Weiter assistant ID
    const CHATBOT_NAME = "Asistenter";
    const AVATAR_URL = "https://luciano234.github.io/jshosting/logo_v3_blickbot.jpg";

    let threadId = localStorage.getItem("chatbot_thread_id");


    // Create chat UI elements
    let chatBubble = document.createElement("div");
    chatBubble.id = "chatbot-bubble";
    chatBubble.innerHTML = "💬";
    document.body.appendChild(chatBubble);

    let chatContainer = document.createElement("div");
    chatContainer.id = "chatbot-container";
    chatContainer.style.display = "none";
    document.body.appendChild(chatContainer);

    let chatHeader = document.createElement("div");
    chatHeader.id = "chatbot-header";
    chatHeader.innerHTML = `
        <img src="${AVATAR_URL}" id="chatbot-avatar">
        <span>${CHATBOT_NAME}</span>
        <button id="close-chatbot">✖</button>
    `;
    chatContainer.appendChild(chatHeader);

    let chatArea = document.createElement("div");
    chatArea.id = "chatbot-area";
    chatContainer.appendChild(chatArea);

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
    chatBubble.addEventListener("click", function () {
        chatContainer.style.display = "flex";
        inputField.focus();
    });

    document.getElementById('close-chatbot').addEventListener("click", function () {
        chatContainer.style.display = "none";
    });

    // Handle user input
    inputField.addEventListener("keypress", async function (event) {
        if (event.key === "Enter") {
            let message = inputField.value.trim();
            if (!message) return;
            inputField.value = "";

            addMessage("user", message);
            scrollToBottom();

            let botResponse = await queryVirtualWeiter(message);
            addMessage("bot", botResponse);
            scrollToBottom();
        }
    });

    // Function to add messages to chat area
    function addMessage(sender, message) {
        let messageDiv = document.createElement("div");
        messageDiv.className = "chat-message " + sender;

        // Remove bold formatting (double asterisks) from the message
        message = message.replace(/\*\*/g, "");

        // Convert text-based lists to HTML lists
        if (message.includes("\n")) {
            let lines = message.split("\n");
            let isNumbered = lines.every(line => /^\d+\./.test(line.trim()));
            let isBulleted = lines.every(line => /^[-*]/.test(line.trim()));

            if (isNumbered) {
                message = "<ol>" + lines.map(line => `<li>${line.replace(/^\d+\.\s*/, '')}</li>`).join("") + "</ol>";
            } else if (isBulleted) {
                message = "<ul>" + lines.map(line => `<li>${line.replace(/^[-*]\s*/, '')}</li>`).join("") + "</ul>";
            } else {
                message = message.replace(/\n/g, "<br>"); // Preserve new lines
            }
        }

        messageDiv.innerHTML = message; // Use innerHTML to render HTML properly
        chatArea.appendChild(messageDiv);
        scrollToBottom();
    }


    // Scroll to latest message
    function scrollToBottom() {
        setTimeout(() => {
            chatArea.scrollTop = chatArea.scrollHeight;
        }, 100);
    }

    // Function to send message to OpenAI Assistant
    async function queryVirtualWeiter(question) {
        try {
            // 1️⃣ Only create a new thread if it doesn't exist
            if (!threadId) {
                let threadResponse = await fetch("https://api.openai.com/v1/threads", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${OPENAI_API_KEY}`,
                        "OpenAI-Beta": "assistants=v2",
                        "Content-Type": "application/json"
                    }
                });

                let threadData = await threadResponse.json();
                if (threadData.error) {
                    console.error("❌ OpenAI API Error:", threadData.error);
                    return `Error: ${threadData.error.message}`;
                }

                threadId = threadData.id;
                localStorage.setItem("chatbot_thread_id", threadId); // 🔹 Save thread ID for reuse
            }

            // 2️⃣ Send message to the existing thread
            let messageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "OpenAI-Beta": "assistants=v2",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    role: "user",
                    content: question
                })
            });

            let messageData = await messageResponse.json();
            if (messageData.error) {
                console.error("❌ Message Error:", messageData.error);
                return `Error: ${messageData.error.message}`;
            }

            // 3️⃣ Start the assistant run
            let runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "OpenAI-Beta": "assistants=v2",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ assistant_id: ASSISTANT_ID })
            });

            let runData = await runResponse.json();
            if (runData.error) {
                console.error("❌ Run Error:", runData.error);
                return `Error: ${runData.error.message}`;
            }

            let runId = runData.id;
            let status = runData.status;

            // 4️⃣ Wait for assistant's response
            while (status !== "completed") {
                await new Promise(resolve => setTimeout(resolve, 2000));

                let checkRun = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
                    headers: {
                        "Authorization": `Bearer ${OPENAI_API_KEY}`,
                        "OpenAI-Beta": "assistants=v2"
                    }
                });

                let runStatus = await checkRun.json();
                status = runStatus.status;

                if (runStatus.error) {
                    console.error("❌ Error during assistant run:", runStatus.error);
                    return `Error: ${runStatus.error.message}`;
                }
            }

            // 5️⃣ Retrieve assistant's response
            let messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "OpenAI-Beta": "assistants=v2"
                }
            });

            let messagesData = await messagesResponse.json();
            if (messagesData.error) {
                console.error("❌ No response received:", messagesData.error);
                return `Error: ${messagesData.error.message}`;
            }

            return messagesData.data[0].content[0].text.value;
        } catch (error) {
            console.error("❌ API Connection Error:", error);
            return "Error: Unable to connect.";
        }
    }





})();

