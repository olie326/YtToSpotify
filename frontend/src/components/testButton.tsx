import { Button } from "@radix-ui/themes";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function TestButton() {
  const on_click = () => {
    axios.get("http://127.0.0.1:8000/login/reauthenticate");
    window.location.reload();
  };

  return (
    <Button variant="soft" onClick={on_click}>
      Reauthenticate
    </Button>
  );
}
