/* exported gapiLoaded */ 
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '910600019466-8pj2hicq71f958dabgcbbmjqugemt142.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBiP9r7GmEcISKZzB4X1j-vR2EEiqwWuFQ';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';
const DISCOVERY_DOC2 = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC,DISCOVERY_DOC2],
    });
    gapiInited = true;
    maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
        throw (resp);
    }
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('authorize_button').style.visibility = 'hidden';
    await showButtons();
    };

    if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
    }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Sign in';
    document.getElementById('authorize_button').style.visibility = 'visible';
    document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

/**
 * Show Button
 */
async function showButtons() {

    document.getElementById('content').innerHTML = "<div id=\"iama\"  style=\"font-size:30px\">I Am A</div> <br>";

    var button = document.createElement("button");
  
    // set the button's id attribute
    button.setAttribute("id", "student_button");
    // set the button's text content
    button.textContent = "Student";

    document.getElementById('content').appendChild(button);

    var button2 = document.createElement("button");
  
    // set the button's id attribute
    button2.setAttribute("id", "professor_button");
    // set the button's text content
    button2.textContent = "Professor";

    document.getElementById('content').appendChild(button2);

    // add event listener to student button
    button.addEventListener("click", function() {
        showStudentContent(); 
    });
    // add event listener to professor button
    button2.addEventListener("click", function() {
        showProfessorContent(); 
    });
}

// Professor content
async function showProfessorContent() {
    // create header
    var header = document.createElement("h1");
    header.setAttribute("id", "header");
    header.textContent = "Create Class";

    // create input fields for class name and group size
    var input1 = document.createElement("input");
    input1.setAttribute("id", "class_name");
    input1.setAttribute("type", "text");
    input1.setAttribute("placeholder", "Enter your class name");
    
    // create line break
    var lineBreak = document.createElement("br");

    var input2 = document.createElement("input");
    input2.setAttribute("id", "group_size");
    input2.setAttribute("type", "text");
    input2.setAttribute("placeholder", "Enter max group size");

    var lineBreak2 = document.createElement("br");
    var button = document.createElement("button");
    // set the button's id attribute
    button.setAttribute("id", "next_button");
    // set the button's text content
    button.textContent = "Next";

    // hide the buttons and show the input fields
    document.getElementById('iama').style.display = "none";
    document.getElementById('student_button').style.display = "none";
    document.getElementById('professor_button').style.display = "none";

    // add elements to the content div
    document.getElementById('content').appendChild(header);
    document.getElementById('content').appendChild(input1);
    document.getElementById('content').appendChild(lineBreak);
    document.getElementById('content').appendChild(input2);
    document.getElementById('content').appendChild(lineBreak2);
    document.getElementById('content').appendChild(button);

    // add event listener to button2
    button.addEventListener("click", function() {
        createSuccessfulPage(); 
    });
}

async function createSuccessfulPage() {
    document.getElementById('header').textContent = "Class Created Successfully";
    document.getElementById('class_name').style.display = "none";
    document.getElementById('group_size').style.display = "none";
    document.getElementById('next_button').textContent = "INVITE STUDENT";
    document.getElementById('next_button').addEventListener("click", function() {
        invitePage(); 
    });
}

async function invitePage() {
    
    var input1 = document.createElement("input");
    input1.setAttribute("id", "email");
    input1.setAttribute("type", "text");
    input1.setAttribute("placeholder", "Enter student email");

    var lineBreak = document.createElement("br");
    var button = document.createElement("button");
    // set the button's id attribute
    button.setAttribute("id", "finish_button");
    // set the button's text content
    button.textContent = "FINISHED";

    document.getElementById('header').textContent = "Invite Students";
    document.getElementById('next_button').textContent = "ENTER";
    document.getElementById('content').appendChild(input1);
    document.getElementById('content').appendChild(lineBreak);
    document.getElementById('content').appendChild(button);

    button.addEventListener("click", function() {
        showButtons(); 
    });
}

async function yesButton() {
    document.getElementById('header').textContent = "Create Profile";

    var input2 = document.createElement("textarea");
    input2.setAttribute("id", "AboutMe");
    input2.setAttribute("rows", "10");
    input2.setAttribute("cols", "50");
    input2.setAttribute("type", "text");
    input2.setAttribute("placeholder", "About Me");

    var lineBreak = document.createElement("br");

    

    var groupInput = document.createElement("textarea")
    groupInput.setAttribute("id", "group");
    groupInput.setAttribute("rows", "5");
    groupInput.setAttribute("cols", "50");
    groupInput.setAttribute("type", "text");
    groupInput.setAttribute("placeholder", "Group Members Ex: jd9998, jd9999");

    

    var button = document.createElement("button");
    button.setAttribute("id", "submit");
    button.textContent = "Submit";
    
   
    document.getElementById("calendar").style.display = 'none';
    document.getElementById("Yes").style.display = 'none';
    document.getElementById("No").style.display = 'none';
    document.getElementById('content').appendChild(input2);
    document.getElementById('content').appendChild(lineBreak);
    var newDiv = document.createElement("div");
    newDiv.appendChild(groupInput);
    newDiv.appendChild(lineBreak);
    newDiv.appendChild(button);
    document.getElementById('content').appendChild(newDiv);

button.addEventListener("click", function() {
    submitProfile();
})
}

async function noButton() {
    document.getElementById('header').textContent = "Finalize Your Calendar and then Click Return";

    var returnButton = document.createElement("button");
    returnButton.setAttribute("id", "return");
    returnButton.textContent = "Return";

    document.getElementById("calendar").style.display = 'none';
    document.getElementById("Yes").style.display = 'none';
    document.getElementById("No").style.display = 'none';
    document.getElementById("content").appendChild(returnButton);

    returnButton.addEventListener("click", function() {
        showStudentContent();
    })
}

async function showStudentContent() {
    var header = document.createElement("h1");
    header.setAttribute("id", "header");
    header.textContent = "Is this the correct calendar?";
    
    const user = await gapi.client.gmail.users.getProfile({ 'userId': 'me' }); // Get user profile
    const userEmail = user.result.emailAddress; // Extract user email from profile

    var email = document.createElement("iframe");
    email.setAttribute("id", "calendar");
    email.setAttribute("src", "https://calendar.google.com/calendar/embed?src=" + encodeURIComponent(userEmail) + "&ctz=America%2FNew_Yorkk&mode=week");
    email.style.border = "0";
    email.width = "800";
    email.height = "600";

    var lineBreak = document.createElement("br");
    var button = document.createElement("button");
    button.setAttribute("id", "Yes");
    button.textContent = "Yes";

    var button2 = document.createElement("button")
    button2.setAttribute("id", "No");
    button2.textContent = "No";

    // hide the buttons and show the input fields
    document.getElementById('iama').style.display = "none";
    document.getElementById('student_button').style.display = "none";
    document.getElementById('professor_button').style.display = "none";

    document.getElementById('content').appendChild(header);
    document.getElementById('content').appendChild(email);
    document.getElementById('content').appendChild(lineBreak);
    document.getElementById('content').appendChild(button);
    document.getElementById('content').appendChild(button2);

    button.addEventListener("click", function() {
        yesButton();
    })

    button2.addEventListener("click", function() {
        noButton();
    })

}

// TODO: fix buttons and create pages for yes and no