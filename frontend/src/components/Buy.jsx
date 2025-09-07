import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from '../../utils/utils.js';
function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user=JSON.parse(localStorage.getItem('user'))
  const token=user.token;
  const handlePurchase = async () => {
    if (!token) {
      toast.error("Please Login To Purchase the Course");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/course/buy/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success(response.data.message || "Course Purchase Successfully!");
      navigate("/purchases");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error?.response?.status === 400) {
        toast.error("You have already purchased this course");
        navigate("/purchases");
      } else {
        toast.error(error?.response?.data?.errors || "Something went wrong");
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-800 duration-300"
        onClick={handlePurchase}
        disabled={loading}
      >
        {loading ? "Processing..." : "Buy Now"}
      </button>
    </div>
  );
}

export default Buy;
