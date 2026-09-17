import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import moment from 'moment'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { useAuth, useUser, useClerk } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const Applications = () => {

  const location = useLocation()
  const navigate = useNavigate()

  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const { openSignIn } = useClerk()

  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)

  const { backendUrl, userData, userApplications, fetchUserData, fetchUserApplications } = useContext(AppContext)

  const updateResume = async () => {

    if (!resume) {
      return toast.error('Please select a resume file first')
    }

    try {

      const formData = new FormData()
      formData.append('resume', resume)

      const token = await getToken()

      const { data } = await axios.post(backendUrl + '/api/users/update-resume',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        await fetchUserData()

        if (location.state?.returnTo) {
          toast.info(`Redirecting back to job...`)
          setTimeout(() => {
            navigate(location.state.returnTo)
          }, 1200)
        }
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

    setIsEdit(false)
    setResume(null)
  }

  useEffect(() => {
    if (user) {
      if (!userData) {
        fetchUserData()
      }
      fetchUserApplications()
    }
  }, [user])

  if (!isLoaded) {
    return <Loading />
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className='min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4'>
          <h2 className='text-3xl font-semibold text-base-content'>Access Denied</h2>
          <p className='text-base-content/60 max-w-md'>You must be signed in to view your job applications.</p>
          <button onClick={() => openSignIn()} className='btn btn-primary rounded-full px-6'>
            Login to Continue
          </button>
        </div>
        <Footer />
      </>
    )
  }

  if (!userData) {
    return <Loading />
  }

  return (
    <>
      <Navbar />
      <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>

        {location.state?.returnTo && (
          <div role="alert" className='alert alert-info alert-soft mb-6 flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
            <div>
              <p className='font-medium'>Resume required to apply for: {location.state.jobTitle || 'Job'}</p>
              <p className='text-xs opacity-80 mt-0.5'>Please select your resume PDF and click <strong>Save</strong>. You will be automatically redirected back to complete your application.</p>
            </div>
            <button onClick={() => navigate(location.state.returnTo)} className='btn btn-info btn-xs whitespace-nowrap'>
              Cancel & Return
            </button>
          </div>
        )}

        <h2 className='text-xl font-semibold text-base-content'>Your Resume</h2>
        <div className='flex gap-2 mb-6 mt-3'>
          {
            isEdit || userData && userData.resume === ""
              ? <>
                <label className='flex items-center cursor-pointer' htmlFor="resumeUpload">
                  <span className='btn btn-soft btn-primary mr-2'>{resume ? resume.name : "Select Resume"}</span>
                  <input id='resumeUpload' onChange={e => setResume(e.target.files[0])} accept='application/pdf' type="file" hidden />
                  <img src={assets.profile_upload_icon} alt="" />
                </label>
                <button onClick={updateResume} className='btn btn-success btn-soft'>Save</button>
              </>
              : <div className='flex gap-2'>
                <a target='_blank' href={userData.resume} className='btn btn-soft btn-primary'>
                  Resume
                </a>
                <button onClick={() => setIsEdit(true)} className='btn btn-outline btn-neutral'>
                  Edit
                </button>
              </div>
          }
        </div>

        <h2 className='text-xl font-semibold mb-4 text-base-content'>Jobs Applied</h2>

        {userApplications.length === 0 ? (
          <div className='card bg-base-100 border border-base-300 shadow-sm'>
            <div className='card-body items-center text-center py-12'>
              <span className='text-4xl'>📄</span>
              <h3 className='text-lg font-semibold mt-2'>No Applications Yet</h3>
              <p className='text-base-content/60 max-w-sm'>You haven't applied for any jobs yet. Browse available jobs and start applying!</p>
            </div>
          </div>
        ) : (
          <div className='overflow-x-auto rounded-lg border border-base-300'>
            <table className='table bg-base-100'>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Job Title</th>
                  <th className='max-sm:hidden'>Location</th>
                  <th className='max-sm:hidden'>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userApplications.map((job, index) => (
                  <tr key={index} className='hover:bg-base-200'>
                    <td className='flex items-center gap-2'>
                      {job.companyId ? (
                        <>
                          <img className='w-8 h-8 rounded-full object-cover' src={job.companyId.image} alt="" />
                          {job.companyId.name}
                        </>
                      ) : (
                        <span className='text-base-content/40'>Unknown Company</span>
                      )}
                    </td>
                    <td>{job.jobId?.title || <span className='text-base-content/40'>Job Removed</span>}</td>
                    <td className='max-sm:hidden'>{job.jobId?.location || '-'}</td>
                    <td className='max-sm:hidden'>{moment(job.date).format('ll')}</td>
                    <td>
                      <span className={`badge ${job.status === 'Accepted' ? 'badge-success' : job.status === 'Rejected' ? 'badge-error' : 'badge-info'} badge-soft`}>
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
      <Footer />
    </>
  )
}

export default Applications