
import { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const ViewApplications = () => {

  const { backendUrl, companyToken } = useContext(AppContext)

  const [applicants, setApplicants] = useState(false)

  // Function to fetch company Job Applications data
  const fetchCompanyJobApplications = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/company/applicants',
        { headers: { token: companyToken } }
      )

      if (data.success) {
        setApplicants([...data.applications].reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Function to Update Job Applications Status
  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/company/change-status',
        { id, status },
        { headers: { token: companyToken } }
      )

      if (data.success) {
        toast.success(`Application ${status}`)
        fetchCompanyJobApplications()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications()
    }
  }, [companyToken])

  // Loading state
  if (applicants === false) {
    return <Loading />
  }

  // Empty state
  if (applicants.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <div className="card w-full max-w-md bg-base-100 shadow-md">
          <div className="card-body items-center text-center">
            <div className="text-5xl">📄</div>
            <h2 className="card-title">No Applications Available</h2>
            <p className="text-base-content/60">
              Job applications will appear here when candidates apply.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
              View Applications
            </h1>
            <p className="mt-1 text-sm text-base-content/60">
              Manage and review candidates who applied for your jobs.
            </p>
          </div>

          <div className="badge badge-primary badge-lg">
            {applicants.length} Applications
          </div>
        </div>

        {/* Applications Table */}
        <div className="card overflow-visible border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-0">

            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">

                {/* Table Head */}
                <thead>
                  <tr className="bg-base-200 text-base-content">
                    <th>#</th>
                    <th>Candidate</th>
                    <th className="hidden md:table-cell">Job Title</th>
                    <th className="hidden md:table-cell">Location</th>
                    <th>Resume</th>
                    <th>Status / Action</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {applicants.map((applicant, index) => (
                    <tr key={applicant._id}>

                      {/* Index */}
                      <th>{index + 1}</th>

                      {/* Candidate */}
                      <td>
                        <div className="flex items-center gap-3">

                          <div className="avatar hidden sm:inline-flex">
                            <div className="h-10 w-10 rounded-full">
                              {applicant.userId ? (
                                <img
                                  src={applicant.userId.image}
                                  alt={applicant.userId.name}
                                />
                              ) : (
                                <div className="bg-base-300 h-full w-full flex items-center justify-center text-base-content/40">?</div>
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="font-semibold text-base-content">
                              {applicant.userId?.name || 'Unknown User'}
                            </div>

                            <div className="text-xs text-base-content/60 md:hidden">
                              {applicant.jobId?.title || 'Job Removed'}
                            </div>
                          </div>

                        </div>
                      </td>

                      {/* Job Title */}
                      <td className="hidden md:table-cell">
                        {applicant.jobId?.title || 'Job Removed'}
                      </td>

                      {/* Location */}
                      <td className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          {applicant.jobId?.location || '-'}
                        </div>
                      </td>

                      {/* Resume */}
                      <td>
                        {applicant.userId?.resume ? (
                          <a
                            href={applicant.userId.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline btn-info"
                          >
                            Resume
                            <img
                              src={assets.resume_download_icon}
                              alt=""
                              className="h-4 w-4"
                            />
                          </a>
                        ) : (
                          <span className="badge badge-ghost badge-sm">No Resume</span>
                        )}
                      </td>

                      {/* Status / Action */}
                      <td>
                        {applicant.status === 'Pending' ? (

                          <div className="dropdown dropdown-end">
                            <button
                              type="button"
                              tabIndex={0}
                              className="btn btn-sm btn-outline"
                            >
                              Action
                              <span className="text-lg">⋮</span>
                            </button>

                            <ul
                              tabIndex={0}
                              className="dropdown-content menu z-50 mt-2 w-40 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
                            >
                              <li>
                                <button
                                  type="button"
                                  className="text-success"
                                  onClick={() =>
                                    changeJobApplicationStatus(
                                      applicant._id,
                                      'Accepted'
                                    )
                                  }
                                >
                                  ✓ Accept
                                </button>
                              </li>

                              <li>
                                <button
                                  type="button"
                                  className="text-error"
                                  onClick={() =>
                                    changeJobApplicationStatus(
                                      applicant._id,
                                      'Rejected'
                                    )
                                  }
                                >
                                  ✕ Reject
                                </button>
                              </li>
                            </ul>
                          </div>

                        ) : (

                          <div
                            className={`badge ${
                              applicant.status === 'Accepted'
                                ? 'badge-success'
                                : 'badge-error'
                            } badge-outline`}
                          >
                            {applicant.status}
                          </div>

                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            {/* Empty filtered result */}
            {applicants.length === 0 && (
              <div className="p-8 text-center text-base-content/60">
                No valid applications found.
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}

export default ViewApplications