import axios from "axios";

axios.defaults.withCredentials = true;

export default function TestButton() {
  const on_click = () => {
    axios.get("http://127.0.0.1:8000/login/reauthenticate");
    window.location.reload();
  };

  return (
    <button type="button" className="btn btn-light" onClick={on_click}>
      click to reauthenticate
    </button>
  );
}
