import { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function LoginButton() {
  const [redirectUrl, setRedirectUrl] = useState("");

  function auth_redirect() {
    axios.get("http://127.0.0.1:8000/login/request").then((response) => {
      setRedirectUrl(response.data.url);

      useEffect(() => {
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      }, [redirectUrl]);
    });
  }

  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  return (
    <button
      className="btn btn-light"
      onClick={() => {
        auth_redirect();
      }}
    >
      Login to Spotify
    </button>
  );
}