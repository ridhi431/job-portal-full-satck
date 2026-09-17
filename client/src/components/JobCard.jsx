import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Jobcard = ({ job }) => {

    const navigate = useNavigate();
    const { userApplications } = useContext(AppContext)

    const isApplied = Boolean(
        userApplications &&
        Array.isArray(userApplications) &&
        userApplications.some(
            app => String(app?.jobId?._id || app?.jobId || '') === String(job?._id || '')
        )
    )

    return (
        <div className='card card-border bg-base-100 border-base-300 dark:border-primary/40 dark:bg-base-200 shadow-md shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-shadow duration-300'>
            <div className='card-body'>
                <div className='flex justify-between items-center'>
                    <img className='h-8' src={job.companyId?.image || assets.company_icon} alt="" />
                    {isApplied && (
                        <span className='badge badge-success badge-sm gap-1'>
                            ✓ Applied
                        </span>
                    )}
                </div>

                <h4 className='font-medium text-xl mt-2'>{job.title}</h4>

                <div className='flex items-center gap-3 mt-2'>
                    <span className='badge badge-info badge-outline'>{job.location}</span>
                    <span className='badge badge-error badge-outline'>{job.level}</span>
                </div>

                <p className='text-base-content/60 text-xs mt-4 line-clamp-3'>
                    {(job.description || '').replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim().slice(0, 150)}
                    {(job.description || '').replace(/<[^>]*>?/gm, '').length > 150 ? '...' : ''}
                </p>

                <div className='card-actions mt-4 text-sm'>
                    {isApplied ? (
                        <button
                            className='btn btn-success btn-sm btn-outline rounded-full btn-disabled'
                        >
                            ✓ Applied
                        </button>
                    ) : (
                        <button
                            onClick={() => { navigate(`/apply-job/${job._id}`); scrollTo(0, 0) }}
                            className='btn btn-primary btn-sm rounded-full'
                        >
                            Apply now
                        </button>
                    )}
                    <button
                        onClick={() => { navigate(`/apply-job/${job._id}`); scrollTo(0, 0) }}
                        className='btn btn-outline btn-sm rounded-full'
                    >
                        Learn more
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Jobcard