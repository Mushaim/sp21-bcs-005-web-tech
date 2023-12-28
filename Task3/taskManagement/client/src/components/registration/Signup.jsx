import './registration.scss';
import '../../styles/components/_button.scss';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../redux/authSlice';

const Signup = () => {
    const dispatch = useDispatch();
    const [state, setState] = useState({
        email: '',
        password: '',
        username: '',
        status: '', // Include the status field in the state
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(
            register({
                username: state.username,
                password: state.password,
                email: state.email,
                status: state.status, // Pass the status to the register action
            })
        );
    };
    
    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    console.log(state.email, state.password, state.username, state.status);
    return (
        <div className='signup-form'>
            <div className='signup-form__wrapper'>
                <form className='form' onSubmit={handleSubmit}>
                    <h4>Sign up</h4>

                    <div className='form-group'>
                        <input
                            type='text'
                            placeholder='Enter Name'
                            name='username'
                            value={state.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='form-group'>
                        <input
                            type='email'
                            name='email'
                            value={state.email}
                            placeholder='Enter Email'
                            onChange={handleChange}
                        />
                    </div>
                    <div className='form-group'>
                        <input
                            type='password'
                            name='password'
                            value={state.password}
                            placeholder='Enter Password'
                            onChange={handleChange}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='status'>Select Status:</label>
                        <select
                            name='status'
                            value={state.status}
                            onChange={handleChange}
                        >
                            <option value=''>Select Status</option>
                            <option value='admin'>admin</option>
                            <option value='user'>user</option>
                        </select>
                    </div>
                    <div className='form-group'>
                        <button className='button'>Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
