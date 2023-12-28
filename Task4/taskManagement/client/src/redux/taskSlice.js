import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const initalTask = localStorage.getItem('task')
	? JSON.parse(localStorage.getItem('task'))
	: null;

const initialState = {
	TaskData: initalTask,
	AllTasks: {},
};

export const taskSlice = createSlice({
	name: 'Task',
	initialState,

	reducers: {
		taskAddedSuccessfully: (state, action) => {
			state.TaskData = action.payload;
		},
		taskAddFailure: (state) => {
			return state;
		},
		getAllTaskSuccess: (state, action) => {
			state.AllTasks = action.payload;
		},
		getAllTaskFailure: (state) => {
			return state;
		},
		editTaskSuccess: (state, action) => {
			state.TaskData = action.payload;
		},
		deleteSuccess: (state, action) => {
			state.TaskData = action.payload;
		},
		deletefail: (state) => {
			return state;
		},
		editFail: (state) => {
			return state;
		},
	},
});

export const {
	taskAddFailure,
	taskAddedSuccessfully,
	getAllTaskFailure,
	getAllTaskSuccess,
	deleteSuccess,
	deletefail,
	editTaskSuccess,
	editFail,
} = taskSlice.actions;

export default taskSlice.reducer;

export const addTask = (task, createdBy, assignedTo) => async (dispatch) => {
	try {
		const taskData = {
			task,
			createdBy,
			assignedTo,
		};

		const response = await axios.post('http://localhost:4000/task/add', taskData);
		console.log('Add Task API Response:', response);
		console.log('Add Task API Response Data:', taskData)

		if (response && response.data) {
			localStorage.setItem('task', JSON.stringify(response.data));
			dispatch(taskAddedSuccessfully(response.data));
			toast.success('Task added successfully');
			window.location.reload(); 
		} else {
			dispatch(taskAddFailure());
		}
	} catch (error) {
		console.error('Add Task API Error:', error);
		dispatch(taskAddFailure());
	}
};


export const getAllTasks = (token, id) => async (dispatch) => {
	try {
		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params: {
				id,
			},
		};

		const response = await axios.get('http://localhost:4000/task/tasks', config);
		console.log('Get All Tasks API Response:', response);

		if (response && response.data) {
			dispatch(getAllTaskSuccess(response.data));
		} else {
			dispatch(getAllTaskFailure());
		}
	} catch (error) {
		console.error('Get All Tasks API Error:', error);
		dispatch(getAllTaskFailure());
	}
};  

export const arrowClick = (item, string) => async () => {
	let taskData = {
		id: item._id,
		status: item.status,
		string,
	};
	

	try {
		let response = await axios.put(
			`http://localhost:4000/task/${taskData.id}`,
			taskData
		);

		if (response) {
			window.location.reload();
		}
	} catch (error) {
		console.log(error);
	}
};

export const deleteItem = (id) => async (dispatch) => {
	let res = await axios.delete(`http://localhost:4000/task/${id}`);

	if (res) {
		dispatch(deleteSuccess());
		toast.success('task deleted successfully');

		window.location.reload();
	} else {
		dispatch(deletefail());
	}
};

export const editItem = (id, editedTaskData) => async (dispatch) => {
	try {
		console.log("id", id);
		console.log("editedTaskData", editedTaskData);
	  const response = await axios.put(`http://localhost:4000/task/edit/${id}`, editedTaskData);
  
	  if (response && response.data && response.data.updatedTask) {
		dispatch(editTaskSuccess(response.data.updatedTask)); 
		toast.success('Task edited successfully');
		window.location.reload();
	  } else {
		dispatch(editFail());
	  }
	} catch (error) {
	  console.error('Edit Task API Error:', error);
	  dispatch(editFail());
	}
  };
  
  
