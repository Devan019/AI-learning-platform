import React, { useState, useEffect } from "react";
import Label from "./ui/label";
import Input from "./ui/input";
import { useNavigate } from "react-router-dom";
import skillsSuggestions from "../data/skills.data.json";
import domainsSuggestions from "../data/domains.data.json";

export function CombinedForm() {
  const navigate = useNavigate();
  const [skillsopts] = useState(skillsSuggestions.skills);
  const [domainopts] = useState(domainsSuggestions.domains);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [skillsInputValue, setSkillsInputValue] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false); // Track submission
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    degree: "",
    interest: "",
    college: "",
    skills: [],
    domains: [],
    graduationYear: "",
    gpa: "",
    extracurriculars: "",
    researchTopics: "",
    careerGoals: "",
    tags: [],
  });

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
    if (!formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
    setSkillsInputValue("");
    setFilteredSkills([]);
  };

  const handleDomainChange = (e) => {
    const domain = e.target.value;
    const isChecked = e.target.checked;
    setFormData({
      ...formData,
      domains: isChecked
        ? [...formData.domains, domain]
        : formData.domains.filter((d) => d !== domain),
    });
  };

  const removeTag = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.skills.length === 0) {
      alert("Please add at least one skill");
      return;
    }
    if (formData.domains.length === 0) {
      alert("Please select at least one domain");
      return;
    }

    localStorage.setItem("combinedFormData", JSON.stringify(formData));
    console.log("Form Submitted", formData);

    setFormSubmitted(true); // Trigger API call
    navigate("/");
  };

  // useEffect to send data after submission
  useEffect(() => {
    if (formSubmitted) {
      const sendDataToBackend = async () => {
        try {
          const response = await fetch("https://your-backend-api.com/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          const data = await response.json();
          console.log("Response from backend:", data);
        } catch (error) {
          console.error("Error sending data:", error);
        }
      };

      sendDataToBackend();
    }
  }, [formSubmitted, formData]);

  return (
    <FormContainer title="Student Profile & Interests" handleSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LabelInputContainer>
              <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={handleChange} 
                type="text" 
                placeholder="Enter your name"
                className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
                required
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
              <Input 
                id="email" 
                value={formData.email} 
                onChange={handleChange} 
                type="email" 
                placeholder="your.email@example.com"
                className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
                required
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="degree">Degree Program <span className="text-red-500">*</span></Label>
              <Input 
                id="degree" 
                value={formData.degree} 
                onChange={handleChange} 
                type="text" 
                placeholder="e.g., BSc Computer Science"
                className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
                required
              />
            </LabelInputContainer>
          </div>
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <LabelInputContainer>
              <Label htmlFor="college">University/College <span className="text-red-500">*</span></Label>
              <Input 
                id="college" 
                value={formData.college} 
                onChange={handleChange} 
                type="text" 
                placeholder="Your institution name"
                className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
                required
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="interest">Main Interest <span className="text-red-500">*</span></Label>
              <Input 
                id="interest" 
                value={formData.interest} 
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
              <Label htmlFor="skills">Technical Skills <span className="text-red-500">*</span></Label>
              <div className={`border border-gray-700 bg-gray-800 rounded-lg p-3 flex flex-wrap gap-2 relative group transition-all duration-300 hover:border-purple-500 ${formData.skills.length === 0 ? "border-red-500" : ""}`}>
                {formData.skills.map((skill, index) => (
                  <span key={index} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full flex items-center text-sm">
                    {skill} 
                    <button 
                      onClick={() => removeTag(index)} 
                      className="ml-2 text-xs bg-gray-800 rounded-full h-4 w-4 flex items-center justify-center hover:bg-gray-700"
                      type="button"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  id="skills"
                  type="text"
                  value={skillsInputValue}
                  onChange={handleSkillInput}
                  className="bg-transparent outline-none flex-grow min-w-20 px-2 py-1 text-white placeholder-gray-400"
                  placeholder={formData.skills.length ? "" : "Add your technical skills..."}
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
              {formData.skills.length === 0 && <p className="text-xs text-red-500 mt-1">At least one skill is required</p>}
            </LabelInputContainer>
    
            <LabelInputContainer>
              <Label htmlFor="domains">Domain Expertise <span className="text-red-500">*</span></Label>
              <div className={`border border-gray-700 bg-gray-800 rounded-lg p-3 relative transition-all duration-300 hover:border-purple-500 ${formData.domains.length === 0 ? "border-red-500" : ""}`}>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 max-h-48 overflow-y-auto pr-2">
                  {domainopts.map((domain, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`domain-${index}`}
                        value={domain}
                        checked={formData.domains.includes(domain)}
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
              {formData.domains.length === 0 && <p className="text-xs text-red-500 mt-1">At least one domain is required</p>}
              {formData.domains.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-xs text-gray-400">Selected: </span>
                  {formData.domains.map((domain, index) => (
                    <span key={index} className="text-xs text-purple-400">
                      {domain}{index < formData.domains.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              )}
            </LabelInputContainer>
          </div>
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <LabelInputContainer>
              <Label htmlFor="graduationYear">Graduation Year <span className="text-red-500">*</span></Label>
              <Input 
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
              <Label htmlFor="gpa">GPA / Score <span className="text-red-500">*</span></Label>
              <Input 
                id="gpa" 
                value={formData.gpa} 
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
              <Label htmlFor="extracurriculars">Extracurricular Activities <span className="text-red-500">*</span></Label>
              <Input 
                id="extracurriculars" 
                value={formData.extracurriculars} 
                onChange={handleChange} 
                type="text" 
                placeholder="Clubs, organizations, volunteer work, etc."
                className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
                required
              />
            </LabelInputContainer>
            
            <LabelInputContainer>
              <Label htmlFor="researchTopics">Research Interests <span className="text-red-500">*</span></Label>
              <Input 
                id="researchTopics" 
                value={formData.researchTopics} 
                onChange={handleChange} 
                type="text" 
                placeholder="Topics you're interested in researching"
                className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
                required
              />
            </LabelInputContainer>
    
            <LabelInputContainer>
              <Label htmlFor="careerGoals">Career Goals <span className="text-red-500">*</span></Label>
              <Input 
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

const FormContainer = ({ title, handleSubmit, children }) => (
    <div className="mt-8 max-w-5xl w-full mx-auto p-8 shadow-2xl border border-gray-700 rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-950 text-white">
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