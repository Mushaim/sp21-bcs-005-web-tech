import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import history from '../history';
import { toast } from 'react-toastify';

const initialUser = localStorage.getItem('auth')
	? JSON.parse(localStorage.getItem('auth'))
	: null;

	const initialState = {
		isLoading: false,
		currentUser: initialUser,
		userStatus: null, 
		error: null,
	  };
	  export const authSlice = createSlice({
		name: 'auth',
		initialState: initialState,
		reducers: {
		  loginSuccess: (state, action) => {
			state.currentUser = action.payload;
			state.isLoading = false;
			state.userStatus = action.payload.status; 
			console.log("state",state.userStatus);
		  },
		loginFailure: (state, action) => {
			state.error = action.payload;
		},
		registerSuccess: (state, action) => {
			state.currentUser = action.payload;
			state.isLoading = false;
		},
		registerFailure: (state, action) => {
			state.error = action.payload;
		},
		logoutSuccess: (state) => {
			state.currentUser = null;
		},
	},
});

export const {
	loginFailure,
	loginSuccess,
	registerFailure,
	registerSuccess,
	logoutSuccess,
} = authSlice.actions;

export default authSlice.reducer;

export const register = (user) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'content-type': 'application/json',
			},
		};

		const response = await axios.post(
			'http://localhost:4000/auth/register',
			user,
			config
		);

		if (response) {
			dispatch(registerSuccess(response.data));
			toast.success('register successfull');
			history.push('/signin');
			window.location.reload();
		} else {
			dispatch(registerFailure());
			toast.error('registration failed');
		}
	} catch (error) {
		console.log(error);
		dispatch(registerFailure());
	}
};

export const signin = (user) => async (dispatch) => {
	console.log('Attempting signin:', user);
	try {
	  const userData = {
		email: user.email,
		password: user.password,
	  };
	  const response = await axios.post(
		'http://localhost:4000/auth/signin',
		userData
	  );
	  console.log('Response:', response); // Log the entire response object
	  if (response.status === 200) {
		console.log('Successful login data:', response.data); // Log successful login data
		localStorage.setItem('auth', JSON.stringify(response.data));
		dispatch(loginSuccess(response.data));
		//history.push('/dashboard');
		toast.success('Login successful');
		//window.location.reload();
	  } else {
		console.log('Login failed');
		dispatch(loginFailure());
		toast.error('Login failed');
	  }
	} catch (error) {
	  console.error('Error during login:', error); // Log any errors during the process
	  dispatch(loginFailure());
	}
  };
  