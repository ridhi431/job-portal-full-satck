
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import kconvert from 'k-convert'
import moment from 'moment'
import JobCard from '../components/JobCard'
import Footer from '../components/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth, useClerk, useUser } from '@clerk/clerk-react'

const ApplyJob = () => {

  const { id } = useParams()
  const { getToken } = useAuth()
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const navigate = useNavigate()

  const [JobData, setJobData] = useState(null)
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const {
    jobs,
    backendUrl,
    userData,
    userApplications,
    setUserApplications,
    fetchUserData,
    fetchUserApplications
  } = useContext(AppContext)

  // Fetch Job Details
  const fetchJob = async () => {
    try {
      setIsLoading(true)

      const { data } = await axios.get(
        backendUrl + `/api/jobs/${id}`
      )

      if (data.success) {
        setJobData(data.job)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Apply for Job
  const applyHandler = async () => {
    try {
      if (!user) {
        openSignIn()
        return toast.info('Please login to apply for jobs')
      }

      if (isAlreadyApplied) {
        return toast.info('You have already applied for this job')
      }

      let currentUser = userData

      // Fetch user data if not available
      if (!currentUser) {
        const token = await getToken()

        if (token) {
          const { data } = await axios.get(
            backendUrl + '/api/users/user',
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )

          if (data.success) {
            currentUser = data.user

            if (fetchUserData) {
              fetchUserData()
            }
          }
        }
      }

      // Check resume
      if (!currentUser?.resume) {
        navigate('/applications', {
          state: {
            returnTo: `/apply-job/${id}`,
            jobTitle: JobData?.title
          }
        })

        return toast.info('Please upload your resume to apply for jobs')
      }

      const token = await getToken()

      const { data } = await axios.post(
        backendUrl + '/api/users/apply',
        { jobId: JobData._id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (data.success) {
        toast.success(data.message)
        setIsAlreadyApplied(true)
        if (setUserApplications) {
          setUserApplications(prev => [
            ...prev,
            {
              _id: Date.now().toString(),
              jobId: JobData,
              companyId: JobData.companyId,
              date: Date.now(),
              status: 'Pending'
            }
          ])
        }
        if (fetchUserApplications) {
          await fetchUserApplications()
        }
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  // Check if already applied
  const checkAlreadyApplied = () => {
    if (!JobData || !Array.isArray(userApplications)) return

    const hasApplied = userApplications.some(
      item => String(item?.jobId?._id || item?.jobId || '') === String(JobData._id)
    )

    setIsAlreadyApplied(hasApplied)
  }

  useEffect(() => {
    fetchJob()
    if (user && (!userApplications || userApplications.length === 0) && fetchUserApplications) {
      fetchUserApplications()
    }
  }, [id, user])

  useEffect(() => {
    if (JobData) {
      checkAlreadyApplied()
    }
  }, [JobData, userApplications, id])

  // Loading
  if (isLoading) {
    return <Loading />
  }

  // Job Not Found
  if (!JobData) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="card w-full max-w-lg bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">

              <div className="rounded-full bg-error/10 p-4">
                <span className="text-4xl">⚠️</span>
              </div>

              <h2 className="card-title text-2xl">
                Job Not Found
              </h2>

              <p className="text-base-content/60">
                The job you are looking for does not exist,
                has been deleted, or there was a server
                connection error.
              </p>

              <div className="card-actions mt-4">
                <button
                  onClick={() => navigate('/')}
                  className="btn btn-primary"
                >
                  Go Back Home
                </button>
              </div>

            </div>
          </div>
        </div>

        <Footer />
      </>
    )
  }

  // More jobs from the same company
  const appliedJobsIds = new Set(
    (userApplications || []).map(app => String(app?.jobId?._id || app?.jobId || ''))
  )

  const moreJobs = jobs
    .filter(job =>
      String(job._id) !== String(JobData._id) &&
      String(job.companyId?._id || job.companyId) ===
      String(JobData.companyId?._id || JobData.companyId)
    )
    .filter(job => !appliedJobsIds.has(String(job._id)))
    .slice(0, 4)

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-base-200 py-8 sm:py-10">

        <div className="container mx-auto max-w-7xl px-4 2xl:px-8">

          {/* Job Header Card */}
          <div className="card mb-8 border border-base-300 bg-base-100 shadow-sm">

            <div className="card-body p-5 sm:p-8 lg:p-10">

              <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

                {/* Company and Job Details */}
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">

                  <div className="avatar">
                    <div className="h-20 w-20 rounded-xl border border-base-300 bg-base-200 p-2 sm:h-24 sm:w-24">
                      <img
                        src={JobData.companyId.image}
                        alt={JobData.companyId.name}
                      />
                    </div>
                  </div>

                  <div className="text-center sm:text-left">

                    <h1 className="text-2xl font-bold text-base-content sm:text-3xl lg:text-4xl">
                      {JobData.title}
                    </h1>

                    <p className="mt-2 text-base font-medium text-base-content/70">
                      {JobData.companyId.name}
                    </p>

                    <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">

                      <div className="badge badge-outline gap-2 p-3">
                        <img
                          src={assets.location_icon}
                          alt=""
                          className="h-4 w-4"
                        />
                        {JobData.location}
                      </div>

                      <div className="badge badge-outline gap-2 p-3">
                        <img
                          src={assets.person_icon}
                          alt=""
                          className="h-4 w-4"
                        />
                        {JobData.level}
                      </div>

                      <div className="badge badge-outline gap-2 p-3">
                        <img
                          src={assets.money_icon}
                          alt=""
                          className="h-4 w-4"
                        />
                        CTC: {kconvert.convertTo(JobData.salary)}
                      </div>

                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="flex flex-col items-center gap-3 lg:items-end">

                  <button
                    onClick={applyHandler}
                    disabled={isAlreadyApplied}
                    className={`btn btn-primary btn-wide ${
                      isAlreadyApplied ? 'btn-disabled' : ''
                    }`}
                  >
                    {isAlreadyApplied
                      ? '✓ Already Applied'
                      : 'Apply Now'}
                  </button>

                  <p className="text-sm text-base-content/60">
                    Posted {moment(JobData.date).fromNow()}
                  </p>

                </div>

              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">

            {/* Job Description */}
            <div className="lg:col-span-2">

              <div className="card border border-base-300 bg-base-100 shadow-sm">

                <div className="card-body p-5 sm:p-8">

                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <span className="text-xl">📋</span>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold sm:text-2xl">
                        Job Description
                      </h2>
                      <p className="text-sm text-base-content/60">
                        Role details and responsibilities
                      </p>
                    </div>
                  </div>

                  <div
                    className="rich-text max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: JobData.description
                    }}
                  />

                  <div className="divider" />

                  <button
                    onClick={applyHandler}
                    disabled={isAlreadyApplied}
                    className={`btn btn-primary w-full sm:w-fit ${
                      isAlreadyApplied ? 'btn-disabled' : ''
                    }`}
                  >
                    {isAlreadyApplied
                      ? '✓ Already Applied'
                      : 'Apply Now'}
                  </button>

                </div>
              </div>
            </div>

            {/* More Jobs */}
            <div className="space-y-5">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    More Jobs
                  </h2>
                  <p className="mt-1 text-sm text-base-content/60">
                    From {JobData.companyId.name}
                  </p>
                </div>

                <div className="badge badge-primary">
                  {moreJobs.length}
                </div>
              </div>

              {moreJobs.length > 0 ? (

                <div className="flex flex-col gap-4">
                  {moreJobs.map(job => (
                    <JobCard
                      key={job._id}
                      job={job}
                    />
                  ))}
                </div>

              ) : (

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                  <div className="card-body items-center py-8 text-center">

                    <span className="text-3xl">💼</span>

                    <h3 className="font-semibold">
                      No More Jobs
                    </h3>

                    <p className="text-sm text-base-content/60">
                      There are no other available jobs
                      from this company right now.
                    </p>

                  </div>
                </div>

              )}

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  )
}

export default ApplyJob