import { useEffect, useState } from "react";
import { HoveredLink, Menu } from "./ui/nav-bar";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiMenu, FiX } from "react-icons/fi";

export function Navbar() {
  return (
    <div className="fixed w-full top-0 z-50 bg-black backdrop-blur-sm border-b border-zinc-800">
      <Nav />
    </div>
  );
}

function Nav({ className }) {
  const [isLogin, setIsLogin] = useState(localStorage.getItem("login"));
  const { student } = useSelector((state) => state.getStudent);
  const [active, setActive] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="text-white font-bold text-xl">
            <img src="/logo" alt="logo" className="h-8" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex-1 flex justify-center">
            <Menu setActive={setActive}>
              <HoveredLink to="/home" setActive={setActive} active={active} item="Home">
                Home
              </HoveredLink>
              {isLogin ? (
                <>
                  <a className="text-white hover:text-gray-400 hover:cursor-pointer" href="/courses" >
                    Courses
                  </a>
                  <HoveredLink to="/roadmap" setActive={setActive} active={active} item="roadmaps">
                    Roadmaps
                  </HoveredLink>
                  <HoveredLink to="/chatbot" setActive={setActive} active={active} item="chatbot">
                    Chatbot
                  </HoveredLink>
                  <HoveredLink to="/interest" setActive={setActive} active={active} item="started">
                    Profile
                  </HoveredLink>
                  
                  <HoveredLink to="/upgrade" setActive={setActive} active={active} item="started">
                    Upgrade
                  </HoveredLink>
                  <HoveredLink to="/logout" setActive={setActive} active={active} item="started">
                    Logout
                  </HoveredLink>
                </>
              ) : (
                <HoveredLink to="/started" setActive={setActive} active={active} item="chatbot">
                  Get started
                </HoveredLink>
              )}
            </Menu>
          </div>

          {/* User Profile & Credits (Desktop) */}
          {isLogin && (
            <div className="flex items-center gap-4 ml-4">
              <div className="relative">
                <div className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg text-white font-medium flex items-center text-sm">
                  <span className="mr-1">🎫</span>
                  <span>{student?.credits || 0}</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {student?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          {student && isLogin && (
            <div className="flex items-center gap-2 mr-4">
              <div className="px-2 py-1 bg-indigo-600 rounded-full text-white text-xs font-bold">
                {student.credits || 0} 🎫
              </div>
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-800/95 backdrop-blur-sm border-t border-zinc-700 flex-col">
          <div className=" flex-col px-2 pt-2 pb-3 space-y-1">
            <Menu setActive={setActive} vertical>
              <HoveredLink to="/home" setActive={setActive} active={active} item="Home">
                Home
              </HoveredLink>
              {isLogin ? (
                <>
                  <a className="text-white hover:text-gray-400 hover:cursor-pointer" href="/courses" >
                    Courses
                  </a>
                  <HoveredLink to="/roadmap" setActive={setActive} active={active} item="roadmaps">
                    Roadmaps
                  </HoveredLink>
                  <HoveredLink to="/chatbot" setActive={setActive} active={active} item="chatbot">
                    Chatbot
                  </HoveredLink>
                  {/* <HoveredLink to="/interest" setActive={setActive} active={active} item="started">
                    AI-power
                  </HoveredLink> */}
                  <HoveredLink to="/upgrade" setActive={setActive} active={active} item="started">
                    Upgrade
                  </HoveredLink>
                  <HoveredLink to="/profile" setActive={setActive} active={active} item="started">
                    Profile
                  </HoveredLink>
                  <HoveredLink to="/logout" setActive={setActive} active={active} item="store">
                    Logout
                  </HoveredLink>
                </>
              ) : (
                <HoveredLink to="/started" setActive={setActive} active={active} item="chatbot">
                  Get started
                </HoveredLink>
              )}
            </Menu>
          </div>
          {student && isLogin && (
            <div className="px-4 py-3 border-t border-zinc-700 flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold mr-3">
                {student.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-white text-sm font-medium">
                {student.fullName}
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}