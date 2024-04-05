import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <header
      className="from-background/10 via-background/50 to-background/80 fixed top-0 z-50 flex h-16 w-full shrink-0 items-center 
    justify-between border-b bg-gradient-to-b px-4 backdrop-blur-xl"
    >
      <div className="flex items-center">
        <a href="">Dako Chatbot</a>
      </div>
      <div>
        <Button>New Chat</Button>
      </div>
    </header>
  );
};

export default Navbar;
