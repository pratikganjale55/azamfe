import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';

const Tasks = () => {
  const authState = useSelector(state => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [fetchData, { loading }] = useFetch();

  const fetchTasks = useCallback(() => {
    const config = { url: "/tasks", method: "get", headers: { Authorization: authState.token } };
    fetchData(config, { showSuccessToast: false }).then(data => setTasks(data.tasks));
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  const handleDelete = (id) => {
    const config = { url: `/tasks/${id}`, method: "delete", headers: { Authorization: authState.token } };
    fetchData(config).then(() => fetchTasks());
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">My Tasks ({tasks.length})</h2>
          <Link to="/tasks/add" className="bg-indigo-500 text-white px-4 py-2 hover:bg-indigo-600 transition">
            + Add New Task
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40">
            <span className="text-gray-400">No tasks found</span>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <div key={task._id} className="bg-gray-700 p-4 rounded-md shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-300">Task #{index + 1}</span>

                  <div className="flex space-x-3">
                    <Tooltip text="Edit Task" position="top">
                      <Link to={`/tasks/${task._id}`} className="text-green-400 hover:text-green-500 transition">
                        <i className="fa-solid fa-pen"></i>
                      </Link>
                    </Tooltip>

                    <Tooltip text="Delete Task" position="top">
                      <span className="text-red-400 hover:text-red-500 cursor-pointer transition" onClick={() => handleDelete(task._id)}>
                        <i className="fa-solid fa-trash"></i>
                      </span>
                    </Tooltip>
                  </div>
                </div>
                <p className="text-gray-300">{task.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
