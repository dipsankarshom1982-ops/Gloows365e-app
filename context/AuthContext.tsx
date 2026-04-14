import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  roles: string[];
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  roles: [],
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          setUser(null);
          setRoles([]);
          setLoading(false);
          return;
        }

        setUser(user);

        // 🔥 BEST PRACTICE → UID based fetch
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setRoles([]);
          setLoading(false);
          return;
        }

        const data = snap.data();
        setRoles(data.roles || []);
        setLoading(false);

      } catch (error) {
        console.log("Auth Error:", error);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, roles }}>
      {children}
    </AuthContext.Provider>
  );
}