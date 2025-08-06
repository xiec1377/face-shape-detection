import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import FaceMeshComponent from "./FaceMeshComponent";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [faceShape, setFaceShape] = useState("");

  // useEffect(() => {
  //   getNotes();
  // }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          // successful deletion
          alert("note deleted");
        } else {
          alert("failed to delete note");
        }
        getNotes(); // update after deleting note
      })
      .catch((error) => alert(error));
  };

  const createNote = (e) => {
    console.log("creating note...");
    // e comes from form
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) {
          // successfully created noted
          alert("note created!");
        } else {
          alert("failed to create note");
        }
        getNotes(); // update after creating note
      })
      .catch((error) => alert(error));
  };
  return (
    <div>
      <h2>Create a note</h2>
      <FaceMeshComponent setFaceshape={setFaceShape} />
      <div>the face shape is {faceShape}</div>
      {/* <form onSubmit={createNote}>
        <label htmlFor="title">title</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        ></input>
        <label htmlFor="content">content</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          onChange={(e) => setContent(e.target.value)}
          value={content}
        ></textarea>
        <button className="form-button" type="submit">
          Submit
        </button>
      </form>
      {notes.map((note) => (
        <Note note={note} onDelete={deleteNote} key={note.id}></Note>
      ))} */}
    </div>
  );
}

export default Home;
