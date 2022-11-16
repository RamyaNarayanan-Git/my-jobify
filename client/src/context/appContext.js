import React from "react";
import { useReducer, useContext } from "react";
import { 
    CLEAR_ALERT, 
    DISPLAY_ALERT, 
    REGISTER_USER_BEGIN, 
    REGISTER_USER_SUCCESS, 
    REGISTER_USER_ERROR,
    LOGIN_USER_BEGIN,
    LOGIN_USER_SUCCESS, 
    LOGIN_USER_ERROR,
    TOGGLE_SIDEBAR,
    LOGOUT_USER,
    UPDATE_USER_BEGIN,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    HANDLE_CHANGE,
    CLEAR_VALUES,
    CREATE_JOB_BEGIN,
    CREATE_JOB_SUCCESS,
    CREATE_JOB_ERROR,
    GET_JOBS_BEGIN,
    GET_JOBS_SUCCESS,
    SET_EDIT_JOB,
    DELETE_JOB_BEGIN,
    EDIT_JOB_BEGIN,
    EDIT_JOB_SUCCESS,
    EDIT_JOB_ERROR,
    SHOW_STATS_BEGIN,
    SHOW_STATS_SUCCESS,
    CLEAR_FILTERS,
    CHANGE_PAGE,
} from "./actions";

import reducer from "./reducer";
import axios from 'axios'

const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
const userLocation = localStorage.getItem('location')

const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType:'',
    user: user ? JSON.parse(user) : null,
    token: token, 
    userLocation: userLocation || '',
    showSideBar: false,
    isEditing: false,
    editJobId: '',
    position: '',
    company:'',
    jobLocation: userLocation || '',
    jobTypeOptions: ['full-time','part-time','remote', 'internship'],
    jobType: 'full-time',
    statusOptions:['pending','interview','declined'],
    status:'pending',
    jobs: [],
    totalJobs: 0,
    numOfPages: 1,
    page: 1,
    stats: {},
    monthlyApplications:[],
    search:'',
    searchStatus:'all',
    searchType:'all',
    sort:'latest',
    sortOptions: ['latest','oldest','a-z','z-a']
}

const AppContext = React.createContext()


const AppProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer,initialState)

    const authFetch = axios.create({
        baseURL: '/api/v1',
    })

    authFetch.interceptors.request.use((config) => {
        config.headers['Authorization'] = `Bearer ${state.token}`
        return config
    }, 
    (error) => {
        return Promise.reject(error)
    })

    authFetch.interceptors.response.use(
        (response) => {
        return response
    }, 
    (error) => {
        // console.log(error.response)
        if(error.response.status === 401){
            // console.log('Auth Error')
            logoutUser()
        }
        return Promise.reject(error)
    })

    const displayAlert = () => {
        dispatch({type:DISPLAY_ALERT})
        clearAlert()
    }

    const clearAlert = () => {
        setTimeout(() => { dispatch({type: CLEAR_ALERT})}, 3000)
    }

    const addUserToLocalStorage = ({user,token, location}) => {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        localStorage.setItem('location', location)
    }

    const removeUserFromStorage = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('location')

    }

    const registerUser = async (currentUser) => {
        dispatch({ type: REGISTER_USER_BEGIN})
        try{
            const response = await axios.post('/api/v1/auth/register', currentUser)
            // console.log(response)
            const {user, token, location} = response.data
            dispatch({
                type: REGISTER_USER_SUCCESS,
                payload: {user, token, location},
            })
            addUserToLocalStorage({user, token, location})
        } catch (error){
            // console.log(error.response)
            dispatch({
                type: REGISTER_USER_ERROR,
                payload: { msg: error.response.data.msg}
            })
        }
        clearAlert()
    }

    const loginUser = async(currentUser) => {
        // console.log('login',currentUser)
        dispatch({ type: LOGIN_USER_BEGIN})
        try{
            const response = await axios.post('/api/v1/auth/login', currentUser)
            // console.log(response)
            const {user, token, location} = response.data
            dispatch({
                type: LOGIN_USER_SUCCESS,
                payload: {user, token, location},
            })
            addUserToLocalStorage({user, token, location})
        } catch (error){
            // console.log(error.response)
            dispatch({
                type: LOGIN_USER_ERROR,
                payload: { msg: error.response.data.msg}
            })
        }
        clearAlert()
        // console.log(currentUser)
    }

    const logoutUser = () => {
        dispatch({type: LOGOUT_USER})
        removeUserFromStorage()
    }

    const updateUser = async (currentUser) => {
        dispatch({ type: UPDATE_USER_BEGIN})
        try {
            const {data} = await authFetch.patch('/auth/updateUser',currentUser)
            const {user, location, token} = data
            dispatch({
                type: UPDATE_USER_SUCCESS, 
                payload: {user, token, location},
            })
            addUserToLocalStorage({user, location, token})
        } catch (error) {
            if(error.response.status !== 401) {
                dispatch({
                    type: UPDATE_USER_ERROR,
                    payload: {msg: error.response.data.msg}
                })
            }
            
        }
        clearAlert()
    }

    const toggleSidebar = () => {
        dispatch({ type: TOGGLE_SIDEBAR})
    }

    const handleChange = (name,value) => {
        dispatch({type: HANDLE_CHANGE, payload:{name,value}})
    }

    const clearValues = () => {
        dispatch({type: CLEAR_VALUES})
    }

    const createJob = async() => {
        dispatch({ type: CREATE_JOB_BEGIN})
        try{
            const { position, company, jobLocation,jobType, status} = state
            await authFetch.post('/jobs', { position, company, jobLocation,jobType, status})
            // console.log(response)
            dispatch({ type: CREATE_JOB_SUCCESS })
            dispatch({ type: CLEAR_VALUES })
        } catch (error){
            if(error.response.status === 401) return
            dispatch({
                type: CREATE_JOB_ERROR,
                payload: { msg: error.response.data.msg}
            })
        }
        clearAlert()
        // console.log(currentUser)
    }

    const getJobs = async () => {
        const {page, search,searchStatus,searchType,sort} = state
        let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
        if(search){
            url = url + `&search=${search}`
        }
        dispatch({ type: GET_JOBS_BEGIN})
        try{
            const {data} = await authFetch(url);
            const {jobs, totalJobs, numOfPages} = data
            dispatch({ 
                type: GET_JOBS_SUCCESS,
                payload: {
                    jobs,
                    totalJobs,
                    numOfPages
                }
            
            })
        } catch(error){
            // console.log(error.response)
            logoutUser()
        }

        clearAlert()
    }

    const setEditJob = (id) => {
        // console.log(`set edit job: ${id}`)
        dispatch({ type: SET_EDIT_JOB, payload: { id }})
    }

    const editJob = async () => {
        dispatch( { type: EDIT_JOB_BEGIN } )
        try{
            const { position, company, jobLocation, jobType, status} = state
            await authFetch.patch(`/jobs/${state.editJobId}`, {
                company,
                position,
                jobLocation,
                jobType,
                status,
            })
            dispatch( { type: EDIT_JOB_SUCCESS } )
            dispatch( { type: CLEAR_VALUES })
        } catch(error) {
            if(error.response.status === 401) return
            dispatch( {
                type: EDIT_JOB_ERROR,
                payload: { msg: error.response.data.msg},
            })
            // console.log(error.response)
        }
        clearAlert()
        // console.log('edit job')
    }

    const setDeleteJob = async (jobId) => {
        // console.log(`set delete job: ${id}`)
        dispatch( { type: DELETE_JOB_BEGIN, payload: { jobId }} )
        try {
            await authFetch.delete(`/jobs/${jobId}`)
            await getJobs()

        } catch(error){
            // console.log(error.response)
            logoutUser()
        }
        
    }

    const showStats = async () => {
        dispatch( { type: SHOW_STATS_BEGIN } )
        try{
            const {data} = await authFetch('/jobs/stats')
            dispatch( { 
                type: SHOW_STATS_SUCCESS ,
                payload: {
                    stats: data.defaultStats,
                    monthlyApplications: data.monthlyApplications
                },
            })
        } catch(error) {
            if(error.response.status === 401) return
            // console.log(error.response)
            logoutUser()
        }
        clearAlert()
        // console.log('edit job')
    }

    const clearFilters = () => {
        dispatch( {type: CLEAR_FILTERS} )
    }

    const changePage = (page) => {
        dispatch( { type: CHANGE_PAGE, payload: {page} })
    }

    return (
    <AppContext.Provider 
        value={({
            ...state,
            displayAlert, 
            registerUser, loginUser, 
            toggleSidebar, handleChange, 
            createJob, setEditJob, setDeleteJob, getJobs, editJob, 
            clearValues, logoutUser, updateUser,
            showStats, changePage,
            clearFilters
        })}>
        {children}
    </AppContext.Provider> 
    )
}

const useAppContext = () => {
    return useContext(AppContext)
}
export {AppProvider, initialState, useAppContext}