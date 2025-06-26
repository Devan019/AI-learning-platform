
import { useEffect, useState } from "react";
import { Navbar } from "../Components/Nav";
import { AdminLink } from "../Components/AdminLink";
import CommonLoader from "../Components/CommonLoader";
import Profile from "../Components/Profile";


const ProfilePage = () => {
  const [loading, setLoading] = useState(false)
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
  }, [id, student])



  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <Navbar />
      <AdminLink />
      {loading && (
        <CommonLoader />
      )}

      <Profile formData={formData} />
      
    </div >
  );
};

export default ProfilePage;