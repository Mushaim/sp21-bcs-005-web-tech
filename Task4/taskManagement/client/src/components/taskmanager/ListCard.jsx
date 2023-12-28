import React, { useState, useEffect } from 'react';
import './listcard.scss';
import { BiChevronLeft, BiChevronRight, BiTrash, BiEdit } from 'react-icons/bi';
import { arrowClick, deleteItem, editItem } from '../../redux/taskSlice';
import { useDispatch, useSelector } from 'react-redux';

const ListCard = ({ item }) => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState({
    task: item.task,
    assignedTo: item.assignedTo.email,
  });
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    if (!userStatus) {
      const storedUser = localStorage.getItem('auth');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserStatus(parsedUser.status);
      }
    }
  }, [userStatus]);

  const ArrowClick = (string) => {
    if (userStatus !== 'admin') {
      dispatch(arrowClick(item, string));
    }
  };

  const handleDelete = () => {
    if (userStatus === 'admin') {
      dispatch(deleteItem(item._id));
    }
  };

  const handleEdit = () => {
    if (userStatus === 'admin') {
      setEditMode(true);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleSave = () => {
    setEditMode(false);
    if (userStatus === 'admin') {
      dispatch(editItem(item._id, editedTask));
    }
  };

  return (
    <div>
      <ul className={` ${item.status === 'done' ? 'completed menu' : 'menu'}`}>
        <li>
          <p>{item._id}</p>
        </li>
        <li>
          <p>{item.task}</p>
        </li>
        <li>
          <p>{item.status}</p>
        </li>
        <li>
          <p>{item.assignedTo.email}</p>
        </li>
        <li>
          {userStatus === 'admin' ? (
            <div>
              <button onClick={handleEdit}>
                <BiEdit />
              </button>
              <button onClick={handleDelete}>
                <BiTrash />
              </button>
            </div>
          ) : (
            <div>
              <button
                disabled={item.status === 'backlog'}
                onClick={() => ArrowClick('left')}
              >
                <BiChevronLeft />
              </button>
              <button
                disabled={item.status === 'done'}
                onClick={() => ArrowClick('right')}
              >
                <BiChevronRight />
              </button>
            </div>
          )}
        </li>
      </ul>

      {editMode && (
        <div>
          <input
            type='text'
            name='task'
            value={editedTask.task}
            onChange={handleInputChange}
          />
          <input
            type='text'
            name='assignedTo'
            value={editedTask.assignedTo}
            onChange={handleInputChange}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ListCard;
