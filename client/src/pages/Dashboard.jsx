import { useContext, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import ThemeToggle from '../components/ThemeToggle'

const Dashboard = () => {

    const navigate = useNavigate()

    const { companyData, setCompanyData, setCompanyToken } = useContext(AppContext)

    // Function to logout for company
    const logout = () => {
        setCompanyToken(null)
        localStorage.removeItem('companyToken')
        setCompanyData(null)
        navigate('/')
    }

    useEffect(() => {
        if (companyData) {
            navigate('/dashboard/manage-jobs')
        }
    }, [companyData])

    return (
        <div className='min-h-screen bg-base-200'>

            {/* Navbar for Recruiter Panel */}
            <div className='navbar bg-base-100 shadow-sm px-5'>
                <div className='navbar-start'>
                    <h1
        onClick={() => navigate('/')}
        className='cursor-pointer text-2xl sm:text-3xl font-extrabold tracking-tight text-primary hover:opacity-80 transition-opacity'
    >
        Job<span className='text-base-content'>Portal</span>
    </h1>
                </div>
                
                <ThemeToggle/>
     
                {companyData && (
                    <div className='navbar-end gap-3'>
                        <p className='max-sm:hidden text-sm text-base-content/70'>
                            Welcome, <span className='font-medium text-base-content'>{companyData.name}</span>
                        </p>

                        <div className='dropdown dropdown-end'>
                            <div tabIndex={0} role="button" className='btn btn-ghost btn-circle avatar'>
                                <div className='w-9 rounded-full ring ring-primary/30 ring-offset-base-100 ring-offset-1'>
                                    <img src={companyData.image} alt="profile" />
                                </div>
                            </div>
                            <ul tabIndex={0} className='menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-40 p-2 shadow-lg border border-base-300'>
                                <li>
                                    <a onClick={logout} className='text-error'>
                                        Logout
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            <div className='flex items-start'>

                {/* Left Sidebar */}
                <div className='min-h-[calc(100vh-4rem)] border-r border-base-300 bg-base-100'>
                    <ul className='menu menu-vertical pt-5 w-full sm:w-56'>
                        <li>
                            <NavLink
                                to={'/dashboard/add-job'}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-none sm:rounded-lg ${isActive ? 'active bg-primary/10 text-primary font-medium border-r-4 sm:border-r-0 border-primary' : ''}`
                                }
                            >
                                <img className='min-w-4 w-4' src={assets.add_icon} alt="" />
                                <span className='max-sm:hidden'>Add Job</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to={'/dashboard/manage-jobs'}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-none sm:rounded-lg ${isActive ? 'active bg-primary/10 text-primary font-medium border-r-4 sm:border-r-0 border-primary' : ''}`
                                }
                            >
                                <img className='min-w-4 w-4' src={assets.home_icon} alt="" />
                                <span className='max-sm:hidden'>Manage Jobs</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to={'/dashboard/view-applications'}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-none sm:rounded-lg ${isActive ? 'active bg-primary/10 text-primary font-medium border-r-4 sm:border-r-0 border-primary' : ''}`
                                }
                            >
                                <img className='min-w-4 w-4' src={assets.person_tick_icon} alt="" />
                                <span className='max-sm:hidden'>View Applications</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className='flex-1 p-2 sm:p-5'>
                    <Outlet />
                </div>

            </div>

        </div>
    )
}

export default Dashboard