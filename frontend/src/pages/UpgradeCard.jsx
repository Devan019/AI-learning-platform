import React, { useEffect, useState } from "react";
import { CardBody, CardContainer, CardItem } from "../Components/ui/3d-card";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../Components/Nav";
import { useSelector } from "react-redux";
import axios from "axios";

export function UpgradeCard({ title, price, description, benefits, buttonText, imageUrl, email, phone, name, setRzp1, rzp1, type, student }) {
  const { id } = useSelector((state) => state.getUser);
  const [orderid, setorderid] = useState("");
  const navigate = useNavigate();
  
  const isUpgraded = student?.order_id !== null && student?.order_id !== undefined;

  const sendOrder = async (obj) => {
    const api = await axios.post(`${import.meta.env.VITE_API}/users/makeOrder`, obj, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    console.log(api.data);
    localStorage.setItem("CoursesRefresh", true);
    alert("🥳 Successfully upgraded your account!!! You can now generate courses 🚀");
    navigate("/courses");
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      initializeRazorpay();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (id && student) {
      if (orderid) {
        const sendObj = {
          ...student,
          order_id: orderid,
          subscription: type
        };
        sendOrder(sendObj);
      }
    }
  }, [id, student, orderid]);

  const initializeRazorpay = () => {
    if (!window.Razorpay) return;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: price * 100,
      currency: "INR",
      name: title,
      description: "Payment for " + title,
      image: "https://example.com/your_logo",
      prefill: {
        name: name || "Customer Name",
        email: email || "customer@example.com",
        contact: phone || "9000090000"
      },
      theme: {
        color: "#3399cc"
      },
      handler: async function (response) {
        console.log("Payment successful:", response);
        const order_id = response.razorpay_payment_id;
        setorderid(order_id);
      },
    };

    const rzp = new window.Razorpay(options);
    setRzp1(rzp);

    rzp.on('payment.failed', function (response) {
      console.error("Payment failed:", response.error);
    });
  };

  const handlePaymentClick = (e) => {
    e.preventDefault();
    if (rzp1) {
      rzp1.open();
    } else {
      console.error("Razorpay not initialized");
    }
  };

  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
        {/* Image Section */}
        <CardItem translateZ="50" className="w-full mt-4">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover rounded-lg"
          />
        </CardItem>

        <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white mt-4">
          {title}
        </CardItem>
        <CardItem translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
          {description}
        </CardItem>

        <CardItem translateZ="70" className="text-lg font-semibold text-emerald-500 mt-4">
          ₹{price}
        </CardItem>

        <ul className="mt-4 text-sm text-gray-500 dark:text-gray-300 space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index}>✅ {benefit}</li>
          ))}
        </ul>

        {isUpgraded ? (
          <div className="mt-6 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500 dark:text-green-400 text-center">
            Your account is already upgraded! 🎉
          </div>
        ) : (
          <div className="flex justify-between items-center mt-8">
            <CardItem translateZ={20} as={Link} to="/learn-more" className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white">
              Learn More →
            </CardItem>
            <CardItem
              onClick={handlePaymentClick}
              translateZ={20} 
              as="button" 
              className="payment px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
            >
              {buttonText}
            </CardItem>
          </div>
        )}
      </CardBody>
    </CardContainer>
  );
}

export default function UpgradePage() {
  const { id, email,obj } = useSelector((state) => state.getUser);
  const { student } = useSelector((state) => state.getStudent);
  const [rzp1, setRzp1] = useState(null);
  const [phone, setphone] = useState(null);
  const [name, setname] = useState(null);
  const navigate = useNavigate();
  const [newStudent, setnewStudent] = useState(null);

  useEffect(() => {

    if(obj){
      if(obj.role != 'STUDENT'){
        navigate("/")
      }
    }

    if (id && student) {
      if (!student.phone || !student.email || !student.fullName) {
        alert("Please complete your profile first");
        navigate("/interest");
      }
      setname(student.fullName);
      setphone(student.phone);
      setnewStudent(student);
    }
  }, [id, student]);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col sm:flex-row items-center justify-center min-h-screen bg-zinc-900 text-white gap-6 p-6">
        <UpgradeCard
          title="Monthly Plan"
          price={1000}
          description="Get premium access for a month."
          benefits={[
            "Use chatbot to enhance learning",
            "AI-generated trusted courses",
            "Track your profile",
            "Only you & AI",
          ]}
          buttonText="Upgrade Monthly"
          imageUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          id={id}
          email={email}
          phone={phone}
          name={name}
          setRzp1={setRzp1}
          rzp1={rzp1}
          type={"MONTHLY"}
          student={newStudent}
        />

        <UpgradeCard
          setRzp1={setRzp1}
          title="Yearly Plan"
          price={10000}
          description="Save more with an annual plan."
          benefits={[
            "Use chatbot to enhance learning",
            "AI-generated trusted courses",
            "Track your profile",
            "Only you & AI",
          ]}
          buttonText="Upgrade Yearly"
          imageUrl="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80"
          id={id}
          email={email}
          phone={phone}
          name={name}
          rzp1={rzp1}
          type={"YEARLY"}
          student={newStudent}
        />
      </div>
    </div>
  );
}