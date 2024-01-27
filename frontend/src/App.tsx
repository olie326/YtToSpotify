import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import LoginButton from "./components/LoginButton";
import TestButton from "./components/testButton";
import SearchBar from "./components/searchBar";
import Nav from "./components/Nav";

axios.defaults.withCredentials = true;

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/login/authenticated").then((response) => {
      console.log("whattt", response);
      if (response.data.is_authenticated === "true") {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });
  }, []);

  return (
    <div className="d-flex flex-column justify-content-center text-center">
      <Nav />
      <h1 className="display-1 m-4 mt-5 mb-2">My Web Tool</h1>
      <div
        className="container justify-content-center"
        style={{ maxWidth: "900px" }}
      >
        <p className="col mb-5 text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut velit
          ac ex consectetur commodo. Nulla facilisi. Nullam sollicitudin metus
          at justo lacinia, sit amet mattis lacus placerat. Proin maximus semper
          libero, eu convallis magna lobortis vel. Quisque vitae eros nec ex
        </p>
      </div>
      <div className="d-flex flex-row justify-content-center">
        {authenticated ? <SearchBar /> : <LoginButton />}
      </div>
      <TestButton />
    </div>
  );
}

export default App;
