// Create a new BroadcastChannel named "card"
const channel = new BroadcastChannel("card");

// Select the first element in the DOM with the class "card"
const card = document.querySelector(".card");

// These two functions convert between screen coordinates and client coordinates.
const getClientViewport = (screenX, screenY) => {
    const clientX = screenX - window.screenLeft;
    const clientY = screenY - window.screenTop - 79;
    return [clientX, clientY];
};

const getScreenViewport = (clientX, clientY) => {
    const screenX = clientX + window.screenLeft;
    const screenY = clientY + window.screenTop + 79;
    return [screenX, screenY];
};

// Add a "mousedown" event listener to the card. This event fires when the left mouse button is clicked on the card.
card.addEventListener("mousedown", (e) => {
    // Calculate the cursor's distance from the top-left corner of the card.
    const middleX = e.pageX - card.offsetLeft;
    const middleY = e.pageY - card.offsetTop;

    // The "mousemove" event fires when the mouse is moved.
    // This event is used to move the card and send its screen coordinates through the BroadcastChannel.
    window.onmousemove = (e) => {
        const x = e.pageX - middleX;
        const y = e.pageY - middleY;
        card.style.left = `${x}px`;
        card.style.top = `${y}px`;
        channel.postMessage(getScreenViewport(x, y));
    };

    // When the left mouse button is released (the "mouseup" event), remove the event handlers for "mouseup" and "mousemove".
    window.onmouseup = (e) => {
        window.onmouseup = null;
        window.onmousemove = null;
    };
});

// This function is called immediately after it is defined.
const init = (() => {
    console.log("init");
    if (location.search.includes("hidden")) {
        console.log("hidden");
        card.style.left = "-1000px";
    }
})();

// Create a new "style" element and append it to the document's head.
var styleElement = document.createElement("style");
document.head.appendChild(styleElement);

// Define a function that updates the content of the "style" element.
// This will be used to change the appearance of the card.
function changeAfterProperty(selector, content, blur) {
    styleElement.textContent = `${selector}::after { content: "${content}"; filter: blur(${blur}px);  }`;
}

// Define a variable used to change the card's appearance based on its horizontal position.
const emoji = 400;

// Add an "onmessage" event listener to the channel.
// This event fires when a message is received from the BroadcastChannel.
channel.onmessage = (e) => {
    // Convert the received screen coordinates to client coordinates.
    const [x, y] = getClientViewport(...e.data);

    // Calculate the width of a third of the screen.
    const width = window.screen.width / 3;

    // Log the x-coordinate and the width of a third of the screen.
    console.log(e.data[0]);
    console.log(window.screen.width / 3);

    // Change the appearance of the card based on its horizontal position.
    if (e.data[0] > (width - emoji) * 2 || e.data[0] < width - emoji) {
        changeAfterProperty(".card", "🖕🙄🖕", 0);
    }

    // Move the card to the received position.
    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
};
