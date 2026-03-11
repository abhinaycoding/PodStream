import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  const login = async () => {
    await signInWithRedirect(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    let resolved = false;

    // First, check for the redirect result (user returning from Google)
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch(() => {})
      .finally(() => {
        resolved = true;
      });

    // Then, listen for any auth state changes
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Only stop loading once both the redirect check and auth state are done
      if (resolved) {
        setAuthLoading(false);
      } else {
        // Small delay to let getRedirectResult finish first
        setTimeout(() => setAuthLoading(false), 500);
      }
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
