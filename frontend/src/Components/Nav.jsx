import { useEffect, useState } from "react";
import { HoveredLink, Menu } from "./ui/nav-bar";
import { cn } from "../lib/utils";

export function Navbar() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Nav className="top-2" />
    </div>
  );
}

function Nav({ className }) {

  

  const [isLogin, setisLogin] = useState(JSON.parse(localStorage.getItem("combinedFormData")));
  const [active, setActive] = useState(null);

  return (
    <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}>
      <Menu setActive={setActive}>
        <HoveredLink to="/" setActive={setActive} active={active} item="Home">
          Home
        </HoveredLink>
        {isLogin ?
          <>
            <HoveredLink to="/courses" setActive={setActive} active={active} item="courses">
              Courses
            </HoveredLink>
            <HoveredLink to="/roadmap" setActive={setActive} active={active} item="roadmaps">
              Roadmaps
            </HoveredLink>
            <HoveredLink to="/chatbot" setActive={setActive} active={active} item="chatbot">
              Chatbot
            </HoveredLink>
            <HoveredLink to="/started" setActive={setActive} active={active} item="started">
              AI-power
            </HoveredLink>
            <HoveredLink to="/rewards" setActive={setActive} active={active} item="rewards">
              Rewards
            </HoveredLink>
            <HoveredLink to="/store" setActive={setActive} active={active} item="store">
              Store
            </HoveredLink>
          </>
          :
          <>
            <HoveredLink to="/started" setActive={setActive} active={active} item="chatbot">
              Get started
            </HoveredLink>
          </>
          }
      </Menu>
    </div>
  );
}
