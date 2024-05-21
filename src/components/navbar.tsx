import { Button } from "./ui/button";
import { SquarePen } from "lucide-react";
import { MessagesSquare } from "lucide-react";

const Navbar = () => {
  return (
    <header
      className="from-background/10 via-background/50 to-background/80 fixed top-0 z-50 flex h-16 w-full shrink-0 items-center 
    justify-between border-b bg-gradient-to-b px-4 backdrop-blur-xl"
    >
      <a href="">
        <div className="flex items-center gap-2">
          <MessagesSquare /> <h1 className="text-xl font-semibold">DakoBot</h1>
        </div>
      </a>
      <div>
        <a href="">
          <Button>
            <SquarePen className="mr-2 h-4 w-4" size={16} /> Chat Baru
          </Button>
        </a>
      </div>
    </header>
  );
};

export default Navbar;
