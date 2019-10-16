const socket = io();
const $message_container = document.querySelector("#message-input");
const $new_message = document.querySelector('#new-message');
const $sendMessageBtn = document.querySelector('#submit-message');
const $locationField = document.querySelector("#share-location");
const $sharingLocationBtn = document.querySelector("#current-location");
const $messageToRender = document.querySelector("#messages-to-render");
const $sideBarRoomInfo = document.querySelector("#sidebar");

// Message Template
const messageTemplate = document.querySelector('#message-template').innerHTML;

// Location Template
const locationTemplate = document.querySelector("#location-template").innerHTML;

// Room information title
const roomInfoTemplate = document.querySelector("#sidebar-template").innerHTML;

socket.on("updatedMessage", (messages) => {
        let timeFormat = moment(messages.createdAt).format("h:mm:s A");
        const messageHTML = Mustache.render(messageTemplate, {
            username: messages.username,
            message: messages.text,
            createdAt: timeFormat, 
        });
        $messageToRender.insertAdjacentHTML("beforeend", messageHTML);
        // This one will insert the next element after the previous one
});

socket.on("roomdata", ({room, users}) => {
    const roomInfoHTML = Mustache.render(roomInfoTemplate, {
        room: room,
        users: users,
    });
    $sideBarRoomInfo.innerHTML = roomInfoHTML;
    // This one will replace the whole thing and print the new one out 
});

socket.on("iLocation", (latitude, longitude, location) => {
    locationHTML = Mustache.render(locationTemplate, {
        username: location.username,
        linkLocation: location.locationLink,
        createdAt: moment(location.createdAt).format("h:mm:s A"),
    });
    $messageToRender.insertAdjacentHTML("beforeend", locationHTML);
});

// Get the information from the query
const {username, roomnumber} = Qs.parse(location.search, {ignoreQueryPrefix: true});
console.log(username, roomnumber);

socket.emit("join-roomchat", {username, roomnumber}, (error) =>{
    if (error){
        alert(error);
        location.href = "/";
    }
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