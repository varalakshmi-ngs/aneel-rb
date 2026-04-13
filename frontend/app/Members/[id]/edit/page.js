'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getApiBase } from '@/utils/apiBase';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiHeart, FiUsers, FiBook, FiCheck, FiChevronRight, FiChevronLeft, FiSave, FiX, FiPlus, FiTrash2, FiCamera } from 'react-icons/fi';
import Link from 'next/link';

const ALL_STEPS = [
  { id: 1, title: 'Identity', icon: FiUser },
  { id: 2, title: 'Family', icon: FiHeart },
  { id: 3, title: 'Children', icon: FiUsers },
  { id: 4, title: 'Church', icon: FiBook },
];

export default function EditProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    first_name: '',
    surname: '',
    gender: '',
    dob: '',
    marital_status: 'Single',
    spouse_first_name: '',
    spouse_surname: '',
    spouse_dob: '',
    marriage_date: '',
    baptism_date: '',
    confirmation_date: '',
    joining_date: '',
  });

  const [children, setChildren] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [spousePhoto, setSpousePhoto] = useState(null);
  const [childPhotos, setChildPhotos] = useState({});
  const [existingPhotos, setExistingPhotos] = useState({
    profile: null,
    spouse: null,
  });

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(`${getApiBase()}/members/${params.id}`);
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        
        // Map data to form
        setFormData({
          first_name: data.first_name || '',
          surname: data.surname || '',
          gender: data.gender || '',
          dob: data.dob ? data.dob.split('T')[0] : '',
          marital_status: data.marital_status || 'Single',
          spouse_first_name: data.spouse?.first_name || '',
          spouse_surname: data.spouse?.surname || '',
          spouse_dob: data.spouse?.dob ? data.spouse.dob.split('T')[0] : '',
          marriage_date: data.spouse?.marriage_date ? data.spouse.marriage_date.split('T')[0] : '',
          baptism_date: data.church_records?.baptism_date ? data.church_records.baptism_date.split('T')[0] : '',
          confirmation_date: data.church_records?.confirmation_date ? data.church_records.confirmation_date.split('T')[0] : '',
          joining_date: data.church_records?.joining_date ? data.church_records.joining_date.split('T')[0] : '',
        });

        if (data.children) {
          setChildren(data.children.map(c => ({
            name: c.name,
            gender: c.gender,
            dob: c.dob ? c.dob.split('T')[0] : '',
            photo_url: c.photo_url,
            has_photo: !!c.photo_url
          })));
        }

        setExistingPhotos({
          profile: data.photo_url,
          spouse: data.spouse?.photo_url,
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchMember();
  }, [params.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleChildChange = (index, field, value) => {
    const updated = [...children];
    updated[index][field] = value;
    setChildren(updated);
  };

  const addChild = () => {
    setChildren([...children, { name: '', gender: 'Male', dob: '', has_photo: false }]);
  };

  const removeChild = (index) => {
    setChildren(children.filter((_, i) => i !== index));
    const newChildPhotos = { ...childPhotos };
    delete newChildPhotos[index];
    setChildPhotos(newChildPhotos);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('member_token');
      const submitData = new FormData();

      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      if (profilePhoto) submitData.append('profile_photo', profilePhoto);
      else if (existingPhotos.profile) submitData.append('photo_url', existingPhotos.profile);

      if (formData.marital_status === 'Married') {
        if (spousePhoto) submitData.append('spouse_photo', spousePhoto);
        else if (existingPhotos.spouse) submitData.append('spouse_photo_url', existingPhotos.spouse);
      }

      const childrenPayload = children.map((c, i) => {
        if (childPhotos[i]) c.has_photo = true;
        return c;
      });
      submitData.append('children', JSON.stringify(childrenPayload));

      Object.keys(childPhotos).forEach(index => {
        submitData.append('child_photos', childPhotos[index]);
      });

      const res = await fetch(`${getApiBase()}/members/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setSuccess(true);
      setTimeout(() => {
        router.push(`/Members/${params.id}`);
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const steps = ALL_STEPS.filter(s => formData.marital_status === 'Married' || s.id !== 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-neutral-800 p-8 rounded-3xl shadow-2xl border border-emerald-500/30 text-center max-w-md w-full">
           <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck size={40} />
           </div>
           <h2 className="text-3xl font-bold text-white mb-2">Profile Updated!</h2>
           <p className="text-neutral-400">Your changes have been saved successfully. Redirecting to profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Edit Profile</h1>
            <p className="text-gray-500 font-medium">Update your membership information</p>
          </div>
          <Link href={`/Members/${params.id}`} className="p-3 bg-white text-gray-400 hover:text-gray-900 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <FiX size={24} />
          </Link>
        </div>

        {/* Wizard Header */}
        <div className="flex justify-between items-center mb-12 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          {steps.map((step) => {
            const Icon = step.icon;
            const active = step.id === currentStep;
            const done = step.id < currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 flex-1">
                <button onClick={() => setCurrentStep(step.id)} className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all ${
                  active ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 
                  done ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-gray-100 text-gray-300'
                }`}>
                  <Icon size={20} />
                </button>
                <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</span>
              </div>
            )
          })}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8 md:p-12">
          
          <AnimatePresence mode="wait">
            {/* Step 1: Identity */}
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="flex flex-col items-center mb-4">
                  <div className="relative group">
                    <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl group-hover:border-emerald-500 transition-colors relative">
                      {profilePhoto ? (
                        <Image src={URL.createObjectURL(profilePhoto)} alt="Profile photo preview" fill className="object-cover" unoptimized />
                      ) : existingPhotos.profile ? (
                        <Image src={existingPhotos.profile} alt="Current profile photo" fill className="object-cover" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                          <FiUser size={48} />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-3 bg-emerald-600 text-white rounded-2xl cursor-pointer shadow-lg hover:bg-emerald-500 transition-colors">
                      <FiCamera size={18} />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => setProfilePhoto(e.target.files[0])} />
                    </label>
                  </div>
                  <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Update Profile Photo</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:border-emerald-500 focus:outline-none font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Surname</label>
                    <input type="text" name="surname" value={formData.surname} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:border-emerald-500 focus:outline-none font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:border-emerald-500 focus:outline-none font-medium">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:border-emerald-500 focus:outline-none font-medium" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Family */}
            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="space-y-4 text-center">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Marital Status</label>
                  <div className="flex gap-4 justify-center">
                    {['Single', 'Married'].map(s => (
                      <button key={s} onClick={() => setFormData({...formData, marital_status: s})} className={`px-12 py-4 rounded-2xl font-black uppercase text-xs tracking-widest border-2 transition-all ${
                        formData.marital_status === s ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-500/20' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                      }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.marital_status === 'Married' && (
                  <div className="pt-10 border-t border-gray-100 space-y-10">
                     <div className="flex flex-col items-center">
                        <div className="relative group">
                          <div className="w-28 h-28 bg-gray-50 rounded-[2.2rem] overflow-hidden border-4 border-white shadow-lg group-hover:border-emerald-500 transition-all relative">
                            {spousePhoto ? (
                              <Image src={URL.createObjectURL(spousePhoto)} alt="Spouse photo preview" fill className="object-cover" unoptimized />
                            ) : existingPhotos.spouse ? (
                              <Image src={existingPhotos.spouse} alt="Current spouse photo" fill className="object-cover" unoptimized />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-200">
                                <FiHeart size={36} />
                              </div>
                            )}
                          </div>
                          <label className="absolute bottom-0 right-0 p-2.5 bg-emerald-600 text-white rounded-xl cursor-pointer shadow-md hover:bg-emerald-500 transition-colors">
                            <FiCamera size={16} />
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => setSpousePhoto(e.target.files[0])} />
                          </label>
                        </div>
                        <p className="mt-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Spouse Photo</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Spouse First Name</label>
                          <input type="text" name="spouse_first_name" value={formData.spouse_first_name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:border-emerald-500 font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Spouse Surname</label>
                          <input type="text" name="spouse_surname" value={formData.spouse_surname} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:border-emerald-500 font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Spouse DOB</label>
                          <input type="date" name="spouse_dob" value={formData.spouse_dob} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Marriage Date</label>
                          <input type="date" name="marriage_date" value={formData.marriage_date} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 font-medium" />
                        </div>
                     </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Children */}
            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="flex justify-between items-center bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <div className="flex flex-col">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Family History</p>
                    <p className="text-sm font-bold text-gray-900">Manage Children Records</p>
                  </div>
                  <button onClick={addChild} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-500/20 hover:bg-emerald-500">
                    <FiPlus size={14} /> ADD CHILD
                  </button>
                </div>

                <div className="space-y-6">
                  {children.map((child, idx) => (
                    <div key={idx} className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 relative group transition-all hover:bg-white hover:shadow-xl hover:border-emerald-100">
                      <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors"></div>
                      <button onClick={() => removeChild(idx)} className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors">
                        <FiTrash2 size={24} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <div className="flex flex-col items-center justify-center">
                           <div className="w-24 h-24 bg-white rounded-3xl overflow-hidden mb-3 border-2 border-gray-100 relative shadow-sm group-hover:border-emerald-200">
                               {childPhotos[idx] ? (
                                   <Image src={URL.createObjectURL(childPhotos[idx])} alt={`Photo of child ${idx + 1}`} fill className="object-cover" unoptimized />
                               ) : child.photo_url ? (
                                   <Image src={child.photo_url} alt={`Photo of child ${idx + 1}`} fill className="object-cover" unoptimized />
                               ) : (
                                   <div className="w-full h-full flex items-center justify-center text-gray-100">
                                       <FiUser size={36} />
                                   </div>
                               )}
                               <label className="absolute inset-0 flex items-center justify-center bg-emerald-600/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                  <FiCamera className="text-white" size={20} />
                                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                      const newCP = {...childPhotos};
                                      newCP[idx] = e.target.files[0];
                                      setChildPhotos(newCP);
                                  }} />
                               </label>
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Child Photo</span>
                        </div>
                        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Name</label>
                              <input type="text" value={child.name} onChange={(e) => handleChildChange(idx, 'name', e.target.value)} className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-gray-900 text-sm font-medium" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                              <select value={child.gender} onChange={(e) => handleChildChange(idx, 'gender', e.target.value)} className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-gray-900 text-sm font-medium">
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                              </select>
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">DOB</label>
                              <input type="date" value={child.dob} onChange={(e) => handleChildChange(idx, 'dob', e.target.value)} className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-gray-900 text-sm font-medium" />
                            </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {children.length === 0 && (
                    <div className="p-16 text-center bg-gray-50 border-2 border-dashed border-gray-100 rounded-[3rem]">
                       <FiUsers className="mx-auto text-gray-200 mb-4" size={56} />
                       <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No children records found.</p>
                       <p className="text-[10px] text-gray-300 mt-2 uppercase tracking-tighter">Click add child to create a new entry</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 4: Church */}
            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                 <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-widest border-l-4 border-emerald-500 pl-4">Church Registry</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Baptism Date</label>
                      <input type="date" name="baptism_date" value={formData.baptism_date} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:border-emerald-500 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirmation Date</label>
                      <input type="date" name="confirmation_date" value={formData.confirmation_date} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:border-emerald-500 font-medium" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Church Joining Date</label>
                      <input type="date" name="joining_date" value={formData.joining_date} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:border-emerald-500 font-medium" />
                    </div>
                 </div>
                 
                 <div className="mt-12 p-8 bg-emerald-50 border border-emerald-100 rounded-[2.5rem]">
                    <div className="flex items-start gap-5">
                        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
                            <FiSave size={28} />
                        </div>
                        <div>
                            <h4 className="text-emerald-900 font-black uppercase text-sm mb-1 tracking-widest">Update Registry?</h4>
                            <p className="text-xs text-emerald-700/70 font-bold leading-relaxed">By clicking the update button, you confirm that these church records are accurate and up to date.</p>
                        </div>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12 pt-10 border-t border-gray-50">
            <button 
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              className={`flex items-center gap-3 font-black uppercase text-[10px] tracking-widest py-4 px-8 rounded-2xl transition-all ${
                currentStep === 1 ? 'opacity-0 disabled:pointer-events-none' : 'text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-white border border-gray-100 hover:shadow-md'
              }`}
            >
              <FiChevronLeft size={16} /> Previous
            </button>

            {currentStep < 4 ? (
              <button 
                onClick={() => setCurrentStep(prev => {
                    let next = prev + 1;
                    if (next === 3 && formData.marital_status === 'Single') next = 4;
                    return next;
                })}
                className="flex items-center gap-3 bg-gray-900 hover:bg-black text-white font-black uppercase text-[10px] tracking-widest py-4 px-10 rounded-2xl transition-all shadow-xl shadow-gray-900/10 active:scale-95"
              >
                Continue <FiChevronRight size={16} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                disabled={saving}
                className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[10px] tracking-widest py-4 px-12 rounded-2xl transition-all shadow-xl shadow-emerald-600/30 disabled:opacity-50 active:scale-95"
              >
                {saving ? 'Saving...' : 'Update Profile'} <FiCheck size={16} />
              </button>
            )}
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
              {error}
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
}

