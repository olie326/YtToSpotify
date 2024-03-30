import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@radix-ui/themes";
import { auth_redirect } from "@/api/apiConfig";

axios.defaults.withCredentials = true;

export default function LoginButton() {
  const [redirectUrl, setRedirectUrl] = useState("");

  const handleClick = () => {
    auth_redirect().then((response) => setRedirectUrl(response));
  };

  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  return (
    <div className="max-w-[688px] w-full">
      <Button size="4" onClick={handleClick} className="w-full">
        Login to Spotify
      </Button>
    </div>
  );
}
