import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import validateManyFields from '../validations';
import Input from './utils/Input';
import { postLoginData } from '../redux/actions/authActions';
import Loader from './utils/Loader';

const LoginForm = ({ redirectUrl }) => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector(state => state.authReducer);
  const { loading, isLoggedIn } = authState;

  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectUrl || "/");
    }
  }, [authState, redirectUrl, isLoggedIn, navigate]);

  const handleChange = e => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validateManyFields("login", formData);
    setFormErrors({});
    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }
    dispatch(postLoginData(formData.email, formData.password));
  };

  const fieldError = (field) => (
    <p className={`mt-1 text-red-500 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900">
      <form className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login to Your Account</h2>

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
              Login
            </button>

            <div className="mt-4 text-center">
              <Link to="/signup" className="text-indigo-500 hover:underline">Don't have an account? Sign up</Link>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
