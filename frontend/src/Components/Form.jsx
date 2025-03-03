import React, { useState } from "react";
import Label from "./ui/label";
import Input from "./ui/input";

export function SignupForm() {
  const [signupData, setSignupData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setSignupData({ ...signupData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("signupData", JSON.stringify(signupData));
    localStorage.setItem("login" , true)
    console.log("Signup Form submitted", signupData);
  };

  return (
    <FormContainer title="Signup Form" handleSubmit={handleSubmit}>
      <LabelInputContainer>
        <Label htmlFor="firstname">First Name</Label>
        <Input id="firstname" value={signupData.firstname} onChange={handleChange} type="text" />
      </LabelInputContainer>
      
      <LabelInputContainer>
        <Label htmlFor="lastname">Last Name</Label>
        <Input id="lastname" value={signupData.lastname} onChange={handleChange} type="text" />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={signupData.email} onChange={handleChange} type="email" />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="password">Password</Label>
        <Input id="password" value={signupData.password} onChange={handleChange} type="password" />
      </LabelInputContainer>

      <button className="bg-black text-white rounded-md h-10 font-medium w-full" type="submit">
        Sign Up
      </button>
    </FormContainer>
  );
}

export function LoginForm() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("loginData", JSON.stringify(loginData));
    console.log("Login Form submitted", loginData);
  };

  return (
    <FormContainer title="Login Form" handleSubmit={handleSubmit}>
      <LabelInputContainer>
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={loginData.email} onChange={handleChange} type="email" />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="password">Password</Label>
        <Input id="password" value={loginData.password} onChange={handleChange} type="password" />
      </LabelInputContainer>

      <button className="bg-black text-white rounded-md h-10 font-medium w-full" type="submit">
        Login
      </button>
    </FormContainer>
  );
}

export function DomainForm() {
  const [domainData, setDomainData] = useState({
    degree: "",
    interest: "",
    college: "",
    skills: "",
    domains: "",
  });

  const handleChange = (e) => {
    setDomainData({ ...domainData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("domainData", JSON.stringify(domainData));
    console.log("Domain Form submitted", domainData);
  };

  return (
    <FormContainer title="Domain Form" handleSubmit={handleSubmit}>
      <LabelInputContainer>
        <Label htmlFor="degree">Degree</Label>
        <Input id="degree" value={domainData.degree} onChange={handleChange} type="text" />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="interest">Interest</Label>
        <Input id="interest" value={domainData.interest} onChange={handleChange} type="text" />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="college">College Name</Label>
        <Input id="college" value={domainData.college} onChange={handleChange} type="text" />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="skills">Skills</Label>
        <Input id="skills" value={domainData.skills} onChange={handleChange} type="text" />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="domains">Domains</Label>
        <Input id="domains" value={domainData.domains} onChange={handleChange} type="text" />
      </LabelInputContainer>

      <button className="bg-black text-white rounded-md h-10 font-medium w-full" type="submit">
        Save Domains
      </button>
    </FormContainer>
  );
}

const FormContainer = ({ title, handleSubmit, children }) => (
  <div className="max-w-md w-full mx-auto p-4 md:p-8 shadow-input bg-white dark:bg-black">
    <h2 className="font-bold text-xl">{title}</h2>
    <form className="my-8" onSubmit={handleSubmit}>
      {children}
    </form>
  </div>
);

const LabelInputContainer = ({ children }) => (
  <div className="flex flex-col space-y-2 w-full mb-4">{children}</div>
);
