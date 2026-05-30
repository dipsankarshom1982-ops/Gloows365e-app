import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../lib/firebase";
import ApprovalQueue, { ApprovalItem } from "../components/ApprovalQueue";

type Filter = "pending" | "approved" | "rejected" | "all";

const approveContentFn = httpsCallable<
  { collection: string; docId: string; action: "approve" | "reject"; reason?: string },
  { success: boolean }
>(functions, "approveContent");

export default function SkillBattles() {
  const [items, setItems]     = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<Filter>("pending");

  useEffect(() => {
    getDocs(collection(db, "skillBattles")).then((snap) => {
      const all = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title ?? data.battleTitle ?? "Untitled Battle",
          thumbnailUrl: data.thumbnailUrl ?? data.videoThumbnail ?? "",
          uploaderName: data.creatorName ?? data.createdBy ?? "Unknown",
          createdAt: data.createdAt,
          approvalStatus: data.approvalStatus ?? "pending",
          category: data.subject ?? data.category,
          subtitle: data.subject ? `${data.subject} • ${data.class ?? ""}` : "",
        } as ApprovalItem;
      });
      setItems(all);
      setLoading(false);
    });
  }, []);

  const handleApprove = async (id: string) => {
    await approveContentFn({ collection: "skillBattles", docId: id, action: "approve" });
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, approvalStatus: "approved" } : i));
  };

  const handleReject = async (id: string, reason: string) => {
    await approveContentFn({ collection: "skillBattles", docId: id, action: "reject", reason });
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, approvalStatus: "rejected" } : i));
  };

  const pendingCount = items.filter((i) => i.approvalStatus === "pending").length;
  const filtered = filter === "all" ? items : items.filter((i) => i.approvalStatus === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">⚔️ Skill Battles</h1>
        <p className="text-slate-400 text-sm mt-1">Moderate skill battle reels before they go live</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["pending", "approved", "rejected", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors capitalize ${
              filter === f ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {f}{f === "pending" && pendingCount > 0 && (
              <span className="ml-1.5 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      <ApprovalQueue
        items={filtered}
        onApprove={handleApprove}
        onReject={handleReject}
        loading={loading}
        emptyMessage={`No ${filter === "all" ? "" : filter} skill battles.`}
      />
    </div>
  );
}
