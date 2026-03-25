import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          // Sync with backend
          const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
          const res = await fetch(`${apiUrl}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (data.success) {
            setUser({ ...data.data, token });
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error("Backend sync error:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // We can optionally update the profile here or let the backend handle it on first sync
      // But passing the name to backend is easier if we do it via a specific sync endpoint or just rely on the first 'me' call if we store it in firebase profile
      // Let's try to update firebase profile first
      // Note: We need to import updateProfile from firebase/auth if we want to do it here, but let's keep it simple for now.
      // Actually, for the name to be saved in our DB, we might need a specific registration sync or just handle it in the backend when it sees a new user.
      // However, the 'me' route might not know the name if it's just from the token email.
      // Let's send a separate sync request for registration if needed, or just attach name to the first 'me' call?
      // Better approach: After firebase register, call a backend 'register' or 'sync' endpoint with the name.
      
      const token = await userCredential.user.getIdToken();
      
      // Call backend to ensure user is created with name
      const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
      await fetch(`${apiUrl}/api/auth/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, googleSignIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
