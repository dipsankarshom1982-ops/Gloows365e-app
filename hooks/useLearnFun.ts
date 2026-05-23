// hooks/useLearnFun.ts

import { auth, db } from "@/lib/firebase";
import { BADGES, GAMES, getLevelFromXP, SKILL_WORLDS } from "@/lib/learnfun/constants";
import { getMissionForClass } from "@/lib/learnfun/missionData";
import { Badge, DailyMission, LearnFunGame, SkillWorld, StudentLearnFunProfile } from "@/lib/learnfun/types";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  increment,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

interface UseLearnFunReturn {
  profile: StudentLearnFunProfile | null;
  todaysMission: DailyMission | null;
  visibleGames: LearnFunGame[];
  skillWorlds: SkillWorld[];
  allBadges: Badge[];
  completeMission: (missionId: string, score: number, badgeEarned?: string) => Promise<void>;
  missionPlayedToday: boolean;
  loading: boolean;
  error: string | null;
}

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function useLearnFun(): UseLearnFunReturn {
  const [profile, setProfile]                   = useState<StudentLearnFunProfile | null>(null);
  const [todaysMission, setTodaysMission]       = useState<DailyMission | null>(null);
  const [visibleGames, setVisibleGames]         = useState<LearnFunGame[]>([]);
  const [skillWorlds]                            = useState<SkillWorld[]>(SKILL_WORLDS);
  const [allBadges]                              = useState<Badge[]>(BADGES);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState<string | null>(null);
  const [missionPlayedToday, setMissionPlayedToday] = useState(false);

  const todayStr = getTodayStr();

  // ── Load games: Firestore first, always fall back to local constants ─────────
  const loadGamesForClass = useCallback(async (studentClass: number) => {
    const local = GAMES.filter(
      (g) => g.classRange.includes(studentClass) && g.isActive && !g.isComingSoon
    );
    try {
      const snapshot = await getDocs(collection(db, "LearnFunGames"));
      if (!snapshot.empty) {
        const fromFs = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() } as LearnFunGame))
          .filter(
            (g) =>
              Array.isArray(g.classRange) &&
              g.classRange.includes(studentClass) &&
              g.isActive &&
              !g.isComingSoon &&
              Array.isArray(g.gradientColors)
          );
        setVisibleGames(fromFs.length > 0 ? fromFs : local);
      } else {
        setVisibleGames(local);
      }
    } catch {
      setVisibleGames(local);
    }
  }, []);

  // ── Load today's mission ───────────────────────────────────────────────────
  const loadTodaysMission = useCallback(async (studentClass: number) => {
    try {
      const q = query(
        collection(db, "dailyFunLearnMissions"),
        where("class", "==", studentClass),
        where("date", "==", todayStr)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const d = snapshot.docs[0];
        setTodaysMission({ id: d.id, ...d.data() } as DailyMission);
      } else {
        setTodaysMission(getMissionForClass(studentClass));
      }
    } catch {
      setTodaysMission(getMissionForClass(studentClass));
    }
  }, [todayStr]);

  // ── Auth-aware real-time profile listener ─────────────────────────────────
  useEffect(() => {
    let unsubSnap: (() => void) | null = null;

    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (unsubSnap) { unsubSnap(); unsubSnap = null; }
      if (!user) { setLoading(false); return; }

      const studentRef = doc(db, "students", user.uid);
      unsubSnap = onSnapshot(
        studentRef,
        (snapshot) => {
          if (!snapshot.exists()) { setLoading(false); return; }

          const data = snapshot.data();
          const xp: number = data.LearnFunXP ?? 0;
          const studentClass = Number(data.class ?? 8);

          setProfile({
            name:                data.name ?? "Student",
            class:               studentClass,
            level:               getLevelFromXP(xp),
            xp,
            coins:               data.LearnFunCoins ?? 0,
            streak:              data.LearnFunStreak ?? 0,
            badges:              data.LearnFunBadges ?? [],
            completedMissionIds: data.LearnFunCompletedMissions ?? [],
            weakSkill:           data.LearnFunWeakSkill ?? undefined,
          });

          setMissionPlayedToday(data.LearnFunLastMissionDate === todayStr);
          loadGamesForClass(studentClass);
          loadTodaysMission(studentClass);
          setLoading(false);
        },
        (err) => {
          console.error("[useLearnFun] snapshot error:", err);
          setError("Failed to load profile");
          setLoading(false);
        }
      );
    });

    return () => { unsubAuth(); if (unsubSnap) unsubSnap(); };
  }, [todayStr, loadGamesForClass, loadTodaysMission]);

  // ── Complete Mission ───────────────────────────────────────────────────────
  const completeMission = useCallback(
    async (missionId: string, score: number, badgeEarned?: string) => {
      const user = auth.currentUser;
      if (!user || !todaysMission) return;

      const earnedXP    = Math.round((todaysMission.reward.xp    * score) / 100);
      const earnedCoins = Math.round((todaysMission.reward.coins * score) / 100);
      const learnDelta  = earnedXP + earnedCoins;

      try {
        // 1. Update student stats
        const studentUpdate: Record<string, unknown> = {
          LearnFunXP:               increment(earnedXP),
          LearnFunCoins:            increment(earnedCoins),
          LearnFunStreak:           increment(1),
          LearnFunLastMissionDate:  todayStr,
          learnScore:               increment(learnDelta),
          LearnFunCompletedMissions: arrayUnion(missionId),
        };
        if (badgeEarned) studentUpdate.LearnFunBadges = arrayUnion(badgeEarned);
        await updateDoc(doc(db, "students", user.uid), studentUpdate);

        // 2. Update leaderboard entry (for rank queries)
        await setDoc(
          doc(db, "leaderboard", user.uid),
          { learnScore: increment(learnDelta), updatedAt: Timestamp.now() },
          { merge: true }
        );

        // 3. Save individual mission progress
        await setDoc(
          doc(db, "studentLearnFunProgress", user.uid, "missions", missionId),
          {
            missionId,
            missionTitle:  todaysMission.missionTitle,
            skill:         todaysMission.skill,
            gameType:      todaysMission.gameType,
            score,
            xpEarned:      earnedXP,
            coinsEarned:   earnedCoins,
            badgeEarned:   badgeEarned ?? null,
            completedAt:   Timestamp.now(),
            studentClass:  profile?.class ?? 0,
          }
        );
      } catch (err) {
        console.error("[useLearnFun] completeMission error:", err);
      }
    },
    [todaysMission, profile, todayStr]
  );

  return {
    profile,
    todaysMission,
    visibleGames,
    skillWorlds,
    allBadges,
    completeMission,
    missionPlayedToday,
    loading,
    error,
  };
}
