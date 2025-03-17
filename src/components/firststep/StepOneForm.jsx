import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiDownloadCloud, FiX } from "react-icons/fi";

// Progress Bar Component
const ProgressBar = ({ steps, currentStep }) => {
  const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute w-full h-2 bg-gray-200 top-1/2 transform -translate-y-1/2 rounded-full" />
        <motion.div
          className="absolute h-2 bg-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressWidth}%` }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        {steps.map((_, index) => (
          <div key={index} className="relative z-10">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${
                  index < currentStep - 1
                    ? "bg-blue-600 text-white"
                    : index === currentStep - 1
                    ? "border-4 border-blue-600 bg-white text-blue-600"
                    : "bg-gray-200"
                }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {index + 1}
            </motion.div>
            <span className="absolute top-12 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">
              Step
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const purposeOptions = [
  "Job",
  "Business",
  "Medical",
  "Visit",
  "Hajj",
  "Umrah",
  "Family Joining",
  "Study",
  "House Mate",
  "Others",
];

const professionOptions = [
  "Doctor",
  "Engineer",
  "Accountant",
  "Labour",
  "Technician",
  "Others",
];

// File Upload Component
const FileUpload = ({ label, value, onChange, accept }) => (
  <div className="relative group">
    <label className="block text-sm font-medium text-gray-600 mb-2">
      {label}
    </label>
    <div className="h-40 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-colors relative">
      <input
        type="file"
        onChange={(e) => onChange(e.target.files[0])}
        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
        accept={accept}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        {value ? (
          <div className="relative h-full w-full">
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-1 right-1 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            >
              <FiX className="text-white w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <FiUploadCloud className="w-8 h-8 text-gray-400 mb-2 animate-bounce" />
            <p className="text-sm text-gray-500">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG, PDF up to 5MB
            </p>
          </>
        )}
      </div>
    </div>
  </div>
);

// Document Section Component
const DocumentSection = ({
  title,
  doc,
  docType,
  fields,
  files,
  handleDocumentChange,
}) => (
  <section className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            {field.label} *
          </label>
          <input
            type={field.type}
            value={doc[field.name] || ""}
            onChange={(e) =>
              handleDocumentChange(docType, field.name, e.target.value)
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-200"
            required
          />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {files.map((file) => (
        <FileUpload
          key={file.name}
          label={file.label}
          value={doc[file.name]}
          onChange={(file) =>
            handleDocumentChange(docType, file.name, null, file)
          }
          accept="image/*,application/pdf"
        />
      ))}
    </div>
  </section>
);

// Main Form Component
const StepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 Data
    email: "",
    fullName: "",
    fatherName: "",
    gender: "",
    dob: "",
    age: "",
    profileImage: "",
    presentAddress: "",
    permanentAddress: "",
    district: "",
    city: "",
    country: "",
    purposeType: "",
    purposeDetail: "",
    professionType: "",
    professionDetail: "",

    // Step 2 Data
    emergencyContacts: [{ name: "", relationship: "", phone: "" }],
    healthConditions: [],
    overseasContacts: [{ name: "", country: "", phone: "" }],
    socialMediaHandles: [{ platform: "", username: "" }],

    // Step 3 Data
    bmetNumber: "",
    visaNumber: "",
    nationalId: {
      front: null,
      back: null,
      number: "",
      issueDate: "",
      expiryDate: "",
    },
    passport: {
      document: null,
      number: "",
      issueDate: "",
      expiryDate: "",
    },
    drivingLicense: {
      front: null,
      back: null,
      number: "",
      issueDate: "",
      expiryDate: "",
    },
    visa: {
      document: null,
      country: "",
      issueDate: "",
      expiryDate: "",
    },
    labourCard: {
      front: null,
      back: null,
      workPermit: null,
      profession: "",
      nationality: "",
      issueDate: "",
      expiryDate: "",
    },
  });

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    if (birthDate > today) return "Invalid";

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age > 0 ? age : "Invalid";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const imageURL = URL.createObjectURL(files[0]);
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
        profileImagePreview: imageURL,
      }));
    } else {
      setFormData((prev) => {
        const updatedData = { ...prev, [name]: value };

        if (name === "dob") {
          updatedData.age = calculateAge(value);
        }

        return updatedData;
      });
    }
  };

  const handleDocumentChange = (docType, field, value, file) => {
    setFormData((prev) => {
      if (file && prev[docType][field]) {
        URL.revokeObjectURL(prev[docType][field]);
      }

      return {
        ...prev,
        [docType]: {
          ...prev[docType],
          [field]: file ? URL.createObjectURL(file) : value,
        },
      };
    });
  };

  const addContact = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], {}],
    }));
  };

  const removeContact = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleNestedChange = (field, index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      ),
    }));
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <ProgressBar steps={[1, 2, 3]} currentStep={step} />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                {/* Profile Image Section */}
                <section className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                    Profile Information
                  </h2>
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Profile Image *
                      </label>
                      <input
                        type="file"
                        name="profileImage"
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        accept="image/*"
                        required
                      />
                    </div>
                    {formData.profileImagePreview && (
                      <img
                        src={formData.profileImagePreview}
                        alt="Profile Preview"
                        className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                      />
                    )}
                  </div>
                </section>

                {/* Personal Details Section */}
                <section className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                    Personal Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Father's Name *
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Age
                      </label>
                      <input
                        type="text"
                        name="age"
                        value={formData.age || ""}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100"
                        disabled
                      />
                    </div>
                  </div>
                </section>

                {/* Address Section */}
                <section className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                    Address Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Present Address *
                      </label>
                      <input
                        type="text"
                        name="presentAddress"
                        value={formData.presentAddress}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Permanent Address *
                      </label>
                      <input
                        type="text"
                        name="permanentAddress"
                        value={formData.permanentAddress}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        District *
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200"
                        required
                      />
                    </div>
                  </div>
                </section>

                {/* Purpose & Profession Section */}
                <section className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                    Additional Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Purpose *
                      </label>
                      <select
                        name="purposeType"
                        value={formData.purposeType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200"
                        required
                      >
                        <option value="">Select Purpose</option>
                        {purposeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {formData.purposeType === "Others" && (
                        <input
                          type="text"
                          name="purposeDetail"
                          placeholder="Specify Purpose"
                          value={formData.purposeDetail}
                          onChange={handleChange}
                          className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-200"
                          required
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Profession *
                      </label>
                      <select
                        name="professionType"
                        value={formData.professionType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200"
                        required
                      >
                        <option value="">Select Profession</option>
                        {professionOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {formData.professionType === "Others" && (
                        <input
                          type="text"
                          name="professionDetail"
                          placeholder="Specify Profession"
                          value={formData.professionDetail}
                          onChange={handleChange}
                          className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-200"
                          required
                        />
                      )}
                    </div>
                  </div>
                </section>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                {/* Emergency Contacts */}
                <section className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                    Emergency Contacts
                  </h2>
                  {formData.emergencyContacts.map((contact, index) => (
                    <div
                      key={index}
                      className="space-y-4 border rounded-lg p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={contact.name}
                            onChange={(e) =>
                              handleNestedChange("emergencyContacts", index, e)
                            }
                            className="w-full px-4 py-3 rounded-lg border border-gray-200"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Relationship *
                          </label>
                          <input
                            type="text"
                            name="relationship"
                            value={contact.relationship}
                            onChange={(e) =>
                              handleNestedChange("emergencyContacts", index, e)
                            }
                            className="w-full px-4 py-3 rounded-lg border border-gray-200"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={contact.phone}
                            onChange={(e) =>
                              handleNestedChange("emergencyContacts", index, e)
                            }
                            className="w-full px-4 py-3 rounded-lg border border-gray-200"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        {formData.emergencyContacts.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeContact("emergencyContacts", index)
                            }
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addContact("emergencyContacts")}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Another Contact
                  </button>
                </section>

                {/* Health Conditions */}
                <section className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                    Health Information
                  </h2>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Known Health Conditions
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.healthConditions.map((condition, index) => (
                        <div
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                        >
                          <span>{condition}</span>
                          <button
                            type="button"
                            onClick={() =>
                              removeContact("healthConditions", index)
                            }
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="Add health condition"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const value = e.target.value.trim();
                            if (value) {
                              setFormData((prev) => ({
                                ...prev,
                                healthConditions: [
                                  ...prev.healthConditions,
                                  value,
                                ],
                              }));
                              e.target.value = "";
                            }
                          }
                        }}
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.querySelector(
                            'input[placeholder="Add health condition"]'
                          );
                          const value = input.value.trim();
                          if (value) {
                            setFormData((prev) => ({
                              ...prev,
                              healthConditions: [
                                ...prev.healthConditions,
                                value,
                              ],
                            }));
                            input.value = "";
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </section>

                {/* Overseas Contacts */}
                <section className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                    Overseas Contacts
                  </h2>
                  {formData.overseasContacts.map((contact, index) => (
                    <div
                      key={index}
                      className="space-y-4 border rounded-lg p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={contact.name}
                            onChange={(e) =>
                              handleNestedChange("overseasContacts", index, e)
                            }
                            className="w-full px-4 py-3 rounded-lg border border-gray-200"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Country *
                          </label>
                          <input
                            type="text"
                            name="country"
                            value={contact.country}
                            onChange={(e) =>
                              handleNestedChange("overseasContacts", index, e)
                            }
                            className="w-full px-4 py-3 rounded-lg border border-gray-200"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={contact.phone}
                            onChange={(e) =>
                              handleNestedChange("overseasContacts", index, e)
                            }
                            className="w-full px-4 py-3 rounded-lg border border-gray-200"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        {formData.overseasContacts.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeContact("overseasContacts", index)
                            }
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addContact("overseasContacts")}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Another Contact
                  </button>
                </section>

                {/* Social Media Handles */}
                <section className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                    Social Media Profiles
                  </h2>
                  {formData.socialMediaHandles.map((handle, index) => (
                    <div
                      key={index}
                      className="space-y-4 border rounded-lg p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Platform *
                          </label>
                          <select
                            name="platform"
                            value={handle.platform}
                            onChange={(e) =>
                              handleNestedChange("socialMediaHandles", index, e)
                            }
                            className="w-full px-4 py-3 rounded-lg border border-gray-200"
                            required
                          >
                            <option value="">Select Platform</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Twitter">Twitter</option>
                            <option value="Instagram">Instagram</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Username *
                          </label>
                          <input
                            type="text"
                            name="username"
                            value={handle.username}
                            onChange={(e) =>
                              handleNestedChange("socialMediaHandles", index, e)
                            }
                            className="w-full px-4 py-3 rounded-lg border border-gray-200"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        {formData.socialMediaHandles.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeContact("socialMediaHandles", index)
                            }
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addContact("socialMediaHandles")}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Another Profile
                  </button>
                </section>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                {/* BMET & Visa Section */}
                <section className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                    Official Documents
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        BMET Number *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.bmetNumber}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              bmetNumber: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 rounded-lg border border-gray-200"
                          placeholder="Enter BMET Number"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => {
                            // Simulate API call to fetch BMET document
                            setFormData((prev) => ({
                              ...prev,
                              bmetNumber: "BMET-123456",
                              nationalId: {
                                ...prev.nationalId,
                                number: "123456789",
                              },
                            }));
                          }}
                          className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 flex items-center"
                        >
                          <FiDownloadCloud className="mr-2" />
                          Fetch
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Visa Number *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.visaNumber}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              visaNumber: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 rounded-lg border border-gray-200"
                          placeholder="Enter Visa Number"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => {
                            // Simulate API call to fetch Visa document
                            setFormData((prev) => ({
                              ...prev,
                              visaNumber: "VISA-789012",
                              visa: {
                                ...prev.visa,
                                country: "United States",
                              },
                            }));
                          }}
                          className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 flex items-center"
                        >
                          <FiDownloadCloud className="mr-2" />
                          Fetch
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* National ID Section */}
                <DocumentSection
                  title="National ID Document"
                  doc={formData.nationalId}
                  docType="nationalId"
                  fields={[
                    { name: "number", label: "ID Number", type: "text" },
                    { name: "issueDate", label: "Issue Date", type: "date" },
                    { name: "expiryDate", label: "Expiry Date", type: "date" },
                  ]}
                  files={[
                    { name: "front", label: "Front Side" },
                    { name: "back", label: "Back Side" },
                  ]}
                  handleChange={handleDocumentChange}
                />

                {/* Passport Section */}
                <DocumentSection
                  title="Passport Document"
                  doc={formData.passport}
                  docType="passport"
                  fields={[
                    { name: "number", label: "Passport Number", type: "text" },
                    { name: "issueDate", label: "Issue Date", type: "date" },
                    { name: "expiryDate", label: "Expiry Date", type: "date" },
                  ]}
                  files={[{ name: "document", label: "Passport Scan" }]}
                  handleChange={handleDocumentChange}
                />

                {/* Visa Section */}
                <DocumentSection
                  title="Visa Document"
                  doc={formData.visa}
                  docType="visa"
                  fields={[
                    { name: "country", label: "Country", type: "text" },
                    { name: "issueDate", label: "Issue Date", type: "date" },
                    { name: "expiryDate", label: "Expiry Date", type: "date" },
                  ]}
                  files={[{ name: "document", label: "Visa Document" }]}
                  handleChange={handleDocumentChange}
                />

                {/* Labour Card Section */}
                <DocumentSection
                  title="Labour Card"
                  doc={formData.labourCard}
                  docType="labourCard"
                  fields={[
                    { name: "profession", label: "Profession", type: "text" },
                    { name: "nationality", label: "Nationality", type: "text" },
                    { name: "issueDate", label: "Issue Date", type: "date" },
                    { name: "expiryDate", label: "Expiry Date", type: "date" },
                  ]}
                  files={[
                    { name: "front", label: "Front Side" },
                    { name: "back", label: "Back Side" },
                    { name: "workPermit", label: "Work Permit" },
                  ]}
                  handleChange={handleDocumentChange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div
            className="flex justify-between items-center pt-8 border-t border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div>
              {step > 1 && (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Previous
                </motion.button>
              )}
            </div>
            <div className="flex items-center gap-4">
              {step < 3 && (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm"
                >
                  Next Step →
                </motion.button>
              )}
              {step === 3 && (
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm"
                >
                  Submit Application
                </motion.button>
              )}
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default StepForm;
