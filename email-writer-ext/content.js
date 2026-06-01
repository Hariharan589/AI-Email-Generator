
console.log("AI Email Writer Loaded");

function getEmailContent() {

    const emailBody = document.querySelector(".a3s");

    if (!emailBody) {
        return "";
    }

    return emailBody.innerText;
}

function getComposeBox() {

    return document.querySelector(
        '[role="textbox"][g_editable="true"]'
    );
}

async function generateReply(button) {

    try {

        button.disabled = true;
        button.innerText = "Generating...";

        const emailContent = getEmailContent();

        if (!emailContent) {

            alert("No email content found.");

            button.disabled = false;
            button.innerText = "Generate AI Reply";

            return;
        }

        const response = await fetch(
            "http://localhost:8080/api/email/generate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: "Professional"
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                "Backend Error: " + response.status
            );
        }

        const reply = await response.text();

        const composeBox = getComposeBox();

        if (!composeBox) {

            alert("Compose box not found.");

            button.disabled = false;
            button.innerText = "Generate AI Reply";

            return;
        }

        composeBox.focus();

        composeBox.innerText = reply;

    } catch (error) {

        console.error(error);

        alert(
            "Failed to generate reply.\n\n" +
            error.message
        );
    }

    button.disabled = false;
    button.innerText = "Generate AI Reply";
}

function addAIButton() {

    const sendButton = document.querySelector(
        ".T-I.J-J5-Ji.aoO.v7.T-I-atl.L3"
    );

    if (!sendButton) return;

    if (document.getElementById("ai-reply-btn")) return;

    const sendContainer =
        sendButton.closest(".dC");

    if (!sendContainer) return;

    const aiButton =
        document.createElement("button");

    aiButton.id = "ai-reply-btn";

    aiButton.innerText =
        "Generate AI Reply";

    aiButton.style.background = "#1a73e8";
aiButton.style.color = "white";
aiButton.style.border = "none";
aiButton.style.borderRadius = "18px";
aiButton.style.height = "36px";
aiButton.style.padding = "0 12px";
aiButton.style.cursor = "pointer";
aiButton.style.fontSize = "13px";
aiButton.style.fontWeight = "500";
aiButton.style.whiteSpace = "nowrap";
aiButton.style.flexShrink = "0";

    aiButton.addEventListener(
        "click",
        () => generateReply(aiButton)
    );

    const wrapper = document.createElement("div");

wrapper.id = "ai-wrapper";

wrapper.style.display = "inline-flex";
wrapper.style.alignItems = "center";
wrapper.style.marginRight = "8px";
wrapper.style.flexShrink = "0";

    wrapper.appendChild(aiButton);

    sendContainer.parentNode.insertBefore(
        wrapper,
        sendContainer
    );
}

const observer =
    new MutationObserver(() => {

        addAIButton();

    });

observer.observe(
    document.body,
    {
        childList: true,
        subtree: true
    }
);

addAIButton();