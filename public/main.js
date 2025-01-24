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
  note_textarea.setAttribute("class","note-input");
  note_textarea.setAttribute("placeholder","Type your note here...")

  note.appendChild(note_textarea);
  wrapper.insertBefore(note, note_add_div);

  note_textarea.addEventListener("mouseleave", () => {
    const textValue = note_textarea.value;
    console.log(textValue);
    const textP = document.createElement("p");
    note.appendChild(textP);
    textP.innerText = textValue;
    note_textarea.remove();
  });

  penIcon.addEventListener('click', function() {
    editNote();
  });

  trashIcon.addEventListener('click',function(){
    deleteNote();
  })
}

function saveData(textData){
    // local storage to store username,
    // get data from backend 
}

function editNote(){
    alert('Edit Note clicked!');
}

function deleteNote() {
    alert('delete ');
}

