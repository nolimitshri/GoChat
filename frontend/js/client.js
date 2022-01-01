// const socket = io('http://localhost:8000');
const socket = io("https://thawing-lowlands-90887.herokuapp.com/");

// get DOM elements in respective JS variables
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInput");
// for new messages to insert
const messageContainer = document.querySelector(".container");

// insert any Audio on receiving messages
var audio = new Audio("../frontend/audio/tone.mp3");
// console.log(__dirname);
// when a new user joins the chat we want to give message all the existing users before.
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    // messageElement.classList.add('underlined');
    messageContainer.append(messageElement);
    if(position === "left"){
        audio.play();
    }
};

// ask new user his/her name who just accessed the link and let the server know.
const name_user = prompt("Enter your name to join: ");
socket.emit('new-user-joined', name_user);

// if a new user joins, recieve his/her name from the server
socket.on('user-joined', name => {
    if(name !== null){
        append(`<b style="font-family: 'Spline Sans', sans-serif;">${name}</b> joined the chat.`, "right");
    } 
});

// if server sends a message, recieve it
socket.on('recieve', data => {
    if(data.name !== null){
        append(`<b style="font-family: 'Spline Sans', sans-serif;">${data.name}:</b> ${data.message}`, 'left');
    }
});

// if a user leaves the chat, append the info to the container
socket.on('left', name=>{
    if(name !== null){
        append(`<b style="font-family: 'Spline Sans', sans-serif;">${name}</b> has left the chat.`, 'right');
    }
});

// If the form gets submitted i.e. user sends a message to the server.
// add event listener on Forms 
// me the sender one if sends any message to all the other users
// Function which will append to the container
form.addEventListener('submit', (e) => {
    e.preventDefault(); // to not reload the page automatically
    const message = messageInput.value;
    append(`<b style="font-family: 'Spline Sans', sans-serif;">You:</b> ${message}`, 'right');
    socket.emit('send', message); //tell the server that I have a message
    messageInput.value = '';
});