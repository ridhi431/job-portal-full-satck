import { useContext } from 'react'
import { assets } from '../assets/assets'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import ThemeToggle from './ThemeToggle'
import { useState } from "react";
const Navbar = () => {

    const { openSignIn } = useClerk()
    const { user } = useUser()

    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const { setShowRecruiterLogin } = useContext(AppContext)

    return (
        <div className='navbar bg-base-100 shadow-sm px-3 sm:px-6 2xl:px-20 relative z-50'>

            {/* Logo - navbar-start */}
            <div className='navbar-start w-auto flex-1'>
                <h1
                    onClick={() => navigate('/')}
                    className='cursor-pointer text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-primary hover:opacity-80 transition-opacity'
                >
                    Job<span className='text-base-content'>Portal</span>
                </h1>
            </div>

            {/* Right side - navbar-end */}
            <div className='navbar-end w-auto gap-1 sm:gap-2'>
                {
                    user ? (
                        <>
                            {/* Desktop view - full links, hidden on small screens */}
                            <div className='hidden lg:flex items-center gap-3'>
                                <a
                                    href="https://ai-resume-builder-three-omega.vercel.app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='link link-hover text-sm whitespace-nowrap'
                                >
                                    Build Resume
                                </a>
                                <Link to="/applications" className='link link-hover text-sm whitespace-nowrap'>
                                    Applied Jobs
                                </Link>
                                <p className='opacity-40'>|</p>
                                <Link to="/profile" className='link link-hover text-sm whitespace-nowrap'>
                                    My Profile
                                </Link>
                                <p className='opacity-40'>|</p>
                                <p className='text-sm whitespace-nowrap'>
                                    Hi, {user.firstName + " " + user.lastName}
                                </p>
                                <ThemeToggle />
                                <UserButton />
                            </div>

       {/*mobile view - hamburger menu, visible on small screens */}        

<div className="relative lg:hidden">
  {/* Hamburger Button */}
  <button
    type="button"
    className="btn btn-ghost btn-circle"
    aria-label="Toggle menu"
    aria-expanded={isMenuOpen}
    onClick={() => setIsMenuOpen((prev) => !prev)}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>

  {/* Dropdown Menu */}
  {isMenuOpen && (
    <ul className="menu menu-sm absolute right-0 top-full mt-3 w-52 rounded-box bg-base-100 p-2 shadow-xl z-[999]">

      <li className="menu-title">
        Hi, {user?.firstName}
      </li>

      <li>
        <a
          href="https://ai-resume-builder-three-omega.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setIsMenuOpen(false)}
        >
          Build Resume
        </a>
      </li>

      <li>
        <Link
          to="/applications"
          onClick={() => setIsMenuOpen(false)}
        >
          Applied Jobs
        </Link>
      </li>

      <li>
        <Link
          to="/profile"
          onClick={() => setIsMenuOpen(false)}
        >
          My Profile
        </Link>
      </li>

      <li>
        <div className="flex items-center justify-between">
          <span>Theme</span>
          <ThemeToggle />
        </div>
      </li>

      <li>
        <div className="flex justify-center">
          <UserButton />
        </div>
      </li>

    </ul>
  )}
</div>
                        </>
                    ) : (
                        <div className='flex items-center gap-1.5 sm:gap-3'>
                            <button
                                onClick={() => setShowRecruiterLogin(true)}
                                className='btn btn-ghost btn-xs sm:btn-sm whitespace-nowrap px-2 sm:px-3 text-xs sm:text-sm'
                            >
                                Recruiter Login
                            </button>

                            <button
                                onClick={() => openSignIn()}
                                className='btn btn-primary btn-xs sm:btn-sm rounded-full px-3 sm:px-6 text-xs sm:text-sm'
                            >
                                Login
                            </button>

                            <ThemeToggle />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Navbar