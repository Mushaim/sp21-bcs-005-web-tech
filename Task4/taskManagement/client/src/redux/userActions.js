import axios from 'axios';
import { fetchUsersSuccess, fetchUsersFailure } from './userSlice';

export const fetchUsers = () => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:4000/api/users');
    dispatch(fetchUsersSuccess(response.data));
  } catch (error) {
    dispatch(fetchUsersFailure(error.message));
  }
};
