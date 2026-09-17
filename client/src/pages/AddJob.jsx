import { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { JobCategories, JobLocations } from '../assets/assets';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const AddJob = () => {

    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('Bangalore');
    const [category, setCategory] = useState('Programming');
    const [level, setLevel] = useState('Beginner level');
    const [salary, setSalary] = useState(0);

    const editorRef = useRef(null)
    const quillRef = useRef(null)

    const { backendUrl, companyToken } = useContext(AppContext)

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        try {

            const description = quillRef.current.root.innerHTML

            const { data } = await axios.post(backendUrl + '/api/company/post-job',
                { title, description, location, salary, category, level },
                { headers: { token: companyToken } }
            )

            if (data.success) {
                toast.success(data.message)
                setTitle('')
                setSalary(0)
                quillRef.current.root.innerHTML = ""
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }


    }


    useEffect(() => {
        // Initiate Quill only once
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
            })
        }
    }, [])

    return (
        <form onSubmit={onSubmitHandler} className='container p-4 sm:p-6 flex flex-col w-full items-start gap-4'>

            <div className='w-full'>
                <label className='block mb-2 font-medium text-base-content'>Job Title</label>
                <input
                    type="text"
                    placeholder='Type here'
                    onChange={e => setTitle(e.target.value)}
                    value={title}
                    required
                    className='input input-bordered w-full max-w-lg'
                />
            </div>

            <div className='w-full max-w-lg'>
                <p className='mb-2 font-medium text-base-content'>Job Description</p>
                <div ref={editorRef} className='bg-base-100 rounded-lg border border-base-300 overflow-hidden'>
                </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 w-full sm:gap-8'>

                <div>
                    <label className='block mb-2 font-medium text-base-content'>Job Category</label>
                    <select
                        className='select select-bordered w-full'
                        onChange={e => setCategory(e.target.value)}
                    >
                        {JobCategories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className='block mb-2 font-medium text-base-content'>Job Location</label>
                    <select
                        className='select select-bordered w-full'
                        onChange={e => setLocation(e.target.value)}
                    >
                        {JobLocations.map((location, index) => (
                            <option key={index} value={location}>{location}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className='block mb-2 font-medium text-base-content'>Job Level</label>
                    <select
                        className='select select-bordered w-full'
                        onChange={e => setLevel(e.target.value)}
                    >
                        <option value="Beginner level">Beginner level</option>
                        <option value="Intermediate level">Intermediate level</option>
                        <option value="Senior level">Senior level</option>
                    </select>
                </div>

            </div>

            <div>
                <label className='block mb-2 font-medium text-base-content'>Job Salary</label>
                <input
                    min={0}
                    className='input input-bordered sm:w-[140px]'
                    onChange={e => setSalary(e.target.value)}
                    type="number"
                    placeholder='2500'
                />
            </div>

            <button type="submit" className='btn btn-primary w-28 mt-4 rounded-full'>
                ADD
            </button>
        </form>
    )
}

export default AddJob