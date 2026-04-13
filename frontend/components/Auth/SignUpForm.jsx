"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getApiBase } from "@/utils/apiBase";
import { 
  FiUser, FiPhone, FiLock, FiCalendar, FiUpload, 
  FiHeart, FiUsers, FiBook, FiCheck, FiChevronRight, FiChevronLeft,
  FiEye, FiEyeOff
} from "react-icons/fi";

const ALL_STEPS = [
  { id: 1, title: "Basic Details", icon: FiUser },
  { id: 2, title: "Family Status", icon: FiHeart },
  { id: 3, title: "Children Info", icon: FiUsers },
  { id: 4, title: "Church Records", icon: FiBook },
];

export default function SignUpForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    first_name: "",
    surname: "",
    gender: "",
    dob: "",
    mobile_number: "",
    password: "",
    marital_status: "Single",
    spouse_first_name: "",
    spouse_surname: "",
    spouse_dob: "",
    marriage_date: "",
    baptism_date: "",
    confirmation_date: "",
    joining_date: "",
  });

  // Dynamic Array for Children
  const [children, setChildren] = useState([]);

  // File Uploads
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [spousePhoto, setSpousePhoto] = useState(null);
  const [childPhotos, setChildPhotos] = useState({}); // key: index, value: File

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleChildChange = (index, field, value) => {
    const updatedChildren = [...children];
    updatedChildren[index][field] = value;
    setChildren(updatedChildren);
  };

  const addChild = () => {
    setChildren([...children, { name: "", gender: "Male", dob: "", has_photo: false }]);
  };

  const removeChild = (index) => {
    const updated = children.filter((_, i) => i !== index);
    setChildren(updated);
    
    // cleanup photos
    const updatedPhotos = { ...childPhotos };
    delete updatedPhotos[index];
    // re-index photos (optional, complex, so we just clear and rely on has_photo index mapping in backend logic)
    setChildPhotos(updatedPhotos);
  };

  // OTP Flows
  const sendOtp = async () => {
    if (!formData.mobile_number || formData.mobile_number.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    try {
      const res = await fetch(`${getApiBase()}/members/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile_number: formData.mobile_number }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOtpSent(true);
      if (data.otp) {
        // Dev mode simulated OTP
        alert(`FOR TESTING ONLY: Your OTP is ${data.otp}`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await fetch(`${getApiBase()}/members/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile_number: formData.mobile_number, otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOtpVerified(true);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.first_name || !formData.surname || !formData.gender || !formData.dob || !formData.password) {
        setError("Please fill all required basic details.");
        return false;
      }
      if (!otpVerified) {
        setError("Please verify your mobile number with OTP before continuing.");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return false;
      }
    }
    if (currentStep === 2) {
      if (formData.marital_status === "Married") {
        if (!formData.spouse_first_name || !formData.spouse_surname || !formData.spouse_dob) {
          setError("Please fill required spouse details.");
          return false;
        }
      }
    }
    if (currentStep === 3) {
       for (let i = 0; i < children.length; i++) {
         if (!children[i].name || !children[i].dob) {
           setError(`Please fill name and date of birth for Child ${i + 1}`);
           return false;
         }
       }
    }
    if (currentStep === 4) {
      if (!formData.baptism_date || !formData.confirmation_date || !formData.joining_date) {
        setError("Please fill all required church records. All dates are mandatory.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setError("");
      setCurrentStep(prev => {
        let next = prev + 1;
        if (next === 3 && formData.marital_status === "Single") next = 4;
        return Math.min(next, 4);
      });
    }
  };

  const prevStep = () => {
    setError("");
    setCurrentStep(prev => {
      let back = prev - 1;
      if (back === 3 && formData.marital_status === "Single") back = 2;
      return Math.max(back, 1);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setError("");

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
         if (formData[key]) submitData.append(key, formData[key]);
      });

      // Photos
      if (profilePhoto) submitData.append('profile_photo', profilePhoto);
      if (spousePhoto && formData.marital_status === "Married") submitData.append('spouse_photo', spousePhoto);
      
      // Map children specifically to match file upload sequence in backend
      const childrenPayload = children.map((c, i) => {
         if (childPhotos[i]) c.has_photo = true;
         return c;
      });
      
      submitData.append('children', JSON.stringify(childrenPayload));

      // Append child photos in order
      for (let i = 0; i < children.length; i++) {
        if (childPhotos[i]) {
          submitData.append('child_photos', childPhotos[i]);
        }
      }

      const res = await fetch(`${getApiBase()}/members/register`, {
        method: "POST",
        body: submitData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Success
      setIsSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const activeSteps = ALL_STEPS.filter(s => formData.marital_status === "Married" || s.id !== 3);

  if (isSuccess) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-3xl border border-emerald-100 shadow-xl">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheck size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Registration Successful</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto font-medium">Your details have been securely submitted. Please wait for an administrator to approve your account before you can log in.</p>
        <button onClick={() => window.location.reload()} className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-3.5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-emerald-600/20 transition-all active:scale-95">
          Return to Sign In
        </button>
      </div>
    );
  }


  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Member Registration</h2>
        <p className="text-gray-500 font-medium">Join our community by creating your account</p>
      </div>


      {/* Wizard Progress */}
      <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 z-0"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 z-0 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (4 - 1)) * 100}%` }}
            ></div>

            
            {activeSteps.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    isActive ? "bg-emerald-500 border-emerald-500 text-white" : 
                    isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-gray-200 text-gray-400"
                  }`}>
                    {isCompleted ? <FiCheck size={20} /> : <Icon size={18} />}
                  </div>
                  <span className={`mt-2 text-[10px] font-black uppercase tracking-widest ${isActive || isCompleted ? "text-emerald-600" : "text-gray-400"}`}>
                    {step.title}
                  </span>
                </div>

              )
            })}
          </div>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-2"
            >
              <FiAlertCircle /> {error}
            </motion.div>
          )}

        </AnimatePresence>

        {/* Form Sections */}
        <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 md:p-12">
          <form onSubmit={handleSubmit}>
            
            {/* STEP 1: Basic Details */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-emerald-500 pl-4 uppercase tracking-widest text-sm">Personal Identity</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name *</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all" required />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Surname *</label>
                    <input type="text" name="surname" value={formData.surname} onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all" required />
                  </div>
 
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender *</label>
                    <div className="flex gap-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                      {["Male", "Female", "Other"].map(g => (
                        <label key={g} className="flex items-center gap-2 cursor-pointer font-bold text-gray-600 text-sm">
                          <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 bg-white border-gray-300" />
                          <span>{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>


                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth *</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all" required />
                  </div>


                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Profile Photo (Optional)</label>
                    <input type="file" accept="image/*" onChange={(e) => setProfilePhoto(e.target.files[0])}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-gray-600 text-sm file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 transition-all" />
                  </div>


                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Mobile Verification *</label>
                    <div className="flex gap-2">
                      <input type="tel" name="mobile_number" value={formData.mobile_number} onChange={handleChange} disabled={otpVerified}
                        placeholder="10-digit mobile number"
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all disabled:opacity-50" required />
                      {!otpVerified && !otpSent && (
                        <button type="button" onClick={sendOtp} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95">
                          Send OTP
                        </button>
                      )}
                      {otpVerified && (
                        <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-6 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-sm">
                          <FiCheck /> Verified
                        </div>
                      )}
                    </div>
                  </div>


                  {otpSent && !otpVerified && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-1 md:col-span-2">
                      <div className="flex gap-2">
                        <input type="text" placeholder="Enter 4-digit OTP" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} maxLength={4}
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold tracking-[1em] text-center" />
                        <button type="button" onClick={verifyOtp} className="bg-blue-600 hover:bg-blue-500 text-white px-10 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                          Verify
                        </button>
                      </div>
                    </motion.div>
                  )}


                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Create Secure Password *</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                        placeholder="Minimum 6 characters"
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all" required />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-500 transition-colors"
                      >
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                      </button>
                    </div>
                  </div>


                </div>
              </motion.div>
            )}

            {/* STEP 2: Family Status */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-emerald-500 pl-4 uppercase tracking-widest text-sm">Family Status</h2>

                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Marital Status</label>
                    <div className="flex gap-4">
                      {["Single", "Married"].map(status => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setFormData({ ...formData, marital_status: status })}
                          className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-widest border-2 transition-all ${
                            formData.marital_status === status
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-600/20"
                              : "bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence>
                    {formData.marital_status === "Married" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-100 overflow-hidden"
                      >
                        <h3 className="md:col-span-2 text-lg font-black text-emerald-600 mb-2 uppercase tracking-widest text-xs">Spouse Details</h3>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Spouse First Name *</label>
                          <input type="text" name="spouse_first_name" value={formData.spouse_first_name} onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all" />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Spouse Surname *</label>
                          <input type="text" name="spouse_surname" value={formData.spouse_surname} onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all" />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Spouse Date of Birth *</label>
                          <input type="date" name="spouse_dob" value={formData.spouse_dob} onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all" />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Marriage Date</label>
                          <input type="date" name="marriage_date" value={formData.marriage_date} onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all" />
                        </div>


                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Spouse Photo (Optional)</label>
                          <input type="file" accept="image/*" onChange={(e) => setSpousePhoto(e.target.files[0])}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-gray-600 text-sm file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 transition-all" />
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Children Information */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 border-l-4 border-emerald-500 pl-4 uppercase tracking-widest text-sm">Children Info</h2>
                    <p className="text-xs text-gray-400 font-black uppercase tracking-widest mt-1 ml-4">Optional family records</p>
                  </div>
                  <button type="button" onClick={addChild} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center gap-2">
                    <FiPlus size={14} /> Add Child
                  </button>
                </div>


                <div className="space-y-6">
                  {children.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-[2rem]">
                      <FiUsers className="mx-auto text-4xl text-gray-200 mb-2" />
                      <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">No children added.</p>
                      <button type="button" onClick={addChild} className="text-emerald-600 hover:text-emerald-500 text-xs font-black uppercase tracking-widest mt-2">Add a child record</button>
                    </div>
                  ) : (
                    children.map((child, index) => (
                      <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                        className="p-6 bg-gray-50 border border-gray-100 rounded-3xl relative shadow-sm">
                        
                        <button type="button" onClick={() => removeChild(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-500 transition-colors">
                          <FiTrash2 size={20} />
                        </button>
                        
                        <h4 className="text-emerald-600 font-black uppercase tracking-widest text-xs mb-6 pb-2 border-b border-gray-200">Child {index + 1}</h4>

                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name *</label>
                            <input type="text" value={child.name} onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-gray-900 text-sm font-medium focus:border-emerald-500 focus:outline-none" />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gender *</label>
                            <select value={child.gender} onChange={(e) => handleChildChange(index, 'gender', e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-gray-900 text-sm font-medium focus:border-emerald-500 focus:outline-none">
                              <option>Male</option>
                              <option>Female</option>
                              <option>Other</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date of Birth *</label>
                            <input type="date" value={child.dob} onChange={(e) => handleChildChange(index, 'dob', e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-gray-900 text-sm font-medium focus:border-emerald-500 focus:outline-none" />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Photo</label>
                            <input type="file" accept="image/*" onChange={(e) => {
                               const newPhotos = {...childPhotos};
                               newPhotos[index] = e.target.files[0];
                               setChildPhotos(newPhotos);
                            }}
                              className="w-full bg-white border border-gray-200 rounded-2xl p-2 text-gray-500 text-xs file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:bg-emerald-600 file:text-white file:font-black file:uppercase file:text-[10px]" />
                          </div>

                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 4: Church Records & Submit */}
            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-black text-gray-900 mb-2 border-l-4 border-emerald-500 pl-4 uppercase tracking-widest text-sm">Church Records</h2>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-8 ml-4">Mandatory verification data</p>

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Baptism Date *</label>
                    <input type="date" name="baptism_date" value={formData.baptism_date} onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all" required />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Baptism Confirmation Date *</label>
                    <input type="date" name="confirmation_date" value={formData.confirmation_date} onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all" required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Joining Church *</label>
                    <input type="date" name="joining_date" value={formData.joining_date} onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all" required />
                  </div>

                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex flex-col items-center gap-2">
                  <h3 className="text-emerald-900 font-black uppercase tracking-widest text-sm">Ready to submit!</h3>
                  <p className="text-xs text-emerald-700/70 font-bold text-center leading-relaxed max-w-sm">By clicking complete registration, you confirm that all the details provided are accurate and the photos uploaded are recent.</p>
                </div>

              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
              <button 
                type="button" 
                onClick={prevStep}
                className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-gray-900 bg-gray-100'}`}
              >
                <FiChevronLeft /> Previous
              </button>
              
              {currentStep < 4 ? (
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-10 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-gray-900/10 transition-all active:scale-95"
                >
                  Continue <FiChevronRight />
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Registering..." : "Complete Registration"} <FiCheck />
                </button>
              )}
            </div>


          </form>
        </div>
      </div>
  );
}
