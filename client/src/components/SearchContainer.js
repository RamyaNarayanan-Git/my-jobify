import {FormRow, Select} from '.'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/SearchContainer'
import {useState, useMemo} from 'react'

const SearchContainer = () => {
    const [localSearch, setLocalSearch] = useState('')
    const {
        isLoading,
        clearFilters,
        search,
        searchStatus,
        searchType,
        sort,
        sortOptions,
        handleChange,
        statusOptions,
        jobTypeOptions
    } = useAppContext()

    const handleSearch = (e) => {

        // console.log('name-->',e.target.name,' value-->',e.target.value)
        handleChange(e.target.name, e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLocalSearch('')
        clearFilters()
    }

    const debounce = () => {
        let timeOutId

        return (e)=>{
            setLocalSearch(e.target.value)
            clearTimeout(timeOutId)
            timeOutId = setTimeout(() => {
                handleChange(e.target.name, e.target.value)
            },1000)
        };
    }
    const optimizedDebounce = useMemo(()=>debounce(),[])
    return (
        <Wrapper>
            <form className='form'>
                <h4>Search Form</h4>
                <div className='form-center'>
                    <FormRow 
                    type='text'
                    name='search'
                    value={localSearch}
                    handleChange={optimizedDebounce}
                    />
                    <Select 
                        labelText='status'
                        name='searchStatus'
                        value={searchStatus}
                        handleChange = {handleSearch}
                        list={['all',...statusOptions]}
                    />
                    <Select 
                        labelText='Type'
                        name='searchType'
                        value={searchType}
                        handleChange = {handleSearch}
                        list={['all',...jobTypeOptions]}
                    />
                    <Select 
                        name='sort'
                        value={sort}
                        handleChange = {handleSearch}
                        list={sortOptions}
                    />
                    <button 
                        className='btn btn-block btn-danger'
                        disabled={isLoading}
                        onClick={handleSubmit}
                    >
                        Clear Filters
                    </button>
                </div>
            </form>
        </Wrapper>
    )
}

export default SearchContainer