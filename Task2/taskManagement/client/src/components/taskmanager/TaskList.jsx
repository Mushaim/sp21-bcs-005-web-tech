import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTasks } from '../../redux/taskSlice';
import ListCard from './ListCard';
import './tasklist.scss';
import axios from 'axios';

const TaskList = () => {
  const auth = useSelector((state) => state.auth);
  const tasks = useSelector((state) => state.task);

  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const tasksPerPage = 5;

  useEffect(() => {
    // Initialize the URL when the component mounts
    updateURL(page);
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  function handlePrevious() {
    setPage((p) => (p === 1 ? p : p - 1));
    updateURL(page - 1); // Update URL when navigating to previous page
  }

  function handleNext() {
    setPage((p) => (p === pageCount ? p : p + 1));
    updateURL(page + 1); // Update URL when navigating to next page
  }

  // Add a function to update the URL
  const updateURL = (pageNumber) => {
    const newURL = `/tasks?page=${pageNumber}`;
    window.history.pushState({}, '', newURL); // Update the URL without reloading the page
  };
  const { currentUser } = auth;
  const { AllTasks } = tasks;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllTasks(currentUser.token, currentUser.id, page, tasksPerPage));
  }, [dispatch, currentUser.token, currentUser.id, page]);

  useEffect(() => {
    async function fetchTotalTaskCount() {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
          params: {
            id: currentUser.id,
          },
        };

        const response = await axios.get('http://localhost:4000/task/tasks', config);
        const totalTasks = response.data.length;
        const calculatedPageCount = Math.ceil(totalTasks / tasksPerPage);
        setPageCount(calculatedPageCount);
        console.log('Total tasks:', totalTasks);
        console.log('Page count:', calculatedPageCount);
      } catch (error) {
        console.error('Failed to fetch total task count:', error);
      }
    }

    fetchTotalTaskCount();
  }, [currentUser.token, currentUser.id]);

  const startIndex = (page - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const tasksToDisplay = Object.values(AllTasks).slice(startIndex, endIndex);

  return (
    <div>
      <ul className='list-header'>
        <li>
          <h5>Id</h5>
        </li>
        <li>
          <h5>Issue Name</h5>
        </li>
        <li>
          <h5>Status</h5>
        </li>
        <li>
          <h5>Assigned To</h5>
        </li>
        <li>
          <h5>Action</h5>
        </li>
      </ul>

      {tasksToDisplay.length > 0 ? (
        tasksToDisplay.map((item) => {
          return <ListCard key={item._id} item={item} />;
        })
      ) : (
        <p>No tasks found.</p>
      )}

      <footer>
        <button disabled={page === 1} onClick={handlePrevious}>
          Previous
        </button>
        <button disabled={page === pageCount || pageCount === 0} onClick={handleNext}>
          Next
        </button>
      </footer>
    </div>
  );
};

export default TaskList;
