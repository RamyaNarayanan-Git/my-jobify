import { FormRow, Alert, Select } from '../../components/index.js'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'

const AddJob = () => {
    const { 
        isLoading,
        showAlert, 
        displayAlert, 
        isEditing,
        position, 
        company,
        jobTypeOptions,
        jobLocation,
        jobType,
        status,
        statusOptions,
        handleChange,
        clearValues,
        createJob,
        editJob,
    } = useAppContext()

    const handleJobInput = (e) => {
        handleChange(e.target.name, e.target.value)
        // console.log('name->',e.target.name)
        // console.log('value->',e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!position || !company || !jobLocation){
            displayAlert()
            return
        }

        if(isEditing){
            editJob()
            return
        }
        createJob()
    }

    return (
        <Wrapper>
            <form className='form'>
                <h3>{ isEditing ? 'edit job': 'add job'}</h3>
                {showAlert && <Alert/>}
                <div className='form-center'>
                    <FormRow 
                        type='text' 
                        name='position' 
                        value={position} 
                        handleChange = {handleJobInput}
                    />

                    <FormRow 
                        type='text' 
                        name='company' 
                        value={company} 
                        handleChange = {handleJobInput}
                    />

                    <FormRow 
                        type='text'
                        labelText='job location' 
                        name='jobLocation' 
                        value={jobLocation} 
                        handleChange = {handleJobInput}
                    />
                    {/* job type */}
                    <Select 
                        labelText='job type'
                        name='jobType'
                        value={jobType}
                        handleChange = {handleJobInput}
                        list={jobTypeOptions}
                    />
                    {/* status options */}
                    <Select 
                        labelText='status'
                        name='status'
                        value={status}
                        handleChange = {handleJobInput}
                        list={statusOptions}
                    />
                    <div className='btn-container'>
                        <button 
                            type='submit'
                            className='btn btn-block'
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            Submit
                        </button>
                        <button 
                            type='submit'
                            className='btn btn-block clear-btn'
                            onClick={ (e) => {
                                e.preventDefault()
                                clearValues()
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </form>
        </Wrapper>
    )
}

export default AddJob