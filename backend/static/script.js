const check = (url) => {
  try {
    new URL(url);
    const domainExtensionPattern = /\.[a-zA-Z0-9]{2,}$/;
    if (!domainExtensionPattern.test(url)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};
const protocolAdder = (url) => {
  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    url = "https://" + url;
  }

  return url;
};
document.getElementById("dialog-info").addEventListener("click", function () {
  const text = this.innerText;
  navigator.clipboard
    .writeText(text)
    .then(function () {
      alert("Copied URL");
    })
    .catch(function (err) {
      console.error("Failed to copy text: ", err);
    });
});

const dialogBox = document.getElementById("dialogBox");
const okBtn = document.getElementById("okBtn");
okBtn.addEventListener("click", () => (dialogBox.style.display = "none"));
document
  .getElementById("lengthener-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const input = protocolAdder(document.getElementById("url-input").value);
    if (check(input)) {
      const loader = document.getElementById("loading-screen");
      loader.style.display = "flex";
      fetch("https://oo0oo0o0ooo0.daamin.tech/lengthen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: input }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          loader.style.display = "none";
          document.getElementById("dialogBox").classList.add("show");
          document.getElementById("dialog-info").innerText =
            "https://oo0oo0o0ooo0.daamin.tech/" + data.lengthened_url;
          console.log(data.lengthened_url);
        });
    } else {
      showErrorMessage("Enter a valid URL");
      document.getElementById("url-input").value = "";
    }
  });
const showErrorMessage = (message) => {
  const messageBox = document.createElement("div");
  messageBox.textContent = message;
  messageBox.style.position = "fixed";
  messageBox.style.bottom = "10vh";
  messageBox.style.left = "50%";
  messageBox.style.transform = "translateX(-50%)";
  messageBox.style.backgroundColor = "#f44336";
  messageBox.style.color = "white";
  messageBox.style.padding = "10px 20px";
  messageBox.style.borderRadius = "5px";
  messageBox.style.zIndex = "10000000";
  messageBox.style.fontSize = "18px";
  document.body.appendChild(messageBox);
  const errorMessage = new Audio("./assets/sound/error-message.mp3");
  errorMessage.play();
  setTimeout(() => {
    messageBox.remove();
  }, 3000);
};
