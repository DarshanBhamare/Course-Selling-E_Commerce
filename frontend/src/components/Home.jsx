import React, { useEffect, useState } from 'react';
import logo from "../../public/logo.webp";
import { Link } from "react-router-dom";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram, FaTwitter } from "react-icons/fa6";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../../utils/utils.js';
function Home() {
  const [courses, setCourses] = useState([]);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);

        // Force slick to recalc layout
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 100);
      } catch (error) {
        console.log("Error in fetchCourses", error);
      }
    };

    fetchCourses();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user"); // remove token
    } catch (error) {
      console.log("Error in Logout", error);
      toast.error(error?.response?.data?.errors || "Error in Logout");
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 1, infinite: true, dots: true } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
        bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-700 
        bg-[length:400%_400%] animate-gradient-x text-white">
      <div className='text-white container mx-auto flex-grow'>

        {/* Header */}
        <header className='flex items-center justify-between p-6'>
          <div className='flex items-center space-x-2'>
            <img src={logo} alt="logo" className='w-10 h-10 rounded-full' />
            <h1 className='text-2xl text-yellow-400 font-bold'>CourseTutorials</h1>
          </div>
          <div className='space-x-4'>
            <Link to="/admin/login" className='bg-transparent text-white py-2 px-4 border rounded'>Admin</Link>

            {/* Both Login and Logout always visible */}
            <button onClick={handleLogout} className='bg-transparent text-white py-2 px-4 border rounded'>Logout</button>
            <Link to="/login" className='bg-transparent text-white py-2 px-4 border rounded'>Login</Link>
          </div>
        </header>

        {/* Main Section */}
        <section className='text-center py-20'>
          <h1 className='text-4xl font-semibold text-yellow-500'>CourseTutorials</h1>
          <p className='text-gray-400 mt-4'>Sharpen Your Skills With Courses Created By Experts</p>
          <div className='space-x-4 mt-8'>
            <Link to={"/courses"} className='bg-green-500 text-white py-3 px-6 rounded font-semibold hover:bg-white duration-300 hover:text-black'>Explore Courses</Link>
            <Link to={"https://www.youtube.com/watch?v=0bHoB32fuj0&list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz"} className='bg-white text-black py-3 px-6 rounded font-semibold hover:bg-green-500 duration-300 hover:text-white'>Courses Video</Link>
          </div>
        </section>

        {/* Slider Section */}
        <section className='px-4 mb-10'>
          {courses.length > 0 && (
            <Slider {...settings}>
              {courses.map(course => (
                <div key={course._id} className='p-4'>
                  <div className='max-w-xs w-full mx-auto transition-transform duration-300 transform hover:scale-105'>
                    <div className='bg-gray-900 rounded-lg overflow-hidden'>
                      {course.image?.url && (
                        <img className='h-32 w-full object-contain' src={course.image.url} alt={course.title} />
                      )}
                      <div className='p-6 text-center'>
                        <h2 className='text-xl font-bold text-white'>{course.title}</h2>
                        <button className='mt-4 bg-pink-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300'>Enroll Now</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </section>

        <hr className='border-gray-700 my-8' />

        {/* Footer */}
        <footer className='text-white py-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='flex flex-col items-center md:items-start'>
              <div className='flex items-center space-x-2'>
                <img src={logo} alt="logo" className='w-10 h-10 rounded-full' />
                <h1 className='text-2xl text-yellow-500 font-bold'>CourseTutorials</h1>
              </div>
              <div className='mt-3'>
                <p className='mb-2'>Follow Us</p>
                <div className='flex space-x-4'>
                  <a href="#"><FaFacebookSquare className='text-2xl hover:text-blue-400' /></a>
                  <a href="#"><FaInstagram className='text-2xl hover:text-pink-400' /></a>
                  <a href="#"><FaTwitter className='text-2xl hover:text-blue-400' /></a>
                </div>
              </div>
            </div>

            <div className='flex flex-col items-center'>
              <h3 className='text-lg font-semibold mb-4'>Connect</h3>
              <ul className='space-y-2 text-gray-400'>
                <li className='hover:text-white cursor-pointer duration-300'>LinkedIn Darshan Bhamare</li>
                <li className='hover:text-white cursor-pointer duration-300'>Instagram Darshan_B</li>
                <li className='hover:text-white cursor-pointer duration-300'>Telegram DB_1304</li>
              </ul>
            </div>

            <div className='flex flex-col items-center'>
              <h3 className='text-lg font-semibold mb-4'>© 2025</h3>
              <ul className='space-y-2 text-gray-400'>
                <li className='hover:text-white cursor-pointer duration-300'>Terms and Conditions</li>
                <li className='hover:text-white cursor-pointer duration-300'>Privacy Policy</li>
                <li className='hover:text-white cursor-pointer duration-300'>Refund and Cancellation</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
