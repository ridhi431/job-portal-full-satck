import { useContext, useRef } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Hero = () => {

    const { setSearchFilter, setIsSearched } = useContext(AppContext)

    const titleRef = useRef(null)
    const locationRef = useRef(null)

    const onSearch = () => {
        setSearchFilter({
            title: titleRef.current.value,
            location: locationRef.current.value
        })
        setIsSearched(true)
    }

    return (
        <div className='container 2xl:px-20 mx-auto my-10'>

            {/* Hero banner */}
            <div
                className='hero rounded-xl mx-2 relative overflow-hidden'
                style={{
                    backgroundImage: "url(https://images.pexels.com/photos/590044/pexels-photo-590044.jpeg)",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Overlay for text contrast */}
                <div className='absolute inset-0 bg-primary/70'></div>

                <div className='hero-content w-full text-center py-16 relative z-10'>
                    <div className='max-w-xl'>
                        <h2 className='text-2xl md:text-3xl lg:text-4xl font-medium mb-4 text-primary-content'>
                            Over 10,000+ jobs to apply
                        </h2>
                        <p className='mb-8 text-sm font-light px-5 text-primary-content/80'>
                            Your Next Big Career Move Starts Right Here - Explore the Best Job
                            Opportunities and Take the First Step Toward Your Future!
                        </p>

                        {/* Search bar */}
                        <div className='join bg-base-100 rounded-2xl shadow w-full max-w-xl mx-auto'>
                            <label className='join-item input flex items-center gap-2 flex-1'>
                                <img className='h-4 sm:h-5 opacity-70' src={assets.search_icon} alt="" />
                                <input
                                    type="text"
                                    placeholder='Search for jobs'
                                    className='grow max-sm:text-xs'
                                    ref={titleRef}
                                />
                            </label>

                            <div className='divider divider-horizontal mx-0'></div>

                            <label className='join-item input flex items-center gap-2 flex-1'>
                                <img className='h-4 sm:h-5 opacity-70' src={assets.location_icon} alt="" />
                                <input
                                    type="text"
                                    placeholder='Location'
                                    className='grow max-sm:text-xs'
                                    ref={locationRef}
                                />
                            </label>

                            <button
                                onClick={onSearch}
                                className=' btn  btn-neutral join-item rounded-2xl m-1'
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trusted by */}
            <div className='card card-border bg-base-100 border-base-300 shadow-md mx-2 mt-5'>
                <div className='card-body'>
                    <div className='flex justify-center items-center gap-10 lg:gap-16 flex-wrap'>
                        <p className='font-medium text-base-content'>Trusted by</p>
                        <img className='h-6' src={assets.microsoft_logo} alt="" />
                        <img className='h-6' src={assets.walmart_logo} alt="" />
                        <img className='h-6' src={assets.accenture_logo} alt="" />
                        <img className='h-6' src={assets.samsung_logo} alt="" />
                        <img className='h-6' src={assets.amazon_logo} alt="" />
                        <img className='h-6' src={assets.adobe_logo} alt="" />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Hero