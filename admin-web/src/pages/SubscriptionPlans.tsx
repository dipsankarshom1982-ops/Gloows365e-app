import { useEffect, useState } from "react";
import { collection, getDocs, doc, addDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../lib/firebase";
import { motion } from "framer-motion";
import DrawerForm from "../components/DrawerForm";
import StatusBadge from "../components/StatusBadge";
import ToggleSwitch from "../components/ToggleSwitch";

interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  features?: string[];
  isActive: boolean;
  isCombo?: boolean;
  discountPercent?: number;
}

const createComboPlanFn = httpsCallable<
  { name: string; description: string; planIds: string[]; price: number; durationDays: number; discountPercent: number },
  { planId: string }
>(functions, "createComboPlan");

const EMPTY = { name: "", description: "", price: 0, durationDays: 30, features: "", isActive: true };
const COMBO_EMPTY = { name: "", description: "", planIds: "", price: 0, durationDays: 30, discountPercent: 0 };
const inputCls = "w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors";
const labelCls = "text-slate-300 text-sm font-semibold block mb-1.5";

export default function SubscriptionPlans() {
  const [plans, setPlans]           = useState<Plan[]>([]);
  const [loading, setLoading]       = useState(true);
  const [planDrawer, setPlanDrawer] = useState(false);
  const [comboDrawer, setComboDrawer] = useState(false);
  const [form, setForm]             = useState(EMPTY);
  const [comboForm, setComboForm]   = useState(COMBO_EMPTY);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState("");

  useEffect(() => {
    getDocs(collection(db, "subscriptionPlans")).then((snap) => {
      setPlans(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Plan)));
      setLoading(false);
    });
  }, []);

  const savePlan = async () => {
    setSaving(true);
    try {
      const data = {
        name: form.name, description: form.description,
        price: form.price, durationDays: form.durationDays,
        features: form.features.split("\n").map((s) => s.trim()).filter(Boolean),
        isActive: form.isActive, isCombo: false,
        updatedAt: serverTimestamp(),
      };
      const ref = await addDoc(collection(db, "subscriptionPlans"), { ...data, createdAt: serverTimestamp() });
      setPlans((prev) => [...prev, { id: ref.id, ...data, features: data.features }]);
      setPlanDrawer(false);
      setForm(EMPTY);
    } finally { setSaving(false); }
  };

  const saveCombo = async () => {
    setSaving(true); setError("");
    try {
      const result = await createComboPlanFn({
        name: comboForm.name, description: comboForm.description,
        planIds: comboForm.planIds.split(",").map((s) => s.trim()).filter(Boolean),
        price: comboForm.price, durationDays: comboForm.durationDays,
        discountPercent: comboForm.discountPercent,
      });
      setPlans((prev) => [...prev, {
        id: result.data.planId, name: comboForm.name, description: comboForm.description,
        price: comboForm.price, durationDays: comboForm.durationDays, isActive: true, isCombo: true,
        discountPercent: comboForm.discountPercent,
      }]);
      setComboDrawer(false);
      setComboForm(COMBO_EMPTY);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const toggle = async (id: string, current: boolean) => {
    await updateDoc(doc(db, "subscriptionPlans", id), { isActive: !current });
    setPlans((prev) => prev.map((p) => p.id === id ? { ...p, isActive: !current } : p));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">💎 Subscription Plans</h1>
          <p className="text-slate-400 text-sm mt-1">{plans.length} plan(s)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setComboDrawer(true)} className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
            🔗 Combo Plan
          </button>
          <button onClick={() => setPlanDrawer(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
            + Add Plan
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <div className="col-span-3 text-center text-slate-400 py-16">Loading…</div> :
          plans.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-bold">{p.name}</p>
                    {p.isCombo && <StatusBadge label="COMBO" variant="warning" />}
                  </div>
                  {p.description && <p className="text-slate-400 text-xs mt-0.5">{p.description}</p>}
                </div>
                <ToggleSwitch value={p.isActive} onChange={() => toggle(p.id, p.isActive)} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">₹{p.price.toLocaleString("en-IN")}</span>
                <span className="text-slate-400 text-sm">/ {p.durationDays}d</span>
                {p.discountPercent ? <span className="text-green-400 text-xs ml-1">{p.discountPercent}% off</span> : null}
              </div>
              {p.features?.length ? (
                <ul className="space-y-1">
                  {p.features.slice(0, 3).map((f) => (
                    <li key={f} className="text-slate-400 text-xs flex items-center gap-1.5"><span className="text-green-400">✓</span>{f}</li>
                  ))}
                  {p.features.length > 3 && <li className="text-slate-500 text-xs">+{p.features.length - 3} more</li>}
                </ul>
              ) : null}
            </motion.div>
          ))
        }
      </div>

      {/* Add Plan Drawer */}
      <DrawerForm open={planDrawer} onClose={() => setPlanDrawer(false)} title="Add Plan"
        footer={
          <>
            <button onClick={savePlan} disabled={saving || !form.name} className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">{saving ? "Saving…" : "Save Plan"}</button>
            <button onClick={() => setPlanDrawer(false)} className="text-slate-400 hover:text-white px-4 text-sm">Cancel</button>
          </>
        }
      >
        <div><label className={labelCls}>Name *</label><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} /></div>
        <div><label className={labelCls}>Description</label><input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={inputCls} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Price (₹)</label><input type="number" min={0} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} className={inputCls} /></div>
          <div><label className={labelCls}>Duration (days)</label><input type="number" min={1} value={form.durationDays} onChange={(e) => setForm((f) => ({ ...f, durationDays: Number(e.target.value) }))} className={inputCls} /></div>
        </div>
        <div><label className={labelCls}>Features <span className="text-slate-500 font-normal">(one per line)</span></label><textarea value={form.features} onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))} className={`${inputCls} resize-none h-24`} /></div>
        <ToggleSwitch value={form.isActive} onChange={(v) => setForm((f) => ({ ...f, isActive: v }))} label="Active" />
      </DrawerForm>

      {/* Combo Plan Drawer */}
      <DrawerForm open={comboDrawer} onClose={() => setComboDrawer(false)} title="Create Combo Plan"
        footer={
          <>
            <button onClick={saveCombo} disabled={saving || !comboForm.name || !comboForm.planIds} className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">{saving ? "Creating…" : "Create Combo"}</button>
            <button onClick={() => setComboDrawer(false)} className="text-slate-400 hover:text-white px-4 text-sm">Cancel</button>
          </>
        }
      >
        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">{error}</p>}
        <div><label className={labelCls}>Combo Name *</label><input value={comboForm.name} onChange={(e) => setComboForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} /></div>
        <div><label className={labelCls}>Description</label><input value={comboForm.description} onChange={(e) => setComboForm((f) => ({ ...f, description: e.target.value }))} className={inputCls} /></div>
        <div><label className={labelCls}>Plan IDs to Bundle <span className="text-slate-500 font-normal">(comma-separated)</span></label><input value={comboForm.planIds} onChange={(e) => setComboForm((f) => ({ ...f, planIds: e.target.value }))} className={inputCls} placeholder="plan_basic, plan_seekho" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Combo Price (₹)</label><input type="number" min={0} value={comboForm.price} onChange={(e) => setComboForm((f) => ({ ...f, price: Number(e.target.value) }))} className={inputCls} /></div>
          <div><label className={labelCls}>Duration (days)</label><input type="number" min={1} value={comboForm.durationDays} onChange={(e) => setComboForm((f) => ({ ...f, durationDays: Number(e.target.value) }))} className={inputCls} /></div>
        </div>
        <div><label className={labelCls}>Discount %</label><input type="number" min={0} max={100} value={comboForm.discountPercent} onChange={(e) => setComboForm((f) => ({ ...f, discountPercent: Number(e.target.value) }))} className={inputCls} /></div>
      </DrawerForm>
    </div>
  );
}
