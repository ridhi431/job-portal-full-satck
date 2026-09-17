
import { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const ManageJobs = () => {

  const navigate = useNavigate()

  const [jobs, setJobs] = useState(false)

  const { backendUrl, companyToken } = useContext(AppContext)

  // Function to fetch company jobs
  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/company/list-jobs',
        { headers: { token: companyToken } }
      )

      if (data.success) {
        setJobs(data.jobsData.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Function to change job visibility
  const changeJobVisiblity = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/company/change-visiblity',
        { id },
        { headers: { token: companyToken } }
      )

      if (data.success) {
        toast.success(data.message)
        fetchCompanyJobs()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs()
    }
  }, [companyToken])

  return jobs ? (
    jobs.length === 0 ? (

      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-xl">
              No Jobs Available
            </h2>

            <p className="text-base-content/60">
              You haven't posted any jobs yet.
            </p>

            <button
              onClick={() => navigate('/dashboard/add-job')}
              className="btn btn-primary mt-3"
            >
              Add Your First Job
            </button>
          </div>
        </div>
      </div>

    ) : (

      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6">

        {/* Heading */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">
              Manage Jobs
            </h1>

            <p className="text-sm text-base-content/60 mt-1">
              View and manage your posted jobs
            </p>
          </div>

          <div className="badge badge-primary badge-outline">
            {jobs.length} Jobs
          </div>
        </div>

        {/* Table */}
        <div className="card bg-base-100 border border-base-300 shadow-sm">

          <div className="card-body p-0">

            <div className="overflow-x-auto rounded-box">

              <table className="table table-zebra">

                <thead>
                  <tr className="bg-base-200 text-base-content">
                    <th className="hidden sm:table-cell">#</th>
                    <th>Job Title</th>
                    <th className="hidden sm:table-cell">Date</th>
                    <th className="hidden sm:table-cell">Location</th>
                    <th className="text-center">Applicants</th>
                    <th className="text-center">Visible</th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.map((job, index) => (

                    <tr key={job._id}>

                      <td className="hidden sm:table-cell">
                        {index + 1}
                      </td>

                      <td>
                        <span className="font-medium">
                          {job.title}
                        </span>
                      </td>

                      <td className="hidden sm:table-cell">
                        {moment(job.date).format('ll')}
                      </td>

                      <td className="hidden sm:table-cell">
                        {job.location}
                      </td>

                      <td className="text-center">
                        <span className="badge badge-info badge-outline">
                          {job.applicants}
                        </span>
                      </td>

                      <td className="text-center">
                        <input
                          type="checkbox"
                          className="toggle toggle-primary toggle-sm"
                          checked={job.visible}
                          onChange={() =>
                            changeJobVisiblity(job._id)
                          }
                          aria-label={`Toggle visibility for ${job.title}`}
                        />
                      </td>

                    </tr>

                  ))}
                </tbody>

              </table>

            </div>
          </div>
        </div>

        {/* Add Job Button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={() => navigate('/dashboard/add-job')}
            className="btn btn-primary"
          >
            Add New Job
          </button>
        </div>

      </div>

    )

  ) : (
    <Loading />
  )
}

export default ManageJobs