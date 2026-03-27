import React, { useState, useEffect } from 'react';
import { User, Save, Upload, Car, Globe, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

export default function ProfileSettings({ user, setUser }: any) {
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    drivingLicenseFront: '',
    drivingLicenseBack: '',
    drivingLicenseNumber: '',
    profilePhoto: '',
    vehicleInsurance: '',
    revenueLicense: '',
    tourExperience: '',
    languagesSpoken: [] as string[],
    bankName: '',
    bankBranch: '',
    accountHolder: '',
    accountNumber: ''
  });
  
  const [files, setFiles] = useState<{ [key: string]: File }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:5000/api/auth/profile?id=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setProfile(prev => ({
              ...prev,
              name: data.name || '',
              email: data.email || '',
              phone: data.vendorProfile?.contactDetails || '',
              ...data.vendorProfile,
              languagesSpoken: data.vendorProfile?.languagesSpoken || []
            }));
          }
        });
    }
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // File Constraints Validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      return toast.error("Only .jpg, .jpeg, .png formats allowed.");
    }
    
    let processedFile = file;

    // Smart Image Compression
    const options = {
      maxSizeMB: 1, // Will try to optimize towards 1MB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.8
    };

    try {
      toast.loading("Compressing image...", { id: `compress-${field}` });
      processedFile = await imageCompression(file, options);
      toast.dismiss(`compress-${field}`);
    } catch (error) {
      console.warn("Compression failed, using original file", error);
      toast.dismiss(`compress-${field}`);
    }

    if (processedFile.size > 5 * 1024 * 1024) {
      return toast.error("Max file size is 5MB even after compression.");
    }

    setFiles(prev => ({ ...prev, [field]: processedFile }));
    
    // Create local preview immediately
    const previewUrl = URL.createObjectURL(processedFile);
    setProfile(prev => ({ ...prev, [field]: previewUrl }));
  };

  const handleLanguageToggle = (lang: string) => {
    setProfile(prev => {
      const langs = prev.languagesSpoken;
      if (langs.includes(lang)) return { ...prev, languagesSpoken: langs.filter(l => l !== lang) };
      return { ...prev, languagesSpoken: [...langs, lang] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strict Validation with Inline Errors
    const newErrors: { [key: string]: string } = {};
    if (!profile.name) newErrors.name = "Please fill out this field";
    if (!profile.drivingLicenseNumber) newErrors.drivingLicenseNumber = "Please fill out this field";
    if (!profile.tourExperience) newErrors.tourExperience = "Please fill out this field";
    if (profile.languagesSpoken.length === 0) newErrors.languagesSpoken = "Please select at least one language";
    if (!profile.bankName) newErrors.bankName = "Please fill out this field";
    if (!profile.bankBranch) newErrors.bankBranch = "Please fill out this field";
    if (!profile.accountHolder) newErrors.accountHolder = "Please fill out this field";
    if (!profile.accountNumber) newErrors.accountNumber = "Please fill out this field";
    
    if (!profile.profilePhoto) newErrors.profilePhoto = "Image required";
    if (!profile.drivingLicenseFront) newErrors.drivingLicenseFront = "Image required";
    if (!profile.drivingLicenseBack) newErrors.drivingLicenseBack = "Image required";
    if (!profile.vehicleInsurance) newErrors.vehicleInsurance = "Image required";
    if (!profile.revenueLicense) newErrors.revenueLicense = "Image required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return toast.error("Please fill out all required fields.");
    }

    setIsSubmitting(true);
    toast.loading("Uploading documents & saving...", { id: "save" });

    try {
      const formData = new FormData();
      formData.append('id', user?.id);
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      formData.append('phone', profile.phone);
      formData.append('drivingLicenseNumber', profile.drivingLicenseNumber);
      formData.append('tourExperience', profile.tourExperience);
      formData.append('languagesSpoken', JSON.stringify(profile.languagesSpoken));
      formData.append('bankName', profile.bankName);
      formData.append('bankBranch', profile.bankBranch);
      formData.append('accountHolder', profile.accountHolder);
      formData.append('accountNumber', profile.accountNumber);

      // Append files matching the strict Multer fields
      if (files.profilePhoto) formData.append('profilePhoto', files.profilePhoto);
      if (files.drivingLicenseFront) formData.append('licenseFront', files.drivingLicenseFront);
      if (files.drivingLicenseBack) formData.append('licenseBack', files.drivingLicenseBack);
      if (files.vehicleInsurance) formData.append('insuranceCard', files.vehicleInsurance);
      if (files.revenueLicense) formData.append('revenueLicense', files.revenueLicense);

      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        body: formData // No Content-Type header so browser sets multipart boundary
      });

      if (res.ok) {
        const data = await res.json();
        setUser((prev: any) => ({ ...prev, ...data.user }));
        toast.success("Profile Submitted for Review!", { id: "save", duration: 4000 });
        setFiles({}); // clear local files
      } else {
        const err = await res.json();
        toast.error(`Failed to update profile: ${err.message}`, { id: "save" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error during upload.", { id: "save" });
    }
    setIsSubmitting(false);
  };

  const availableLanguages = ["English", "German", "French", "Russian", "Spanish", "Chinese"];

  return (
    <div className="glass p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm max-w-4xl">
       <h2 className="text-2xl font-bold mb-6 flex items-center"><User className="mr-3 text-primary"/> Driver KYC & Verification</h2>
       <form onSubmit={handleSubmit} className="space-y-8">
         {/* Identity */}
         <div className="p-6 bg-surface/50 border border-gray-200 dark:border-gray-700 rounded-2xl">
           <h3 className="text-lg font-bold mb-4 flex items-center"><User className="w-5 h-5 mr-2 text-primary"/> Identity</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div className="space-y-1">
               <label className="text-sm font-semibold text-gray-500">FullName</label>
               <input required type="text" value={profile.name} onChange={e=>setProfile({...profile, name: e.target.value})} className={`w-full bg-surface border rounded-xl py-3 px-4 outline-none ${errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`} />
               {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
             </div>
             <div className="space-y-1">
               <label className="text-sm font-semibold text-gray-500">License Number</label>
               <input required type="text" value={profile.drivingLicenseNumber} onChange={e=>setProfile({...profile, drivingLicenseNumber: e.target.value})} className={`w-full bg-surface border rounded-xl py-3 px-4 outline-none ${errors.drivingLicenseNumber ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`} />
               {errors.drivingLicenseNumber && <p className="text-xs text-red-500 mt-1">{errors.drivingLicenseNumber}</p>}
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
             <UploadBox label="Driver Selfie" field="profilePhoto" profile={profile} handleFileUpload={handleFileUpload} isCircular={true} error={errors.profilePhoto} />
             <UploadBox label="License Front" field="drivingLicenseFront" profile={profile} handleFileUpload={handleFileUpload} error={errors.drivingLicenseFront} />
             <UploadBox label="License Back" field="drivingLicenseBack" profile={profile} handleFileUpload={handleFileUpload} error={errors.drivingLicenseBack} />
           </div>
         </div>

         {/* Compliance */}
         <div className="p-6 bg-surface/50 border border-gray-200 dark:border-gray-700 rounded-2xl">
           <h3 className="text-lg font-bold mb-4 flex items-center"><Car className="w-5 h-5 mr-2 text-primary"/> Compliance</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <UploadBox label="Vehicle Insurance Card" field="vehicleInsurance" profile={profile} handleFileUpload={handleFileUpload} error={errors.vehicleInsurance} />
             <UploadBox label="Revenue License" field="revenueLicense" profile={profile} handleFileUpload={handleFileUpload} error={errors.revenueLicense} />
           </div>
         </div>

         {/* Driver Bio */}
         <div className="p-6 bg-surface/50 border border-gray-200 dark:border-gray-700 rounded-2xl">
           <h3 className="text-lg font-bold mb-4 flex items-center"><Globe className="w-5 h-5 mr-2 text-primary"/> Driver Bio</h3>
           <div className="space-y-5">
             <div className="space-y-1">
               <label className="text-sm font-semibold text-gray-500">Tour Experience</label>
               <textarea required rows={3} placeholder="E.g., 5 years of experience specializing in cultural triangle tours..." value={profile.tourExperience} onChange={e=>setProfile({...profile, tourExperience: e.target.value})} className={`w-full bg-surface border rounded-xl py-3 px-4 outline-none resize-none ${errors.tourExperience ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`} />
               {errors.tourExperience && <p className="text-xs text-red-500">{errors.tourExperience}</p>}
             </div>
             <div className="space-y-1">
               <label className="text-sm font-semibold text-gray-500 mb-2 block">Languages Spoken</label>
               {errors.languagesSpoken && <p className="text-xs text-red-500 mb-2">{errors.languagesSpoken}</p>}
               <div className="flex flex-wrap gap-2">
                 {availableLanguages.map(lang => (
                   <div 
                     key={lang} 
                     onClick={() => handleLanguageToggle(lang)}
                     className={`cursor-pointer px-4 py-2 rounded-full text-sm font-bold border transition-all ${profile.languagesSpoken.includes(lang) ? 'bg-primary border-primary text-white shadow-md' : 'bg-surface border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary'}`}
                   >
                     {lang}
                   </div>
                 ))}
               </div>
             </div>
           </div>
         </div>

         {/* Payouts */}
         <div className="p-6 bg-surface/50 border border-gray-200 dark:border-gray-700 rounded-2xl">
           <h3 className="text-lg font-bold mb-4 flex items-center"><CreditCard className="w-5 h-5 mr-2 text-primary"/> Payout Settings</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div className="space-y-1"><label className="text-sm font-semibold text-gray-500">Bank Name</label><input required type="text" value={profile.bankName} onChange={e=>setProfile({...profile, bankName: e.target.value})} className={`w-full bg-surface border rounded-xl py-3 px-4 outline-none ${errors.bankName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`} />{errors.bankName && <p className="text-xs text-red-500">{errors.bankName}</p>}</div>
             <div className="space-y-1"><label className="text-sm font-semibold text-gray-500">Branch Name</label><input required type="text" value={profile.bankBranch} onChange={e=>setProfile({...profile, bankBranch: e.target.value})} className={`w-full bg-surface border rounded-xl py-3 px-4 outline-none ${errors.bankBranch ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`} />{errors.bankBranch && <p className="text-xs text-red-500">{errors.bankBranch}</p>}</div>
             <div className="space-y-1"><label className="text-sm font-semibold text-gray-500">Account Holder Name</label><input required type="text" value={profile.accountHolder} onChange={e=>setProfile({...profile, accountHolder: e.target.value})} className={`w-full bg-surface border rounded-xl py-3 px-4 outline-none ${errors.accountHolder ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`} />{errors.accountHolder && <p className="text-xs text-red-500">{errors.accountHolder}</p>}</div>
             <div className="space-y-1"><label className="text-sm font-semibold text-gray-500">Account Number</label><input required type="text" value={profile.accountNumber} onChange={e=>setProfile({...profile, accountNumber: e.target.value})} className={`w-full bg-surface border rounded-xl py-3 px-4 outline-none ${errors.accountNumber ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`} />{errors.accountNumber && <p className="text-xs text-red-500">{errors.accountNumber}</p>}</div>
           </div>
         </div>
         
         <button disabled={isSubmitting} type="submit" className="w-full bg-primary disabled:opacity-75 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg mt-4 flex items-center justify-center hover:bg-primary/90 transition text-lg">
          <Save className="w-5 h-5 mr-2" /> {isSubmitting ? "Processing..." : "Verify & Save Profile Sync"}
         </button>
       </form>
    </div>
  );
}

const UploadBox = ({ label, field, profile, handleFileUpload, isCircular, error }: any) => (
  <div className={`flex flex-col space-y-2 ${isCircular ? 'items-center text-center' : ''}`}>
    <label className="text-sm font-semibold text-gray-500">{label}</label>
    <div className={`bg-surface border border-dashed flex flex-col items-center justify-center relative overflow-hidden group ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-700'} ${isCircular ? 'w-32 h-32 rounded-full' : 'h-32 w-full rounded-xl'}`}>
      {profile[field] ? (
        <img src={profile[field]} className="w-full h-full object-cover group-hover:scale-105 transition" alt="Uploaded Profile"/>
      ) : (
        <><Upload className={`w-6 h-6 mb-1 ${error ? 'text-red-400' : 'text-gray-400'}`}/> <span className={`text-xs ${error ? 'text-red-500 font-bold' : 'text-gray-500'}`}>{error ? "Image required" : "Upload"}</span></>
      )}
      <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => handleFileUpload(e, field)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"/>
    </div>
  </div>
);
