import { useEffect, useState } from "react";
import { HoveredLink, Menu } from "./ui/nav-bar";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Nav className="top-2" />
    </div>
  );
}

function Nav({ className }) {



  const [isLogin, setisLogin] = useState(localStorage.getItem("login"));
  const [active, setActive] = useState(null);

  return (
    <div className="flex fixed top-6 z-[99] justify-between w-[80vw]  items-center">
      <div>
        <img src="/logo" alt="logo" />
      </div>
      <div className={cn(" inset-x-0 max-w-2xl mx-auto z-50", className)}>
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
              <HoveredLink to="/interest" setActive={setActive} active={active} item="started">
                AI-power
              </HoveredLink>
              <HoveredLink to="/upgrade" setActive={setActive} active={active} item="started">
                Upgrade
              </HoveredLink>
              <HoveredLink to="/profile" setActive={setActive} active={active} item="started">
                Profile
              </HoveredLink>
              {/* <HoveredLink to="/rewards" setActive={setActive} active={active} item="rewards">
              Rewards
            </HoveredLink> */}
              <HoveredLink to="/logout" setActive={setActive} active={active} item="store">
                Logout
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
      <div>
        <Link className="text-white float-right" to={"/admin"}>
          Go to Admin
        </Link>
      </div>
    </div>
  );
}
