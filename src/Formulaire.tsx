import React, { useState } from "react";
import { auth, db } from './firebaseConfig';
import { sendPasswordResetEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormulaireProps {
  isRegistered: boolean;
  onClose: () => void;
}

const Formulaire: React.FC<FormulaireProps> = ({ isRegistered, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    pseudo: "",
    password: "",
    confirmPassword: "",
  });
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!isResettingPassword) {
      if (!formData.password || formData.password.length < 4) {
        newErrors.password = "Password must be at least 4 characters long.";
      }
      if (!isRegistered && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (isResettingPassword) {
        await sendPasswordResetEmail(auth, formData.email);
        toast.success("Password reset email sent!");
      } else if (isRegistered) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast.success("Signed in successfully!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // Check if user already exists in Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          toast.error("User already exists!");
          return;
        }

        // Enregistrer l'utilisateur dans Firestore
        await setDoc(userRef, {
          pseudo: formData.pseudo,
          email: formData.email,
          createdAt: new Date(),
        });
        toast.success("Account created successfully!");
      }
      onClose();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg relative">
        {/* Flèche de retour */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-purple-700 hover:text-purple-900 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-center text-purple-700">
          {isResettingPassword ? "Reset Password" : isRegistered ? "Sign In" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
              className="w-full p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {!isResettingPassword && (
            <>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Your password"
                    className="w-full p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-2 text-purple-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              {!isRegistered && (
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isSubmitting}
          >
            {isResettingPassword
              ? "Send Password Reset Email"
              : isRegistered
              ? "Sign In"
              : "Sign Up"}
          </button>

          <div className="mt-4 text-center">
            {isResettingPassword ? (
              <p
                onClick={() => setIsResettingPassword(false)}
                className="text-sm text-purple-600 cursor-pointer"
              >
                Remembered your password? Sign In
              </p>
            ) : isRegistered ? (
              <p
                onClick={() => setIsResettingPassword(true)}
                className="text-sm text-purple-600 cursor-pointer"
              >
                Forgot Password?
              </p>
            ) : (
              <p
                onClick={() => onClose()}
                className="text-sm text-purple-600 cursor-pointer"
              >
                Already have an account? Sign In
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Formulaire;
