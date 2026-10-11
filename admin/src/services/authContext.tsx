import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  IdTokenResult
} from 'firebase/auth';
import { auth } from '../firebase/config.ts';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  adminClaimMissing: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAdminClaim: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
  adminClaimMissing: false,
  signIn: async () => {},
  signOut: async () => {},
  refreshAdminClaim: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminClaimMissing, setAdminClaimMissing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const verifyAdminStatus = async (currentUser: User) => {
    try {
      // Force refresh of the token from Firebase Auth servers to check custom claims
      const tokenResult: IdTokenResult = await currentUser.getIdTokenResult(true);
      const hasAdminClaim = Boolean(tokenResult.claims && tokenResult.claims.admin === true);
      
      setIsAdmin(hasAdminClaim);
      setAdminClaimMissing(!hasAdminClaim);
    } catch (err) {
      console.error('Error fetching user claims:', err);
      setIsAdmin(false);
      setAdminClaimMissing(true);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await verifyAdminStatus(currentUser);
      } else {
        setIsAdmin(false);
        setAdminClaimMissing(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshAdminClaim = async () => {
    if (user) {
      setIsLoading(true);
      await verifyAdminStatus(user);
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      await verifyAdminStatus(cred.user);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setIsAdmin(false);
    setAdminClaimMissing(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        adminClaimMissing,
        signIn,
        signOut,
        refreshAdminClaim
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
