import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    console.log("AppContextProvider backendUrl:", backendUrl);

    const { user } = useUser()
    const { getToken } = useAuth()

    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: ''
    })

    const [isSearched, setIsSearched] = useState(false)

    const [jobs, setJobs] = useState([])

    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    const [companyToken, setCompanyToken] = useState(null)
    const [companyData, setCompanyData] = useState(null)

    const [userData, setUserData] = useState(null)
    const [userApplications, setUserApplications] = useState([])

    // Function to Fetch Jobs 
    const fetchJobs = async () => {
        try {
            console.log("fetchJobs calling URL:", backendUrl + '/api/jobs');
            const { data } = await axios.get(backendUrl + '/api/jobs')
            console.log("fetchJobs response data:", data);

            if (data.success) {
                setJobs(data.jobs)
            } else {
                console.error("fetchJobs success=false:", data.message);
                toast.error(data.message)
            }

        } catch (error) {
            console.error("fetchJobs catch error:", error);
            toast.error(error.message)
        }
    }

    // Function to Fetch Company Data
    const fetchCompanyData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/company/company', { headers: { token: companyToken } })

            if (data.success) {
                setCompanyData(data.company)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to Fetch User Data
    const fetchUserData = async () => {
        try {
            const token = await getToken();
            if (!token) {
                console.log("fetchUserData: No token available, skipping");
                return;
            }

            const { data } = await axios.get(backendUrl + '/api/users/user',
                { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                setUserData(data.user)
            } else {
                console.error("fetchUserData success=false:", data.message);
                toast.error(data.message)
            }

        } catch (error) {
            if (error.response?.status === 401) {
                console.log("fetchUserData: Unauthorized (401) - token may be expired");
            } else {
                console.error("fetchUserData error:", error.message);
                toast.error(error.response?.data?.message || error.message)
            }
        }
    }

    // Function to Fetch User's Applied Applications
    const fetchUserApplications = async () => {
        try {
            const token = await getToken()
            if (!token) {
                console.log("fetchUserApplications: No token available, skipping");
                return;
            }

            const { data } = await axios.get(backendUrl + '/api/users/applications',
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (data.success) {
                setUserApplications(data.applications)
            } else {
                console.error("fetchUserApplications success=false:", data.message);
                toast.error(data.message)
            }

        } catch (error) {
            if (error.response?.status === 401) {
                console.log("fetchUserApplications: Unauthorized (401) - token may be expired");
            } else {
                console.error("fetchUserApplications error:", error.message);
                toast.error(error.response?.data?.message || error.message)
            }
        }
    }

    // Retrive Company Token From LocalStorage
    useEffect(() => {
        fetchJobs()

        const storedCompanyToken = localStorage.getItem('companyToken')

        if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken)
        }

    }, [])

    // Fetch Company Data if Company Token is Available
    useEffect(() => {
        if (companyToken) {
            fetchCompanyData()
        }
    }, [companyToken])

    // Fetch User's Applications & Data if User is Logged In
    useEffect(() => {
        if (user) {
            fetchUserData()
            fetchUserApplications()
        }
    }, [user])

    const value = {
        setSearchFilter, searchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        backendUrl,
        userData, setUserData,
        userApplications, setUserApplications,
        fetchUserData,
        fetchUserApplications,

    }

    return (<AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>)

}