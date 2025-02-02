const url = "http://localhost:3000";

const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

// Redirect if not logged in
if (!token) {
  alert("You must sign in first!");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function () {
  displayUser(username);
  fetchNotes();
});

// Function to display logged-in user
function displayUser(username) {
  const userInfo = document.getElementById("user-info");

  const pEle = document.createElement("p");
  pEle.innerText = username;

  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Log-Out";
  logoutBtn.setAttribute("class", "log-out");
  logoutBtn.addEventListener("click", logout);

  userInfo.appendChild(pEle);
  userInfo.appendChild(logoutBtn);
}

// Logout function
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "index.html";
}

// Function to add a new note
function addNote() {
  const wrapper = document.querySelector(".wrapper");
  const note = document.createElement("div");
  note.setAttribute("class", "note");

  const note_add_div = document.querySelector(".note-add");

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
  note_textarea.setAttribute("class", "note-input");
  note_textarea.setAttribute("placeholder", "Type your note here...");

  note.appendChild(note_textarea);
  wrapper.insertBefore(note, note_add_div);

  note_textarea.addEventListener("mouseleave", async () => {
    const textValue = note_textarea.value.trim();
    if (!textValue) {
      alert("Note is empty. Please write something before leaving.");
      return;
    }

    try {
      const savedNote = await saveData(textValue);
      note.setAttribute("data-id", savedNote.id);
      note_textarea.remove();
      renderNoteContent(note, savedNote.id, textValue);
    } catch (error) {
      alert("Failed to save note!");
    }
  });

  penIcon.addEventListener("click", () => editNote(note));
  trashIcon.addEventListener("click", () => deleteNote(note));
}

// Function to render note text content
function renderNoteContent(note, id, text) {
  note.innerHTML = ""; // Clear existing content

  const note_icon = document.createElement("div");
  note_icon.setAttribute("class", "note-icons");

  const penIcon = document.createElement("i");
  penIcon.classList.add("fa-solid", "fa-pen-to-square");
  penIcon.setAttribute("title", "Edit Note");
  penIcon.addEventListener("click", () => editNote(note));

  const trashIcon = document.createElement("i");
  trashIcon.classList.add("fa-solid", "fa-trash");
  trashIcon.setAttribute("title", "Delete Note");
  trashIcon.addEventListener("click", () => deleteNote(note));

  note_icon.appendChild(penIcon);
  note_icon.appendChild(trashIcon);
  note.appendChild(note_icon);

  const textP = document.createElement("p");
  textP.innerText = text;
  note.appendChild(textP);
}

// Function to save note to backend
async function saveData(textData) {
  try {
    const response = await axios.post(
      `${url}/notes`,
      { notesData: textData },
      { headers: { token: token } }
    );
    console.log("Note saved:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving note:", error.response?.data || error.message);
    throw error;
  }
}

// Function to fetch and display notes
async function fetchNotes() {
  try {
    const response = await axios.get(`${url}/notes`, { headers: { token: token } });
    const notes = response.data;

    if (notes.length > 0) {
      const wrapper = document.querySelector(".wrapper");
      notes.forEach((note) => {
        const noteElement = document.createElement("div");
        noteElement.setAttribute("class", "note");
        noteElement.setAttribute("data-id", note.id);
        renderNoteContent(noteElement, note.id, note.notesData);
        wrapper.insertBefore(noteElement, document.querySelector(".note-add"));
      });
    }
  } catch (error) {
    console.error("Error fetching notes:", error.response?.data || error.message);
  }
}

// Function to edit a note
async function editNote(note) {
  const noteId = note.getAttribute("data-id");
  const text = note.querySelector("p").innerText;
  note.innerHTML = "";

  const textarea = document.createElement("textarea");
  textarea.setAttribute("class", "note-input");
  textarea.value = text;
  note.appendChild(textarea);

  textarea.addEventListener("mouseleave", async () => {
    const newText = textarea.value.trim();
    if (!newText) {
      alert("Note is empty. Please write something before leaving.");
      return;
    }

    try {
      await axios.put(
        `${url}/notes/${noteId}`,
        { notesData: newText },
        { headers: { token: token } }
      );
      renderNoteContent(note, noteId, newText);
    } catch (error) {
      console.error("Error updating note:", error.response?.data || error.message);
      alert("Failed to update note!");
    }
  });
}

// Function to delete a note
async function deleteNote(note) {
  const noteId = note.getAttribute("data-id");

  try {
    await axios.delete(`${url}/notes/${noteId}`, { headers: { token: token } });
    note.remove();
  } catch (error) {
    console.error("Error deleting note:", error.response?.data || error.message);
    alert("Failed to delete note!");
  }
}
