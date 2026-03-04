import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { navLinks } from "../constants"
import { logo, menu, close } from "../assets"

const filteredLinks = navLinks.filter((l) => l.id !== "/")

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <nav className="w-full fixed top-0 z-20 px-6 sm:px-16 py-4"
      style={{ background: "rgba(5,8,22,0.75)", backdropFilter: "blur(12px)",
               borderBottom: "1px solid rgba(148,163,184,0.06)" }}>
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" onClick={() => {
          setMenuOpen(false)
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
          className="flex items-center gap-2.5 group">
          <img src={logo} alt="logo" className="w-8 h-8 object-contain transition-transform duration-300 group-hover:rotate-12" />
          <span className="text-white text-[17px] font-bold tracking-tight">
            Akash <span className="hidden sm:inline text-[#7c3aed]">.</span>
          </span>
        </Link>

        <ul className="list-none hidden sm:flex flex-row items-center gap-1">
          {filteredLinks.map((link) => {
            const isActive = pathname === link.id
            return (
              <li key={link.id}>
                <Link
                  to={link.id}
                  className="relative px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-200 group"
                  style={{ color: isActive ? "#f8fafc" : "#94a3b8" }}
                >
                  <span
                    className="absolute inset-0 rounded-lg transition-opacity duration-200"
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(13,148,136,0.15))"
                        : "rgba(148,163,184,0)",
                      opacity: isActive ? 1 : 0,
                    }}
                  />
                  {isActive && (
                    <span
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "#7c3aed" }}
                    />
                  )}
                  <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "rgba(148,163,184,0.06)" }} />
                  <span className="relative">{link.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <button
          className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-200"
          style={{ background: "rgba(148,163,184,0.08)" }}
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          <img src={menuOpen ? close : menu} alt="menu" className="w-5 h-5 object-contain" />
        </button>
      </div>

      <div
        className="sm:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: menuOpen ? "300px" : "0px",
          opacity: menuOpen ? 1 : 0,
        }}
      >
        <div className="flex flex-col gap-1 pt-3 pb-2 px-1">
          {filteredLinks.map((link) => {
            const isActive = pathname === link.id
            return (
              <Link
                key={link.id}
                to={link.id}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200"
                style={{
                  color: isActive ? "#f8fafc" : "#94a3b8",
                  background: isActive
                    ? "linear-gradient(135deg,rgba(124,58,237,0.18),rgba(13,148,136,0.12))"
                    : "transparent",
                  borderLeft: isActive ? "2px solid #7c3aed" : "2px solid transparent",
                }}
              >
                {link.title}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navbar