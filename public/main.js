const url = "http://localhost:3000";

const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

if (!token) {
  alert("You must sign in first!");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function () {
  function addUser(username) {
    const userInfo = document.getElementById("user-info");
    const pEle = document.createElement("p");
    pEle.innerText = `${username}`;

    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Log-Out";
    logoutBtn.addEventListener("click", logout());
    logoutBtn.setAttribute("class", "log-out");
    userInfo.appendChild(pEle);
    userInfo.appendChild(logoutBtn);
  }

  addUser(username);
});

async function logout() {
  localStorage.removeItem("token");
}

function addNote() {
  const wrapper = document.querySelector(".wrapper");
  const note = document.createElement("div");

  const note_add_div = document.querySelector(".note-add");
  note.setAttribute("class", "note");

  const note_icon = document.createElement("div");
  note_icon.setAttribute("class", "note-icons");

  const penIcon = document.createElement("i");
  penIcon.classList.add("fa-solid", "fa-pen-to-square");
  penIcon.setAttribute("title", "Edit Note");

  const trashIcon = document.createElement("i");
  trashIcon.classList.add("fa-solid", "fa-trash");
  trashIcon.setAttribute("title", "Delete Note");

  note_icon.appendChild(penIcon);
  note_icon.appendChild(trashIcon);

  note.appendChild(note_icon);

  const note_textarea = document.createElement("textarea");
  note_textarea.setAttribute("id", "note-input");
  note_textarea.setAttribute("class", "note-input");
  note_textarea.setAttribute("placeholder", "Type your note here...");

  note.appendChild(note_textarea);
  wrapper.insertBefore(note, note_add_div);
  
  note_textarea.addEventListener("mouseleave", () => {
    const textValue = note_textarea.value.trim();
  
    if (!textValue) {
      alert("Note is empty. Please write something before leaving.");
      return;
    }
  
    const textP = document.createElement("p");
    note.appendChild(textP);
    textP.innerText = textValue;
  
    saveData(textValue); 
  
    note_textarea.remove();
  });
  

  penIcon.addEventListener("click", function () {
    editNote();
  });

  trashIcon.addEventListener("click", function () {
    deleteNote();
  });
}


async function saveData(textData) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Token is missing. Please log in again.");
    return;
  }

  try {
    const response = await axios.post(
      `${url}/notes`,
      {
        username: localStorage.getItem("username"),
        notesData: textData, 
      },
      {
        headers: {
          token: token,
        },
      }
    );

    console.log("Response from server:", response.data);
    alert("Note saved successfully!");
  } catch (error) {
    console.error("Error saving note:", error.response?.data || error.message);
    alert("Error saving note. Please check the token or contact support.");
  }
}


function editNote() {
  alert("Edit Note clicked!");
}

function deleteNote() {
  alert("delete ");
}
