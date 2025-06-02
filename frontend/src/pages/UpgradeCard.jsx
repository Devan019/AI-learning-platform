import React, { useEffect, useState, useCallback, useRef } from "react";
import { CardBody, CardContainer, CardItem } from "../Components/ui/3d-card";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../Components/Nav";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchStudent } from "../store/StudentSlice/getStudentSlice";
import { toast } from "react-toastify";

const CreditCard = React.memo(({
  title,
  price,
  description,
  benefits,
  buttonText,
  imageUrl,
  user,
  student,
  onPaymentSuccess
}) => {
  const [rzpInstance, setRzpInstance] = useState(null);
  const navigate = useNavigate();
  const credits = benefits[0].match(/\d+/)[0]; // Extract credits from first benefit

  const initializeRazorpay = useCallback(() => {
    if (!window.Razorpay) return;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: price * 100,
      currency: "INR",
      name: title,
      description: `Purchase of ${credits} credits`,
      image: "https://example.com/your_logo",
      prefill: {
        name: user?.name || "Customer",
        email: user?.email || "customer@example.com",
        contact: user?.phone || "9000090000"
      },
      theme: {
        color: "#3399cc"
      },
      handler: function (response) {
        onPaymentSuccess(credits, response.razorpay_payment_id);
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      toast.error(`Payment failed: ${response.error.description}`);
    });
    setRzpInstance(rzp);
  }, [title, price, credits, user, onPaymentSuccess]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = initializeRazorpay;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [initializeRazorpay]);

  const handlePayment = (e) => {
    e.preventDefault();
    if (rzpInstance) {
      rzpInstance.open();
    } else {
      toast.error("Payment gateway not ready. Please try again.");
    }
  };

  return (
    <CardContainer className="inter-var -mt-16">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] sm:w-[25rem] h-auto rounded-xl p-6 border w-auto">
        <CardItem translateZ="50" className="w-full mt-4">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover rounded-lg"
            loading="lazy"
          />
        </CardItem>

        <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white mt-4">
          {title}
        </CardItem>

        <CardItem translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
          {description}
        </CardItem>

        <div className="flex items-center justify-between mt-4">
          <CardItem translateZ="70" className="text-lg font-semibold text-emerald-500">
            ₹{price}
          </CardItem>
          <CardItem translateZ="70" className="text-lg font-semibold text-blue-500">
            {credits} Credits
          </CardItem>
        </div>

        <ul className="mt-4 text-sm text-gray-500 dark:text-gray-300 space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index}>✅ {benefit}</li>
          ))}
        </ul>

        <div className="flex justify-between items-center mt-8">
          <CardItem translateZ={20} as={Link} to="/learn-more" className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white">
            Learn More →
          </CardItem>
          <CardItem
            onClick={handlePayment}
            translateZ={20}
            as="button"
            disabled={!student}
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold disabled:opacity-50"
          >
            {student ? buttonText : "Loading..."}
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
});

const UpgradePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, email, obj } = useSelector((state) => state.getUser);
  const { student } = useSelector((state) => state.getStudent);
  const [isProcessing, setIsProcessing] = useState(false);
  const studentRef = useRef(null);

  useEffect(() => {
    // if ( obj?.role !== 'STUDENT') {
    //   navigate("/home");
    //   return;
    // }

    if (student) {
      const s2 = { ...student };
      console.log(s2)
    }

    
  }, [obj, student, navigate]);

  const handlePaymentSuccess = async (credits, paymentId) => {
    try {
      setIsProcessing(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API}/users/makeOrder`,
        {
          ...student,
          id: id,
          credits: student?.credits + parseInt(credits),
          order_id: paymentId,
        },
        { withCredentials: true }
      );

      if (response.data) {
        toast.success(`Successfully added ${credits} credits to your account!`);
        dispatch(fetchStudent(id));
        navigate("/courses");
      } else {
        throw new Error(response.data.message || "Failed to update credits");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const creditPacks = [
    {
      title: "Starter Pack",
      price: 29,
      description: "Perfect for trying out courses",
      benefits: [
        "50 credits (5 courses)",
        "10 credits = 1 course",
        "No recurring payments",
        "Use anytime"
      ],
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Value Pack",
      price: 49,
      description: "Great for regular learners",
      benefits: [
        "130 credits (13 courses)",
        "Save ₹20 vs buying Starter twice",
        "Only ₹3.77 per course",
        "Best value for money"
      ],
      imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"
    },
    {
      title: "Premium Pack",
      price: 99,
      description: "For serious learners",
      benefits: [
        "300 credits (30 courses)",
        "6x more than Starter Pack",
        "Only ₹3.30 per course",
        "Best long-term value"
      ],
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
    }
  ];

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-900">
        <div className="text-white text-xl">Processing your payment...</div>
      </div>
    );
  }

  return (
    <div className="mt-16 min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-4 ">
        <h1 className="relative top-2 text-3xl font-bold text-center text-white mb-4">Upgrade Your Learning</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {creditPacks.map((pack, index) => (
            <CreditCard
              key={index}
              {...pack}
              buttonText={`Buy for ₹${pack.price}`}
              user={{
                name: student?.fullName,
                email: student?.email,
                phone: student?.phone
              }}
              student={student}
              onPaymentSuccess={handlePaymentSuccess}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;