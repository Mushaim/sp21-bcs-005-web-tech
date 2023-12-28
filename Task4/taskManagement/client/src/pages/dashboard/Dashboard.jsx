import Sidebar from '../../components/sidebar/Sidebar';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './dashboard.scss';
import { useEffect } from 'react';
import { getAllTasks } from '../../redux/taskSlice';

const Dashboard = () => {
  const tasklist = useSelector((state) => state.task);
  const { AllTasks } = tasklist;
  const user = useSelector((state) => state.auth);
  const { currentUser } = user;

  // Check if AllTasks is an array
  const assignedTasks = Array.isArray(AllTasks) ? AllTasks.filter(task => task.assignedTo === currentUser.id) : [];

  // Count pending and completed tasks for assigned tasks
  const pendingTask = assignedTasks.filter(task => task.status === 'todo');
  const completedTask = assignedTasks.filter(task => task.status === 'done');

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllTasks(currentUser.token, currentUser.id));
  }, [dispatch, currentUser.token, currentUser.id]);

  return (
    <div>
      <div className='dashboard'>
        <div className='dashboard__left'>
          <Sidebar />
        </div>
        <div className='dashboard__right'>
          <div className='dashboard__rightContent'>
            <h2>Task Status Dashboard</h2>
            <div className='taskcount'>
              <div className='todo box'>Todo - {pendingTask.length}</div>
              <div className='done box'>Complete - {completedTask.length}</div>
            </div>
            <div className='createButton'>
              <Link to='/taskmanager' className='button'>
                Create Task
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
