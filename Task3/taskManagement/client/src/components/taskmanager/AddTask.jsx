import React, { useState, useEffect } from 'react';
import './addtask.scss';
import { addTask } from '../../redux/taskSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../redux/userActions';

const AddTask = () => {
    const dispatch = useDispatch();
    const { auth, users } = useSelector((state) => state);
    const { currentUser } = auth;
    const [state, setState] = useState({
        task: '',
        assignedTo: '',
    });

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
		e.preventDefault();
	
		console.log('Users:', users.users); // Access the 'users' array within the 'users' state
	
		// Check if 'users' is an array before using the 'find' method
		if (!Array.isArray(users.users)) {
			alert('User data is not available or invalid.');
			return;
		}
	
		const assignedUser = users.users.find(userData => userData.email === state.assignedTo);
	
		if (!assignedUser) {
			alert('User not found! Please select a valid user.');
			return;
		}
        console.log('Current User:', assignedUser);
        console.log('Assigned User:', assignedUser._id);
	
		dispatch(addTask(state.task, currentUser.id, assignedUser._id));
		setState({
			task: '',
			assignedTo: '',
		});
	};
	
	

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    return (
        <div>
            <div className='addtask'>
                <form action='' onSubmit={handleSubmit}>
                    <input
                        type='text'
                        name='task'
                        placeholder='Add your task'
                        onChange={handleChange}
                        value={state.task}
                    />
                    <input
                        type='text'
                        name='assignedTo'
                        placeholder='Assign to'
                        onChange={handleChange}
                        value={state.assignedTo}
                    />
                    <button className='button'>Add Task</button>
                </form>
            </div>
        </div>
    );
};

export default AddTask;
