const socket = io();
const $message_container = document.querySelector("#message-input");
const $new_message = document.querySelector('#new-message');
const $sendMessageBtn = document.querySelector('#submit-message');
const $locationField = document.querySelector("#share-location");
const $sharingLocationBtn = document.querySelector("#current-location");
const $messageToRender = document.querySelector("#messages-to-render");

// Message Template
const messageTemplate = document.querySelector('#message-template').innerHTML;

// Location Template
const locationTemplate = document.querySelector("#location-template").innerHTML;

socket.on("greetingMess", (message) => {
    console.log(message.text);
});

socket.on("newUser", (message) => {
    console.log(message.text);
});

socket.on("updatedMessage", (messages) => {
        const messageHTML = Mustache.render(messageTemplate, {
           message: messages.text,
           createdAt: moment(messages.createdAt).format("h:mm:s A"), 
        });
        $messageToRender.insertAdjacentHTML("beforeend", messageHTML);
});

socket.on("iLocation", (latitude, longitude, location) => {
    locationHTML = Mustache.render(locationTemplate, {
        linkLocation: location.locationLink,
        createdAt: moment(location.createdAt).format("h:mm:s A"),
    });
    $messageToRender.insertAdjacentHTML("beforeend", locationHTML);
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
        console.log(message.text);
    });
});

$sharingLocationBtn.addEventListener("click", () => {
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