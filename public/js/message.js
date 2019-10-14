const socket = io();
const $message_container = document.querySelector("#message-input");
const $new_message = document.querySelector('#new-message');
const $sendMessageBtn = document.querySelector('#submit-message');
const $locationField = document.querySelector("#share-location");
const $sharingLocationBtn = document.querySelector("#current-location");


socket.on("greetingMess", (message) => {
    console.log(message);
});

socket.on("newUser", (message) => {
    console.log(message);
});

socket.on("updatedMessage", (messages) => {
    let len = messages.length;
    if (len >  0){
        len = len - 1;
        console.log(messages[len]);
    }
});

socket.on("iLocation", (latitude, longitude, link) => {
    console.log(link);
});

$message_container.addEventListener("submit", (e) => {
    e.preventDefault();
    $sendMessageBtn.setAttribute('disabled', 'disabled');
    let new_message = e.target.elements.new_message.value;
    socket.emit("new_message", new_message, (message) => {
        $sendMessageBtn.removeAttribute('disabled');
        $new_message.value = " ";
        $new_message.focus();
        // The second message is the callback from the server
        console.log(message);
    });
});

$locationField.addEventListener("submit", (e) => {
    e.preventDefault();
    $sharingLocationBtn.setAttribute('disabled', 'disabled');
    console.log("Activate Location Function");
    if (!navigator.geolocation){
        return alert("Geo location is not supported on your machine :[[[");
    } else {
        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit("user-location", {
                latitude: position.coords.latitude,
                longtitude: position.coords.longitude,
                locationLink: `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`,
            }, (result_message) => {
                $sharingLocationBtn.removeAttribute('disabled');
                $new_message.focus();
                console.log(result_message);
            });
        });
    }
});