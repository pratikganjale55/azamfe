import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Tasks from '../components/Tasks';
import MainLayout from '../layouts/MainLayout';

const Home = () => {
  const authState = useSelector((state) => state.authReducer);
  const { isLoggedIn } = authState;

  useEffect(() => {
    document.title = isLoggedIn ? `${authState.user.name}'s Tasks` : "Task Manager";
  }, [authState]);

  return (
    <MainLayout>
      {!isLoggedIn ? (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white h-[50vh] flex flex-col justify-center items-center text-center p-8">
          <h1 className="text-3xl font-bold">Stay on Top of Your Tasks</h1> 
          <p className="mt-2 text-lg text-gray-200">Manage, track, and complete your tasks seamlessly.</p>
          <Link
            to="/signup"
            className="mt-6 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-lg hover:bg-indigo-100 transition-all duration-300"
          >
            Get Started
            <span className="ml-2"><i className="fa-solid fa-arrow-right"></i></span>
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-10 mx-6 p-6 bg-gray-100 shadow-lg rounded-lg text-center">
            <h1 className="text-xl font-semibold text-gray-800">Welcome, {authState.user.name}!</h1>
          </div>
          <Tasks />
        </>
      )}
    </MainLayout>
  );
};

export default Home;
