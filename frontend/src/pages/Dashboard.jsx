import { Navbar } from '../Components/Nav';
import Insights from '../Components/Insights';
import React, { useEffect, useState } from 'react';
import Profile from '../Components/Profile';
import { useSelector } from 'react-redux';
import CommonLoader from '../Components/CommonLoader';

const Dashboard = () => {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('insights');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { student } = useSelector((state) => state.getStudent);
  const { id } = useSelector((state) => state.getUser);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    degreeProgram: "",
    mainInterest: "",
    university: "",
    technicalSkills: [],
    domainExpertise: [],
    graduationYear: "",
    gpaScore: "",
    extracurricularActivities: "",
    researchInterests: "",
    careerGoals: "",
    phone: ""
  });

  // Get first letter for avatar
  useEffect(() => {
    setLoading(true);
    if (id && student) {
      setFormData(student)
      setLoading(false);
    }
  }, [id, student]);

  // Components mapping - currently only Insights is available
  const components = {
    insights: <Insights />,
    profile: <Profile formData={formData} student={student} />
    
  };

  // Menu items configuration
  const menuItems = [
    { id: 'insights', label: 'Insights', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className='bg-black min-h-screen'>
      <Navbar
        onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        mobileMenuOpen={mobileMenuOpen}
      />
      {loading && (
        <CommonLoader />
      )}

      <div className='flex flex-col md:flex-row w-full bg-transparent ' >
        {/* Mobile menu button */}
        <button
          className='md:hidden fixed bottom-4 right-4  text-white p-3 rounded-full z-50 shadow-lg'
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Sidebar - 20% width on desktop */}
        <div
          className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block fixed md:relative z-40 md:z-auto w-full md:w-1/5`}
        >
          <div className='mt-16 text-white h-screen md:h-[calc(100vh-4rem)] flex flex-col items-start p-4 md:p-6'>
            <div className='w-full space-y-2'>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  <span className='mr-3'>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            <div className='mt-auto pt-4 border-t border-gray-700 w-full'>
              <div className='text-sm text-gray-400 p-3'>
                AI Learning Platform v1.0
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile menu */}
        {mobileMenuOpen && (
          <div
            className='fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden'
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main content - 80% width */}
        <div className='mt-16 w-full md:w-4/5 md:ml-[20%] fixed scroll-auto top-0 left-0 h-full md:h-[calc(100vh-4rem)] overflow-y-auto'>
          <div className='p-4 md:p-8'>
            {components[activeTab] || <Insights />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;