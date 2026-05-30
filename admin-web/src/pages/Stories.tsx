import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../lib/firebase";
import ApprovalQueue, { ApprovalItem } from "../components/ApprovalQueue";

type Filter = "pending" | "approved" | "rejected" | "all";

const approveContentFn = httpsCallable<
  { collection: string; docId: string; action: "approve" | "reject"; reason?: string },
  { success: boolean }
>(functions, "approveContent");

export default function Stories() {
  const [items, setItems]   = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<Filter>("pending");

  const load = async (f: Filter) => {
    setLoading(true);
    let q = f === "all"
      ? query(collection(db, "stories"), orderBy("createdAt", "desc"))
      : query(collection(db, "stories"), where("status", "==", f === "pending" ? undefined : f), orderBy("createdAt", "desc"));

    // Use simple getDocs for all statuses
    const snap = await getDocs(collection(db, "stories"));
    const all = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title ?? data.caption ?? "Untitled Story",
        thumbnailUrl: data.thumbnailUrl ?? data.imageUrl ?? "",
        uploaderName: data.userName ?? data.userId ?? "Unknown",
        createdAt: data.createdAt,
        approvalStatus: data.status === "approved" ? "approved" : data.status === "rejected" ? "rejected" : "pending",
        category: data.category,
        subtitle: data.subject ?? "",
      } as ApprovalItem;
    });

    const filtered = f === "all" ? all : all.filter((i) => i.approvalStatus === f);
    setItems(filtered);
    setLoading(false);
  };

  useEffect(() => { load(filter); }, [filter]);

  const handleApprove = async (id: string) => {
    await approveContentFn({ collection: "stories", docId: id, action: "approve" });
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, approvalStatus: "approved" } : i));
  };

  const handleReject = async (id: string, reason: string) => {
    await approveContentFn({ collection: "stories", docId: id, action: "reject", reason });
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, approvalStatus: "rejected" } : i));
  };

  const counts = { pending: items.filter(i => i.approvalStatus === "pending").length };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">📖 Stories</h1>
        <p className="text-slate-400 text-sm mt-1">Review and approve user-submitted stories</p>
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
            {f} {f === "pending" && counts.pending > 0 && (
              <span className="ml-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{counts.pending}</span>
            )}
          </button>
        ))}
      </div>

      <ApprovalQueue
        items={filter === "all" ? items : items.filter((i) => i.approvalStatus === filter)}
        onApprove={handleApprove}
        onReject={handleReject}
        loading={loading}
        emptyMessage={`No ${filter === "all" ? "" : filter} stories.`}
      />
    </div>
  );
}
