document.onload = console.log("App is alive!");

let selectedChannel ;

let channels = [];
let messages = [];

function getChannels() {
    channels = mockChannels;
}

function getMessages() {
    messages = mockMessages;

}

function init(){
    console.log("App is initialized");
    getChannels();
    getMessages();
    loadMessagesIntoChannel();
    displayChannels();
    loadEmojis();
    document.getElementById("send-button").addEventListener("click", sendMessage);
    document.getElementById("emoticon-button").addEventListener("click", toggleEmojiArea);
    document.getElementById("close-emoticon-button").addEventListener('click', toggleEmojiArea);
}

//--------Channels------

function displayChannels() {
    
    const favoriteList = document.getElementById('favorite-channels');
    const regularList = document.getElementById('regular-channels');
    favoriteList.innerHTML = "";
    regularList.innerHTML = "";

    channels.forEach((channel) => {
        const currentChannelHtmlString =
            `<li id = "` + channel.id + `" onclick = "switchChannel(this.id)">
              <i class="material-icons">group</i>
              <strong>&emsp;&nbsp;` + channel.cName + `</strong>
              ` + channel.latestMessage() + `
            </li>`;
        if (channel.favorite) {
            favoriteList.innerHTML += currentChannelHtmlString;
        } else {
            regularList.innerHTML += currentChannelHtmlString;
        }
        if (channel===selectedChannel) {
            document.getElementById(selectedChannel.id).classList.add("selected");
        }
    });
}

function loadMessagesIntoChannel() {
    channels.forEach((channel) => {
        messages.forEach((message) => {
            if (channel.id === message.channel) {
                channel.messages.push(message);
            }
        });
    });
}

function switchChannel(selectedChannelId) {
    console.log("Selected channel name: " + selectedChannelId);
    if (!!selectedChannel) {
        document.getElementById(selectedChannel.id).classList.remove("selected");
    }
    document.getElementById(selectedChannelId).classList.add("selected");
    channels.forEach((channel) => {
        if(channel.id === selectedChannelId) {
            selectedChannel = channel;
        }
    });
    showHeader();
    showMessages();
}

function showHeader(){
    document.getElementById('channelName').innerHTML = selectedChannel.cName;
    document.getElementById('fav-btn').innerHTML = (selectedChannel.favorite)? "favorite" : "favorite_border";
}

function Channel(name) {
    this.id = 'channel' + (channels.length + 1).toString();
    this.cName = name;
    this.favorite = false;
    this.messages = [];
    this.latestMessage = function latestMessage() {
        if (!!this.messages.length){
            const latest = new Date(Math.max(...this.messages.map(x => x.createdOn)));
            // if message is from yesterday or older, display date, else display time
            if (new Date().getDate() - latest.getDate() > 1) {
                return latest.toLocaleDateString(navigator.language, {year:"numeric", month:"numeric", day: "numeric"});
            } else {
                return latest.toLocaleTimeString(navigator.language, {hour:"numeric", minute:"numeric"});
            }
        } else {
            return "No Messages";
        }
    };
}

function createChannel() {
    let channelBox = document.getElementById('new-channel-area');
    if (channelBox.style.display === 'none') {
        document.getElementById('new-channel-area').style.display = 'flex';
    } else {
        cancelChannel();
    }  
}

function addChannel() {
    const newChannelName = document.getElementById('channel-input').value;
    if (newChannelName === '') { return; }
    document.getElementById('channel-input').value = '';
    channels.push(new Channel(newChannelName));
    displayChannels();
}

function cancelChannel() {
    document.getElementById('new-channel-area').style.display = 'none';
    document.getElementById('channel-input').value = '';
}

function setFavorite() {
    if (selectedChannel.favorite == true) {
        selectedChannel.favorite = false;
    } else {
        selectedChannel.favorite = true;
    }
    displayChannels();
    showHeader();
}

