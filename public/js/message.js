const socket = io();

socket.on("updatedMessage", (messages) => {
    let len = messages.length;
    if (len >  0){
        len = len - 1;
        console.log(messages[len]);
    }
});

document.querySelector("#message-input").addEventListener("submit", (e) => {
    e.preventDefault();
    let new_message = document.getElementById("new-message").value;
    socket.emit("new_message", new_message);
});