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
                        <div className='flex flex-col sm:flex-row items-center bg-base-100 rounded-2xl shadow-lg p-2 sm:p-1.5 w-full max-w-xl mx-auto gap-2 sm:gap-0'>
                            <label className='flex items-center gap-2.5 w-full sm:flex-1 px-3 py-2 sm:py-0'>
                                <img className='h-4 sm:h-5 opacity-70 flex-shrink-0' src={assets.search_icon} alt="" />
                                <input
                                    type="text"
                                    placeholder='Search for jobs'
                                    className='w-full bg-transparent outline-none text-sm'
                                    ref={titleRef}
                                />
                            </label>

                            <div className='hidden sm:block h-8 w-[1px] bg-base-300 mx-1'></div>
                            <div className='block sm:hidden w-full h-[1px] bg-base-200'></div>

                            <label className='flex items-center gap-2.5 w-full sm:flex-1 px-3 py-2 sm:py-0'>
                                <img className='h-4 sm:h-5 opacity-70 flex-shrink-0' src={assets.location_icon} alt="" />
                                <input
                                    type="text"
                                    placeholder='Location'
                                    className='w-full bg-transparent outline-none text-sm'
                                    ref={locationRef}
                                />
                            </label>

                            <button
                                onClick={onSearch}
                                className='btn btn-neutral w-full sm:w-auto rounded-xl sm:rounded-2xl px-6 sm:m-0.5'
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trusted by */}
            <div className='card card-border bg-base-100 border-base-300 shadow-md mx-2 mt-5'>
                <div className='card-body p-4 sm:p-6'>
                    <div className='flex justify-center items-center gap-6 sm:gap-10 lg:gap-16 flex-wrap'>
                        <p className='font-medium text-base-content text-sm sm:text-base'>Trusted by</p>
                        <img className='h-5 sm:h-6' src={assets.microsoft_logo} alt="" />
                        <img className='h-5 sm:h-6' src={assets.walmart_logo} alt="" />
                        <img className='h-5 sm:h-6' src={assets.accenture_logo} alt="" />
                        <img className='h-5 sm:h-6' src={assets.samsung_logo} alt="" />
                        <img className='h-5 sm:h-6' src={assets.amazon_logo} alt="" />
                        <img className='h-5 sm:h-6' src={assets.adobe_logo} alt="" />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Hero