/*function sortChannels() {
    let temp;
    for(let i = 0; i<channels.length - 1; i++) {
        if ((channels[i].latestMessage().getDate() > channels[i+1].latestMessage().getDate()) || channels[i].latestMessage() === "No Messages" ) {
            temp = channels[i];
            channels[i+1] = channels[i];
            channels[i] = temp;
        } else { continue; }
    }
    displayChannels();
}*/

//--------MESSAGES--------
function Message(user, own, text, channelID) {
    this.createdBy = user;
    this.createdOn = new Date(Date.now());
    this.own = own;
    this.text = text;
    this.channel = channelID;
}

function showMessages(){
        const chatArea = document.getElementById('message-area');
        chatArea.innerHTML = "";
        selectedChannel.messages.forEach((message) => {
                let messageTime;
                if(new Date().getDate() - message.createdOn.getDate() < 1 ) {
                messageTime = message.createdOn.toLocaleTimeString(navigator.language, 
                    {hour: "numeric",
                    minute: "numeric"}
                );
                } else if (new Date.getDate() - message.createdOn.getDate() < 7) {
                    messageTime = message.createdOn.toLocaleDateString(navigator.language, {weekDay:'long'}) + " ," + message.createdOn.toLocaleTimeString(navigator.language, 
                        {hour: "numeric",
                        minute: "numeric"} 
                    ); 
                } else {
                    messageTime = message.createdOn.toLocaleDateString(navigator.language, {month:'short', day:'numeric'}) + " " + message.createdOn.toLocaleTimeString(navigator.language,
                        {hour: "numeric",
                        minute: "numeric"} 
                    ); 
                }

        let currrentMessageStringHtml = ``;
        if(message.own) {
            currrentMessageStringHtml = `<div class ="message-outgoing">
                                            <div class ="message-wrapper outgoing">
                                                <div class="message-content">
                                                    <p>` + message.text + `</p>
                                                </div>
                                            <i class="material-icons out-icon">account_circle</i>
                                            </div>
                                        <span class="timestamp">` + messageTime + `</span>
                                        </div>`;
                                            
        } else {
            currrentMessageStringHtml = 
            `<div class ="message-incoming">
                <div class ="message-wrapper incoming">
                <i class="material-icons out-icon">account_circle</i>
                    <div class="message-content">
                    <h3>` + message.user + 
                    `<p>` + message.text + `</p>
                    </div>
                </div>
            <span class="timestamp">` + messageTime + `</span>
            </div>`;
        }
        
        chatArea.innerHTML += currrentMessageStringHtml; 
        
        });
        
}

function sendMessage(){
    const text = document.getElementById("message-input").value;
    if (!!text) {
        const myUsername = "Yasin";
        const own = true;
        const channelID = selectedChannel.id;
        const message = new Message(myUsername, own, text, channelID);
        console.log("New Message: ", message);
        selectedChannel.messages.push(message);
        document.getElementById("message-input").value = "";
        showMessages();
        displayChannels();
    } else {
        return;
    }
    
}

//---------EMOJI AREA-----------
function loadEmojis() {
    for (let i = 0; i < emojis.length; i++) {
        document.getElementById('emoji-list').innerHTML += `<span class="button">` + emojis[i] + `</span>`
    }
    const emojisInArea = document.getElementById('emoji-list').childNodes;
    for (let i = 0; i < emojisInArea.length; i++) {
        emojisInArea[i].addEventListener('click', function () {
            document.getElementById('message-input').value += this.innerHTML;
            document.getElementById('send-button').style.color = "#00838f";
        });
    }
}

function toggleEmojiArea() {
    let emojiArea = document.getElementById("emoji-area");
    let displayStatus = window.getComputedStyle(emojiArea).display;
    if (displayStatus === "none") {
        displayStatus = "inline-block";
    } else {
        displayStatus = "none";
    }
    emojiArea.style.display = displayStatus;
}



