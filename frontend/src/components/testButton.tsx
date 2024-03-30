import { reauthenticate } from "@/api/apiConfig";
import { Button, Container } from "@radix-ui/themes";

export default function TestButton() {
  const handleClick = () => {
    reauthenticate().then(() => window.location.reload());
  };

  return (
    <div className="max-w-[688px] w-full">
      <Button variant="soft" size="4" onClick={handleClick} className="w-full">
        Reauthenticate
      </Button>
    </div>
  );
}
