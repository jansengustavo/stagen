import { useState } from "react";
import Logo from "../Logo";
import UserDropdown from "../UserDropdown";
import LoginModal from "../LoginModal";
import { Button } from "antd";
import { useApp } from "../../hooks/useApp";
import "./styles.scss";

interface NavbarProps {
  activeLink: "home" | "services" | "tasks" | "timer" | "contact";
}

function Navbar({ activeLink }: NavbarProps) {
  const { token } = useApp();
  const isLogged = token !== null;
  const isDashboard = activeLink === "tasks" || activeLink === "timer";
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="navbar">
      <a className="navbar__logo" href="/stagen/">
        <Logo size={36} showText={true} />
      </a>

      {isDashboard ? (
        <>
          <nav className="navbar__links">
            <a
              href="/stagen/tasks"
              className={`navbar__link ${activeLink === "tasks" ? "navbar__link--active" : ""}`}
            >
              Tasks
            </a>
            <a
              href="/stagen/timer"
              className={`navbar__link ${activeLink === "timer" ? "navbar__link--active" : ""}`}
            >
              Timer
            </a>
          </nav>

          <div className="navbar__action">
            <UserDropdown />
          </div>
        </>
      ) : (
        <>
          <nav className="navbar__links">
            <a
              href="/stagen/"
              className={`navbar__link ${activeLink === "home" ? "navbar__link--active" : ""}`}
            >
              Home
            </a>
            <a
              href="/stagen/services"
              className={`navbar__link ${activeLink === "services" ? "navbar__link--active" : ""}`}
            >
              Services
            </a>
            <a
              href="/stagen/contact"
              className={`navbar__link ${activeLink === "contact" ? "navbar__link--active" : ""}`}
            >
              Contact
            </a>
          </nav>

          {isLogged ? (
            <div
              className="navbar__action"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <Button
                type="primary"
                href="/stagen/tasks"
                className="navbar__btn"
              >
                Dashboard
              </Button>
              <UserDropdown />
            </div>
          ) : (
            <Button
              type="primary"
              className="navbar__btn"
              onClick={() => setIsModalOpen(true)}
            >
              Login
            </Button>
          )}
        </>
      )}

      <LoginModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}

export default Navbar;
