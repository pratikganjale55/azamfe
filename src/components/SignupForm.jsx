import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import validateManyFields from '../validations';
import Input from './utils/Input';
import Loader from './utils/Loader';

const SignupForm = () => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [fetchData, { loading }] = useFetch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateManyFields("signup", formData);
    setFormErrors({});
    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    const config = { url: "/auth/signup", method: "post", data: formData };
    fetchData(config).then(() => {
      navigate("/login");
    });
  };

  const fieldError = (field) => (
    <p className={`mt-1 text-red-500 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <form className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-xl">
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
              Create an Account
            </h2>

            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium">Name</label>
              <Input type="text" name="name" id="name" value={formData.name} placeholder="Your Name" onChange={handleChange} />
              {fieldError("name")}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
              <Input type="text" name="email" id="email" value={formData.email} placeholder="you@example.com" onChange={handleChange} />
              {fieldError("email")}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
              <Input type="password" name="password" id="password" value={formData.password} placeholder="••••••••" onChange={handleChange} />
              {fieldError("password")}
            </div>

            <button 
              className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition-all"
              onClick={handleSubmit}
            >
              Sign Up
            </button>

            <div className="mt-4 text-center">
              <Link to="/login" className="text-indigo-500 hover:underline">Already have an account? Login here</Link>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default SignupForm;
