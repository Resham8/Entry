function addNote(){
    const wrapper = document.getElementsByClassName("wrapper");
    const note = document.createElement("div");
    note.setAttribute("class","note")
    const note_textarea = document.createElement("textarea");
    note_textarea.setAttribute("id","note-input");
    note.appendChild(note_textarea);
    wrapper.appendChild(note);

    const note_text = document.getElementById("note-input").value;
    console.log(note_text);
}