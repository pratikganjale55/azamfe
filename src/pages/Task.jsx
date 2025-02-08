import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Textarea } from '../components/utils/Input';
import Loader from '../components/utils/Loader';
import useFetch from '../hooks/useFetch';
import MainLayout from '../layouts/MainLayout';
import validateManyFields from '../validations';

const Task = () => {
  const authState = useSelector(state => state.authReducer);
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();
  const { taskId } = useParams();

  const mode = taskId === undefined ? "add" : "update";
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    description: ""
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = mode === "add" ? "Add Task" : "Update Task";
  }, [mode]);

  useEffect(() => {
    if (mode === "update") {
      const config = { url: `/tasks/${taskId}`, method: "get", headers: { Authorization: authState.token } };
      fetchData(config, { showSuccessToast: false }).then((data) => {
        setTask(data.task);
        setFormData({ description: data.task.description });
      });
    }
  }, [mode, authState, taskId, fetchData]);

  const handleChange = e => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  };

  const handleReset = e => {
    e.preventDefault();
    setFormData({
      description: task.description
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validateManyFields("task", formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    const config = {
      url: mode === "add" ? "/tasks" : `/tasks/${taskId}`,
      method: mode === "add" ? "post" : "put",
      data: formData,
      headers: { Authorization: authState.token }
    };

    fetchData(config).then(() => {
      navigate("/");
    });
  };

  const fieldError = (field) => (
    <p className={`mt-1 text-red-500 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  );

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <form className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-lg">
          {loading ? (
            <Loader />
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-center mb-6">{mode === "add" ? "Add New Task" : "Edit Task"}</h2>

              <div className="mb-6">
                <label htmlFor="description" className="block text-gray-300 font-medium">Task Description</label>
                <Textarea
                  type="description"
                  name="description"
                  id="description"
                  value={formData.description}
                  placeholder="Write your task here..."
                  onChange={handleChange}
                  className="w-full p-3 mt-2 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {fieldError("description")}
              </div>

              <div className="flex justify-between">
                <button
                  className="bg-indigo-500 text-white px-4 py-2 font-medium rounded-md hover:bg-indigo-600 transition-all"
                  onClick={handleSubmit}
                >
                  {mode === "add" ? "Add Task" : "Update Task"}
                </button>

                <button
                  className="bg-red-500 text-white px-4 py-2 font-medium rounded-md hover:bg-red-600 transition-all"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </button>

                {mode === "update" && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 font-medium rounded-md hover:bg-blue-600 transition-all"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </MainLayout>
  );
};

export default Task;
