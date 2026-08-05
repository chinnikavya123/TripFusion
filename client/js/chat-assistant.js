(function(){
    const launcher=document.createElement(
        "button"
    );

    launcher.type="button";
    launcher.className=
        "chat-assistant-launcher";
    launcher.setAttribute(
        "aria-label",
        "Open chat assistant"
    );
    launcher.textContent="💬";

    const panel=document.createElement(
        "section"
    );

    panel.className=
        "chat-assistant-panel";

    panel.innerHTML=`
        <div class="chat-assistant-header">
            <div>
                <h3>Chat Assistant</h3>
                <p>Ask about your trip</p>
            </div>

            <button
                type="button"
                class="chat-assistant-close"
                aria-label="Close chat assistant"
            >
                ×
            </button>
        </div>

        <div class="chat-assistant-messages">
            <div class="chat-message assistant">
                Hello! I can help with hotels, bookings, weather, budgets, packing and nearby places.
            </div>
        </div>

        <div class="chat-assistant-suggestions">
            <button
                type="button"
                class="chat-suggestion"
            >
                Suggest hotels
            </button>

            <button
                type="button"
                class="chat-suggestion"
            >
                Show my bookings
            </button>

            <button
                type="button"
                class="chat-suggestion"
            >
                What should I pack?
            </button>
        </div>

        <form class="chat-assistant-form">
            <input
                type="text"
                class="chat-assistant-input"
                placeholder="Type your question..."
                maxlength="500"
                autocomplete="off"
            >

            <button
                type="submit"
                class="chat-assistant-send"
            >
                Send
            </button>
        </form>
    `;

    document.body.append(
        launcher,
        panel
    );

    const closeButton=
        panel.querySelector(
            ".chat-assistant-close"
        );

    const messages=
        panel.querySelector(
            ".chat-assistant-messages"
        );

    const form=
        panel.querySelector(
            ".chat-assistant-form"
        );

    const input=
        panel.querySelector(
            ".chat-assistant-input"
        );

    const sendButton=
        panel.querySelector(
            ".chat-assistant-send"
        );

    function addMessage(
        text,
        type
    ){
        const message=
            document.createElement(
                "div"
            );

        message.className=
            `chat-message ${type}`;

        message.textContent=text;

        messages.appendChild(message);

        messages.scrollTop=
            messages.scrollHeight;
    }

    function getHeaders(){
        const token=
            localStorage.getItem(
                "tripfusion_token"
            );

        const headers={
            "Content-Type":
                "application/json",
            "Accept":
                "application/json"
        };

        if(token){
            headers.Authorization=
                `Bearer ${token}`;
        }

        return headers;
    }

    async function sendMessage(text){
        addMessage(
            text,
            "user"
        );

        sendButton.disabled=true;
        sendButton.textContent="...";

        try{
            const parameters=
                new URLSearchParams(
                    window.location.search
                );

            const tripId=
                parameters.get("id");

            const response=await fetch(
                `${API_BASE_URL}/chat`,
                {
                    method:"POST",
                    credentials:"include",
                    headers:getHeaders(),
                    body:JSON.stringify({
                        message:text,
                        tripId
                    })
                }
            );

            const result=
                await response.json();

            if(response.status===401){
                addMessage(
                    "Please log in to use the chat assistant.",
                    "assistant"
                );

                return;
            }

            if(!response.ok){
                throw new Error(
                    result.message||
                    "Unable to get a response."
                );
            }

            addMessage(
                result.data.reply,
                "assistant"
            );
        }catch(error){
            addMessage(
                error.message||
                "The chat assistant is temporarily unavailable.",
                "assistant"
            );
        }finally{
            sendButton.disabled=false;
            sendButton.textContent="Send";
        }
    }

    launcher.addEventListener(
        "click",
        ()=>{
            panel.classList.toggle(
                "open"
            );

            if(
                panel.classList.contains(
                    "open"
                )
            ){
                input.focus();
            }
        }
    );

    closeButton.addEventListener(
        "click",
        ()=>{
            panel.classList.remove(
                "open"
            );
        }
    );

    form.addEventListener(
        "submit",
        (event)=>{
            event.preventDefault();

            const text=
                input.value.trim();

            if(!text){
                return;
            }

            input.value="";
            sendMessage(text);
        }
    );

    panel
        .querySelectorAll(
            ".chat-suggestion"
        )
        .forEach((button)=>{
            button.addEventListener(
                "click",
                ()=>{
                    sendMessage(
                        button.textContent.trim()
                    );
                }
            );
        });
})();