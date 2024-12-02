import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebase"; // Importez vos configurations Firebase
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Profile = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const [profilePhoto, setProfilePhoto] = useState<string>("");

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          if (userDoc.data().profilePhoto) {
            setProfilePhoto(userDoc.data().profilePhoto);
          }
        } else {
          console.log("No such document!");
        }
      };
      fetchData();
    }
  }, 
 [user]);

  // Fonction pour télécharger une photo de profil
  const uploadProfilePhoto = async (file: File) => {
    const storageRef = ref(storage, 'profilePhotos/${user?.uid}');
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    setProfilePhoto(downloadURL);

    // Mettre à jour la photo dans Firestore
    const userRef = doc(db, "users", user?.uid);
    await updateDoc(userRef, { profilePhoto: downloadURL });
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {user ? (
        <div>
          {/* Section photo de profil */}
          <div className="flex items-center">
            <div className="relative">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-white text-2xl">
                  <span>+</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    uploadProfilePhoto(e.target.files[0]);
                  }
                }}
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 cursor-pointer"
              />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-800">{userData?.pseudo}</h2>
              <p className="text-gray-500">{userData?.email}</p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700">Statistics</h3>
            <p className="mt-2 text-gray-600">Total Views: {userData?.totalViews || 0}</p>
            <p className="mt-1 text-gray-600">Total Downloads: {userData?.totalDownloads || 0}</p>
          </div>

          {/* Déconnexion */}
          <div className="mt-6">
            <button
              onClick={() => auth.signOut()}
              className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Loading your profile...</p>
      )}
    </div>
  );
};

export default Profile;