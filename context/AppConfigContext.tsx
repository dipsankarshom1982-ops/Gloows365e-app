import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "@/lib/firebase";
import {
  collection, onSnapshot, orderBy, query, where,
} from "firebase/firestore";
import type { AppModule, SubscriptionPlan } from "@/services/appConfigService";

const CACHE_KEY_MODULES = "appConfig_modules";
const CACHE_KEY_PLANS   = "appConfig_plans";

type AppConfigContextType = {
  modules: AppModule[];
  plans: SubscriptionPlan[];
  configLoading: boolean;
};

const AppConfigContext = createContext<AppConfigContextType>({
  modules: [],
  plans: [],
  configLoading: true,
});

export const useAppConfig = () => useContext(AppConfigContext);

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules]         = useState<AppModule[]>([]);
  const [plans, setPlans]             = useState<SubscriptionPlan[]>([]);
  const [modulesReady, setModulesReady] = useState(false);
  const [plansReady, setPlansReady]     = useState(false);

  const configLoading = !modulesReady || !plansReady;

  useEffect(() => {
    // ── Seed UI instantly from cache ──────────────────────────────────────────
    Promise.all([
      AsyncStorage.getItem(CACHE_KEY_MODULES),
      AsyncStorage.getItem(CACHE_KEY_PLANS),
    ]).then(([cachedMods, cachedPlans]) => {
      if (cachedMods)   setModules(JSON.parse(cachedMods));
      if (cachedPlans)  setPlans(JSON.parse(cachedPlans));
    });

    // ── Real-time listener: appModules ────────────────────────────────────────
    const unsubModules = onSnapshot(
      query(
        collection(db, "appModules"),
        where("isEnabled", "==", true),
        orderBy("order", "asc")
      ),
      (snap) => {
        const fresh = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AppModule));
        setModules(fresh);
        setModulesReady(true);
        AsyncStorage.setItem(CACHE_KEY_MODULES, JSON.stringify(fresh));
      },
      () => {
        // Firestore unavailable — mark ready so UI doesn't hang
        setModulesReady(true);
      }
    );

    // ── Real-time listener: subscriptionPlans ─────────────────────────────────
    const unsubPlans = onSnapshot(
      query(
        collection(db, "subscriptionPlans"),
        where("isActive", "==", true),
        orderBy("order", "asc")
      ),
      (snap) => {
        const fresh = snap.docs.map((d) => ({ id: d.id, ...d.data() } as SubscriptionPlan));
        setPlans(fresh);
        setPlansReady(true);
        AsyncStorage.setItem(CACHE_KEY_PLANS, JSON.stringify(fresh));
      },
      () => {
        setPlansReady(true);
      }
    );

    return () => {
      unsubModules();
      unsubPlans();
    };
  }, []);

  return (
    <AppConfigContext.Provider value={{ modules, plans, configLoading }}>
      {children}
    </AppConfigContext.Provider>
  );
}
