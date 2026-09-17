import { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const RecruiterLogin = () => {

    const navigate = useNavigate()

    const [state, setState] = useState('Login')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const [image, setImage] = useState(false)

    const [isTextDataSubmited, setIsTextDataSubmited] = useState(false)

    const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } = useContext(AppContext)

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        if (state == "Sign Up" && !isTextDataSubmited) {
            return setIsTextDataSubmited(true)
        }

        try {

            if (state === "Login") {

                const { data } = await axios.post(backendUrl + '/api/company/login', { email, password })

                if (data.success) {
                    setCompanyData(data.company)
                    setCompanyToken(data.token)
                    localStorage.setItem('companyToken', data.token)
                    setShowRecruiterLogin(false)
                    navigate('/dashboard')
                } else {
                    toast.error(data.message)
                }

            } else {

                const formData = new FormData()
                formData.append('name', name)
                formData.append('password', password)
                formData.append('email', email)
                formData.append('image', image)

                const { data } = await axios.post(backendUrl + '/api/company/register', formData)

                if (data.success) {
                    setCompanyData(data.company)
                    setCompanyToken(data.token)
                    localStorage.setItem('companyToken', data.token)
                    setShowRecruiterLogin(false)
                    navigate('/dashboard')
                } else {
                    toast.error(data.message)
                }

            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    return (
        <div className='modal modal-open px-4'>
            <div className='modal-box max-w-sm p-6 sm:p-10'>

                <form onSubmit={onSubmitHandler} className='relative text-base-content/70'>
                    <h1 className='text-center text-2xl text-base-content font-medium'>Recruiter {state}</h1>
                    <p className='text-sm'>Welcome back! Please sign in to continue </p>

                    {state === "Sign Up" && isTextDataSubmited
                        ? <>

                            <div className='flex items-center gap-4 my-10'>
                                <label htmlFor="image" className='avatar cursor-pointer'>
                                    <div className='w-16 rounded-full'>
                                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                                    </div>
                                    <input onChange={e => setImage(e.target.files[0])} type="file" id='image' hidden />
                                </label>
                                <p>Upload Company <br /> logo</p>
                            </div>

                        </>
                        : <>

                            {state !== 'Login' && (
                                <label className='input input-bordered rounded-full flex items-center gap-2 mt-5'>
                                    <img src={assets.person_icon} alt="" />
                                    <input
                                        className='grow text-sm'
                                        onChange={e => setName(e.target.value)}
                                        value={name}
                                        type="text"
                                        placeholder='Company Name'
                                        required
                                    />
                                </label>
                            )}

                            <label className='input input-bordered rounded-full flex items-center gap-2 mt-5'>
                                <img src={assets.email_icon} alt="" />
                                <input
                                    className='grow text-sm'
                                    onChange={e => setEmail(e.target.value)}
                                    value={email}
                                    type="email"
                                    placeholder='Email Id'
                                    required
                                />
                            </label>

                            <label className='input input-bordered rounded-full flex items-center gap-2 mt-5'>
                                <img src={assets.lock_icon} alt="" />
                                <input
                                    className='grow text-sm'
                                    onChange={e => setPassword(e.target.value)}
                                    value={password}
                                    type="password"
                                    placeholder='Password'
                                    required
                                />
                            </label>

                        </>}

                    {state === "Login" && (
                        <p className='text-sm link link-primary mt-4'>Forgot password?</p>
                    )}

                    <button type='submit' className='btn btn-primary w-full rounded-full mt-4'>
                        {state === 'Login' ? 'login' : isTextDataSubmited ? 'create account' : 'next'}
                    </button>

                    {
                        state === 'Login'
                            ? <p className='mt-5 text-center'>Don't have an account? <span className='link link-primary' onClick={() => setState("Sign Up")}>Sign Up</span></p>
                            : <p className='mt-5 text-center'>Already have an account? <span className='link link-primary' onClick={() => setState("Login")}>Login</span></p>
                    }

                    <button
                        type='button'
                        onClick={e => setShowRecruiterLogin(false)}
                        className='btn btn-sm btn-circle btn-ghost absolute top-0 right-0'
                    >
                        <img src={assets.cross_icon} alt="" />
                    </button>

                </form>
            </div>
        </div>
    )
}

export default RecruiterLogin