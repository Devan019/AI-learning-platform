import React, { useState, useEffect } from "react";
import Label from "./ui/label";
import Input from "./ui/input";
import { useNavigate } from "react-router-dom";
import skillsSuggestions from "../data/skills.data.json";
import domainsSuggestions from "../data/domains.data.json";
import axios from "axios";
import Loader from "./ui/loader";
import { useSelector } from "react-redux";

export function Interest() {
  const [loading, setloading] = useState("hidden")
  const navigate = useNavigate();
  const [skillsopts] = useState(skillsSuggestions.skills);
  const [domainopts] = useState(domainsSuggestions.domains);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [skillsInputValue, setSkillsInputValue] = useState("");
  const [passworderror, setpassworderror] = useState("")
  const {id,email}  = useSelector((state)=>state.getUser);
  const {student} = useSelector((state) => state.getStudent)

  
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
    tags: [],
    phone : '',
    id : null
  });
  
  useEffect(()=>{
    if(id){
      setFormData((prev)=>{
        return {
          ...prev,
          id : id
        }
      })
      console.log("in if")
    }
  }, [id])
  function setDataOfUser() {
      const user = student;
      console.log(user.technicalSkills)
      setFormData((prevFormData) => ({
        ...prevFormData,
        fullName: user.fullName || "",
        email: user.email || "",
        degreeProgram: user.degreeProgram || "",
        mainInterest: user.mainInterest || "",
        university: user.university || "",
        technicalSkills: user.technicalSkills || [],
        domainExpertise: user.domainExpertise || [],
        graduationYear: user.graduationYear || "",
        gpaScore: user.gpaScore || "",
        extracurricularActivities: user.extracurricularActivities || "",
        researchInterests: user.researchInterests || "",
        careerGoals: user.careerGoals || "",
        phone : user.phone || ""
      }));
  }
  

  async function genrateCourse(id) {
    console.log("generate course");
    const api = await axios.get(
      `${import.meta.env.VITE_API}/gemini/course/user/${id}`,
      {withCredentials: true}
    );
    let rawText = api.data.candidates[0].content.parts[0].text;

    // Remove triple backticks and possible language identifiers
    let cleanedText = rawText.replace(/```json|```/g, "").trim();

    // Parse the cleaned text into JSON
    let jsonData = JSON.parse(cleanedText);

    return jsonData;
  }

  async function updateUser() {
    console.log("create user",  formData);
    const api = await axios.post(`${import.meta.env.VITE_API}/users`, formData,{withCredentials:true});
    
    console.log(api.data);
    return api.data.id;
  }

  async function saveCourse(course, id){
    console.log("save course");
    const api = await axios.post(`${import.meta.env.VITE_API}/courses/user/${id}`,course,{withCredentials:true} )
    console.log(api.data);
  }

  async function main() {
    setloading("");
     await updateUser();
    setloading("hidden");
    navigate("/profile");
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    
  };

  const handleSkillInput = (e) => {
    const value = e.target.value;
    setSkillsInputValue(value);
    setFilteredSkills(
      value.trim() !== ""
        ? skillsopts.filter((skill) =>
            skill.toLowerCase().includes(value.toLowerCase())
          )
        : []
    );
  };

  const handleSkillAdd = (skill) => {
    if (!formData.technicalSkills.includes(skill)) {
      setFormData({
        ...formData,
        technicalSkills: [...formData.technicalSkills, skill],
      });
    }
    setSkillsInputValue("");
    setFilteredSkills([]);
  };

  const handleDomainChange = (e) => {
    const domain = e.target.value;
    const isChecked = e.target.checked;
    setFormData({
      ...formData,
      domainExpertise: isChecked
        ? [...formData.domainExpertise, domain]
        : formData.domainExpertise.filter((d) => d !== domain),
    });
  };

  const removeTag = (index) => {
    setFormData({
      ...formData,
      technicalSkills: formData.technicalSkills.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.technicalSkills.length === 0) {
      alert("Please add at least one skill");
      return;
    }
    if (formData.domainExpertise.length === 0) {
      alert("Please select at least one domain");
      return;
    }

    if(formData.password != formData.repassword){
      setpassworderror("password should match")
    }

    main();
  };
  useEffect(()=>{
    if(id && student){
      setDataOfUser();
    }
  }, [id, student])

  return (
    <FormContainer
    loading={loading}
      title="Student Profile & Interests"
      handleSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LabelInputContainer>
          <Label htmlFor="name">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            name="fullName"
            id="fullName"
            value={formData.fullName}
            onChange={handleChange}
            type="text"
            placeholder="Enter your name"
            className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
            
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="email">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="your.email@example.com"
            className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
            readOnly
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="phone">
            Phone no <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            type="input"
            placeholder="1234567890"
            className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
          />
        </LabelInputContainer>
       
        
      </div>
      <div className="error text-red-600">{passworderror}</div>
      <hr />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <LabelInputContainer>
          <Label htmlFor="degree">
            Degree Program <span className="text-red-500">*</span>
          </Label>
          <Input
            name="degreeProgram"
            id="degreeProgram"
            value={formData.degreeProgram}
            onChange={handleChange}
            type="text"
            placeholder="e.g., BSc Computer Science"
            className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
            required
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="college">
            University/College <span className="text-red-500">*</span>
          </Label>
          <Input
            name="university"
            id="university"
            value={formData.university}
            onChange={handleChange}
            type="text"
            placeholder="Your institution name"
            className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
            required
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="interest">
            Main Interest <span className="text-red-500">*</span>
          </Label>
          <Input
            id="mainInterest"
            name="mainInterest"
            value={formData.mainInterest}
            onChange={handleChange}
            type="text"
            placeholder="Your primary area of interest"
            className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
            required
          />
        </LabelInputContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <LabelInputContainer>
          <Label htmlFor="skills">
            Technical Skills <span className="text-red-500">*</span>
          </Label>
          <div
            className={`border border-gray-700 bg-gray-800 rounded-lg p-3 flex flex-wrap gap-2 relative group transition-all duration-300 hover:border-purple-500 ${
              formData.technicalSkills.length === 0 ? "border-red-500" : ""
            }`}
          >
            {formData.technicalSkills.map((skill, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full flex items-center text-sm"
              >
                {skill}
                <button
                  onClick={() => removeTag(index)}
                  className="ml-2 text-xs bg-gray-800 rounded-full h-4 w-4 flex items-center justify-center hover:bg-gray-700"
                  type="button"
                >
                  x
                </button>
              </span>
            ))}
            <input
              id="technicalSkills"
              type="text"
              value={skillsInputValue}
              onChange={handleSkillInput}
              className="bg-transparent outline-none flex-grow min-w-20 px-2 py-1 text-white placeholder-gray-400"
              placeholder={
                formData.technicalSkills.length
                  ? ""
                  : "Add your technical skills..."
              }
            />
            {filteredSkills.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-48 overflow-y-auto z-50">
                {filteredSkills.map((skill, index) => (
                  <div
                    key={index}
                    onClick={() => handleSkillAdd(skill)}
                    className="p-2 cursor-pointer hover:bg-gray-700 text-white transition-colors"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            )}
          </div>
          {formData.technicalSkills.length === 0 && (
            <p className="text-xs text-red-500 mt-1">
              At least one skill is required
            </p>
          )}
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="domains">
            Domain Expertise <span className="text-red-500">*</span>
          </Label>
          <div
            className={`border border-gray-700 bg-gray-800 rounded-lg p-3 relative transition-all duration-300 hover:border-purple-500 ${
              formData.domainExpertise.length === 0 ? "border-red-500" : ""
            }`}
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 max-h-48 overflow-y-auto pr-2">
              {domainopts.map((domain, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`domain-${index}`}
                    value={domain}
                    checked={formData.domainExpertise.includes(domain)}
                    onChange={handleDomainChange}
                    className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700"
                  />
                  <label
                    htmlFor={`domain-${index}`}
                    className="text-sm cursor-pointer hover:text-purple-400 transition-colors"
                  >
                    {domain}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {formData.domainExpertise.length === 0 && (
            <p className="text-xs text-red-500 mt-1">
              At least one domain is required
            </p>
          )}
          {formData.domainExpertise.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="text-xs text-gray-400">Selected: </span>
              {formData.domainExpertise.map((domain, index) => (
                <span key={index} className="text-xs text-purple-400">
                  {domain}
                  {index < formData.domainExpertise.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          )}
        </LabelInputContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <LabelInputContainer>
          <Label htmlFor="graduationYear">
            Graduation Year <span className="text-red-500">*</span>
          </Label>
          <Input
            name="graduationYear"
            id="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            type="text"
            placeholder="Expected year of graduation"
            className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
            required
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="gpa">
            GPA / Score <span className="text-red-500">*</span>
          </Label>
          <Input
            name="gpaScore"
            id="gpaScore"
            value={formData.gpaScore}
            onChange={handleChange}
            type="text"
            placeholder="Your current GPA or score"
            className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
            required
          />
        </LabelInputContainer>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6">
        <LabelInputContainer>
          <Label htmlFor="extracurriculars">
            Extracurricular Activities <span className="text-red-500">*</span>
          </Label>
          <Input
            name="extracurricularActivities"
            id="extracurricularActivities"
            value={formData.extracurricularActivities}
            onChange={handleChange}
            type="text"
            placeholder="Clubs, organizations, volunteer work, etc."
            className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
            required
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="researchTopics">
            Research Interests <span className="text-red-500">*</span>
          </Label>
          <Input
            name="researchInterests"
            id="researchInterests"
            value={formData.researchInterests}
            onChange={handleChange}
            type="text"
            placeholder="Topics you're interested in researching"
            className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
            required
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="careerGoals">
            Career Goals <span className="text-red-500">*</span>
          </Label>
          <Input
            name="careerGoals"
            id="careerGoals"
            value={formData.careerGoals}
            onChange={handleChange}
            type="text"
            placeholder="Where do you see yourself in 5 years?"
            className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
            required
          />
        </LabelInputContainer>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-400 text-center mb-4">
          <span className="text-red-500">*</span> All fields are required
        </p>
      </div>

      <div className="w-full flex justify-center mt-6">
        <button
          type="submit"
          className="relative inline-flex h-14 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-50 transform hover:scale-105 transition-all duration-300"
        >
          <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_25%,#6366F1_50%,#A855F7_75%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-900 px-8 py-2 text-base font-medium text-white backdrop-blur-3xl">
            Submit Profile 🚀
          </span>
        </button>
      </div>
    </FormContainer>
  );
}

const FormContainer = ({ title, handleSubmit, children, loading }) => (
  <div className="mt-8 max-w-5xl w-full mx-auto p-8 shadow-2xl border border-gray-700 rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-950 text-white">
    <div className={`${loading}`}>
      <Loader />
    </div>
    <div className="flex items-center justify-center mb-8">
      <div className="h-1 w-10 bg-purple-500 rounded-full mr-3"></div>
      <h2 className="font-bold text-3xl text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
        {title}
      </h2>
      <div className="h-1 w-10 bg-purple-500 rounded-full ml-3"></div>
    </div>
    <form className="space-y-6" onSubmit={handleSubmit}>
      {children}
    </form>
  </div>
);

const LabelInputContainer = ({ children }) => (
  <div className="flex flex-col space-y-2 w-full">{children}</div>
);
