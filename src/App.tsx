import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// ─── CONFIG ──────────────────────────────────────────────────────────────────
// Replace these with your actual Supabase project values
const SUPABASE_URL = 'https://zxfqcshkzphhbaridydl.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZnFjc2hrenBoaGJhcmlkeWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNzU2NjIsImV4cCI6MjA5MTc1MTY2Mn0.GK4baxdxInuAhc_v6fD7SniCwCwNFlvHQ7Mefu2rnco';

// Simple password gate — change this to whatever you like
const APP_PASSWORD = 'Test';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(
    n ?? 0
  );

const LOW_STOCK_THRESHOLD = 5;

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d={d} />
  </svg>
);

const ICONS = {
  lock: 'M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z',
  eyeOff:
    'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22',
  plus: 'M12 5v14M5 12h14',
  package:
    'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12',
  alert:
    'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
  tag: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01',
  trending: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
  trash:
    'M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2',
  edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  search: 'M11 17a6 6 0 100-12 6 6 0 000 12zM21 21l-4.35-4.35',
  x: 'M18 6L6 18M6 6l12 12',
  check: 'M20 6L9 17l-5-5',
  logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
};

// ─── LOCK SCREEN ─────────────────────────────────────────────────────────────
function LockScreen({ onUnlock }) {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const attempt = () => {
    if (pw === APP_PASSWORD) {
      onUnlock();
    } else {
      setError('Incorrect password');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPw('');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-sm ${shake ? 'animate-shake' : ''}`}
        style={{ animation: shake ? 'shake 0.4s ease' : undefined }}
      >
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
            <Icon d={ICONS.package} size={28} className="text-stone-950" />
          </div>
          <h1
            className="text-3xl font-bold text-stone-100 tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Stockroom
          </h1>
          <p className="text-stone-500 text-sm mt-1">Inventory Dashboard</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl">
          <p className="text-stone-400 text-sm mb-4 text-center">
            Enter your password to continue
          </p>

          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={pw}
              onChange={(e) => {
                setPw(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && attempt()}
              placeholder="Password"
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors pr-12"
            />
            <button
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
            >
              <Icon d={show ? ICONS.eyeOff : ICONS.eye} size={18} />
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-xs mt-2 text-center">{error}</p>
          )}

          <button
            onClick={attempt}
            className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl py-3 transition-colors"
          >
            Unlock
          </button>
        </div>

        <p className="text-center text-stone-700 text-xs mt-6">
          Change the password in <code className="text-stone-600">App.jsx</code>
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
      `}</style>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent = false, warning = false }) {
  return (
    <div
      className={`rounded-2xl p-5 border ${
        warning
          ? 'bg-red-950/40 border-red-800/50'
          : accent
          ? 'bg-amber-500/10 border-amber-500/30'
          : 'bg-stone-900 border-stone-800'
      }`}
    >
      <p className="text-stone-400 text-xs font-medium uppercase tracking-widest mb-1">
        {label}
      </p>
      <p
        className={`text-2xl font-bold ${
          warning
            ? 'text-red-400'
            : accent
            ? 'text-amber-400'
            : 'text-stone-100'
        }`}
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {value}
      </p>
      {sub && <p className="text-stone-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

// ─── ADD / EDIT MODAL ─────────────────────────────────────────────────────────
const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food & Drink',
  'Home & Garden',
  'Tools',
  'Beauty',
  'Toys',
  'Books',
  'Sports',
  'Other',
];

const EMPTY_FORM = {
  name: '',
  category: 'Other',
  sku: '',
  quantity: '',
  cost_price: '',
  selling_price: '',
  low_stock_alert: LOW_STOCK_THRESHOLD,
};

function ItemModal({ item, onClose, onSave }) {
  const [form, setForm] = useState(item ? { ...item } : { ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (form.quantity === '' || isNaN(form.quantity))
      e.quantity = 'Must be a number';
    if (form.cost_price === '' || isNaN(form.cost_price))
      e.cost_price = 'Must be a number';
    if (form.selling_price === '' || isNaN(form.selling_price))
      e.selling_price = 'Must be a number';
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setSaving(true);
    await onSave({
      ...form,
      quantity: Number(form.quantity),
      cost_price: Number(form.cost_price),
      selling_price: Number(form.selling_price),
      low_stock_alert: Number(form.low_stock_alert) || LOW_STOCK_THRESHOLD,
    });
    setSaving(false);
  };

  const Field = ({ label, field, type = 'text', placeholder = '' }) => (
    <div>
      <label className="block text-stone-400 text-xs font-medium mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        value={form[field]}
        onChange={(e) => set(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-stone-800 border rounded-xl px-3 py-2.5 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors text-sm ${
          errors[field] ? 'border-red-500' : 'border-stone-700'
        }`}
      />
      {errors[field] && (
        <p className="text-red-400 text-xs mt-1">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-lg bg-stone-900 border border-stone-700 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-stone-700" />
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl font-bold text-stone-100"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {item ? 'Edit Item' : 'Add New Item'}
            </h2>
            <button
              onClick={onClose}
              className="text-stone-500 hover:text-stone-300"
            >
              <Icon d={ICONS.x} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field
                label="Item Name *"
                field="name"
                placeholder="e.g. Blue Denim Jacket"
              />
            </div>

            <div>
              <label className="block text-stone-400 text-xs font-medium mb-1.5 uppercase tracking-wide">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500 transition-colors text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <Field label="SKU / Code" field="sku" placeholder="e.g. BJK-001" />

            <Field
              label="Quantity *"
              field="quantity"
              type="number"
              placeholder="0"
            />
            <Field
              label="Low Stock Alert"
              field="low_stock_alert"
              type="number"
              placeholder={String(LOW_STOCK_THRESHOLD)}
            />

            <Field
              label="Cost Price (£) *"
              field="cost_price"
              type="number"
              placeholder="0.00"
            />
            <Field
              label="Selling Price (£) *"
              field="selling_price"
              type="number"
              placeholder="0.00"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl py-3 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={saving}
              className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 rounded-xl py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-stone-950/40 border-t-stone-950 rounded-full animate-spin" />
              ) : (
                <Icon d={ICONS.check} size={16} />
              )}
              {saving ? 'Saving…' : item ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RECORD SALE MODAL ────────────────────────────────────────────────────────
function SaleModal({ item, onClose, onRecord }) {
  const [qty, setQty] = useState(1);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (qty < 1 || qty > item.quantity) return;
    setSaving(true);
    await onRecord(item, qty);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-sm bg-stone-900 border border-stone-700 rounded-t-3xl sm:rounded-2xl shadow-2xl p-6">
        <div className="flex justify-center pt-1 pb-4 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-stone-700" />
        </div>
        <h2
          className="text-xl font-bold text-stone-100 mb-1"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Record Sale
        </h2>
        <p className="text-stone-400 text-sm mb-5">{item.name}</p>

        <label className="block text-stone-400 text-xs font-medium mb-1.5 uppercase tracking-wide">
          Quantity Sold
        </label>
        <input
          type="number"
          min={1}
          max={item.quantity}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500 text-sm mb-1"
        />
        <p className="text-stone-500 text-xs mb-5">
          {item.quantity} in stock · Revenue: {fmt(qty * item.selling_price)}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl py-3 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving || qty < 1 || qty > item.quantity}
            className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 rounded-xl py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-stone-950/40 border-t-stone-950 rounded-full animate-spin" />
            ) : (
              <Icon d={ICONS.trending} size={16} />
            )}
            {saving ? 'Saving…' : 'Record Sale'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
function Dashboard({ onLock }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [modal, setModal] = useState(null); // null | {type:'add'|'edit'|'sale', item?}
  const [toast, setToast] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const saveItem = async (form) => {
    if (form.id) {
      const { error } = await supabase
        .from('inventory')
        .update(form)
        .eq('id', form.id);
      if (error) {
        showToast('Failed to update: ' + error.message, false);
        return;
      }
      showToast('Item updated');
    } else {
      const { error } = await supabase.from('inventory').insert(form);
      if (error) {
        showToast('Failed to add: ' + error.message, false);
        return;
      }
      showToast('Item added');
    }
    setModal(null);
    fetchItems();
  };

  const deleteItem = async (id) => {
    const { error } = await supabase.from('inventory').delete().eq('id', id);
    if (error) {
      showToast('Failed to delete: ' + error.message, false);
      return;
    }
    showToast('Item deleted');
    setDeleteId(null);
    fetchItems();
  };

  const recordSale = async (item, qty) => {
    const newQty = item.quantity - qty;
    // Update stock
    const { error: e1 } = await supabase
      .from('inventory')
      .update({ quantity: newQty })
      .eq('id', item.id);
    // Log to sales table (optional — create if you want full history)
    await supabase.from('sales').insert({
      item_id: item.id,
      item_name: item.name,
      quantity_sold: qty,
      revenue: qty * item.selling_price,
    });
    if (e1) {
      showToast('Failed to record sale', false);
      return;
    }
    showToast(`Sale recorded — ${qty} × ${item.name}`);
    setModal(null);
    fetchItems();
  };

  // Derived stats
  const totalItems = items.length;
  const totalStockValue = items.reduce(
    (s, i) => s + (i.quantity || 0) * (i.cost_price || 0),
    0
  );
  const totalRetailValue = items.reduce(
    (s, i) => s + (i.quantity || 0) * (i.selling_price || 0),
    0
  );
  const lowStockItems = items.filter(
    (i) => (i.quantity || 0) <= (i.low_stock_alert ?? LOW_STOCK_THRESHOLD)
  );

  const categories = [
    'All',
    ...new Set(items.map((i) => i.category).filter(Boolean)),
  ];

  const filtered = items.filter((i) => {
    const matchSearch =
      !search ||
      i.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.sku?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || i.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div
      className="min-h-screen bg-stone-950 text-stone-100"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium transition-all ${
            toast.ok
              ? 'bg-emerald-900 border border-emerald-700 text-emerald-300'
              : 'bg-red-900 border border-red-700 text-red-300'
          }`}
        >
          <Icon d={toast.ok ? ICONS.check : ICONS.x} size={16} />
          {toast.msg}
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative bg-stone-900 border border-stone-700 rounded-2xl p-6 w-full max-w-xs shadow-2xl">
            <h3 className="text-lg font-bold text-stone-100 mb-2">
              Delete item?
            </h3>
            <p className="text-stone-400 text-sm mb-5">This can't be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl py-2.5 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteItem(deleteId)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {modal?.type === 'add' && (
        <ItemModal onClose={() => setModal(null)} onSave={saveItem} />
      )}
      {modal?.type === 'edit' && (
        <ItemModal
          item={modal.item}
          onClose={() => setModal(null)}
          onSave={saveItem}
        />
      )}
      {modal?.type === 'sale' && (
        <SaleModal
          item={modal.item}
          onClose={() => setModal(null)}
          onRecord={recordSale}
        />
      )}

      {/* Header */}
      <header className="border-b border-stone-800 sticky top-0 z-30 bg-stone-950/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Icon d={ICONS.package} size={16} className="text-stone-950" />
            </div>
            <span
              className="text-lg font-bold tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Stockroom
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setModal({ type: 'add' })}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl px-4 py-2 text-sm transition-colors"
            >
              <Icon d={ICONS.plus} size={16} />
              <span className="hidden sm:inline">Add Item</span>
            </button>
            <button
              onClick={onLock}
              className="text-stone-500 hover:text-stone-300 transition-colors p-2"
              title="Lock"
            >
              <Icon d={ICONS.logout} size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total SKUs" value={totalItems} />
          <StatCard
            label="Stock Value"
            value={fmt(totalStockValue)}
            sub="at cost"
            accent
          />
          <StatCard
            label="Retail Value"
            value={fmt(totalRetailValue)}
            sub="at selling price"
          />
          <StatCard
            label="Low Stock"
            value={lowStockItems.length}
            sub={lowStockItems.length ? 'items need reorder' : 'all good'}
            warning={lowStockItems.length > 0}
          />
        </div>

        {/* Low stock alert strip */}
        {lowStockItems.length > 0 && (
          <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Icon
              d={ICONS.alert}
              size={18}
              className="text-red-400 mt-0.5 shrink-0"
            />
            <div>
              <p className="text-red-300 text-sm font-medium">
                Low stock warning
              </p>
              <p className="text-red-400/70 text-xs mt-0.5">
                {lowStockItems.map((i) => i.name).join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Icon
              d={ICONS.search}
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or SKU…"
              className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-4 py-2.5 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors text-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className={`shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  catFilter === c
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory table */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-stone-700 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-950/40 border border-red-800/50 rounded-2xl p-6 text-center">
            <Icon
              d={ICONS.alert}
              size={24}
              className="text-red-400 mx-auto mb-2"
            />
            <p className="text-red-300 font-medium">Connection error</p>
            <p className="text-red-400/70 text-sm mt-1">{error}</p>
            <p className="text-stone-500 text-xs mt-3">
              Make sure you've set your SUPABASE_URL and SUPABASE_ANON_KEY in
              App.jsx
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-stone-600">
            <Icon d={ICONS.package} size={40} className="mb-3 opacity-40" />
            <p className="font-medium">
              {items.length === 0 ? 'No items yet' : 'No results'}
            </p>
            <p className="text-sm mt-1">
              {items.length === 0
                ? 'Add your first item to get started'
                : 'Try a different search or filter'}
            </p>
            {items.length === 0 && (
              <button
                onClick={() => setModal({ type: 'add' })}
                className="mt-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl px-5 py-2.5 text-sm transition-colors"
              >
                Add First Item
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-800">
                    {[
                      'Item',
                      'Category',
                      'SKU',
                      'Stock',
                      'Cost',
                      'RRP',
                      'Margin',
                      '',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs text-stone-500 font-medium uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, idx) => {
                    const margin =
                      item.selling_price > 0
                        ? ((item.selling_price - item.cost_price) /
                            item.selling_price) *
                          100
                        : 0;
                    const isLow =
                      (item.quantity || 0) <=
                      (item.low_stock_alert ?? LOW_STOCK_THRESHOLD);
                    return (
                      <tr
                        key={item.id}
                        className={`border-b border-stone-800/50 hover:bg-stone-800/40 transition-colors ${
                          idx === filtered.length - 1 ? 'border-0' : ''
                        }`}
                      >
                        <td className="px-4 py-3 font-medium text-stone-100">
                          {item.name}
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-stone-800 text-stone-400 text-xs px-2 py-1 rounded-lg">
                            {item.category || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-stone-500 font-mono text-xs">
                          {item.sku || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-semibold ${
                              isLow ? 'text-red-400' : 'text-stone-100'
                            }`}
                          >
                            {item.quantity}
                          </span>
                          {isLow && (
                            <span className="ml-2 text-red-500 text-xs">
                              ⚠ low
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-stone-400">
                          {fmt(item.cost_price)}
                        </td>
                        <td className="px-4 py-3 text-stone-100">
                          {fmt(item.selling_price)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-medium ${
                              margin >= 40
                                ? 'text-emerald-400'
                                : margin >= 20
                                ? 'text-amber-400'
                                : 'text-red-400'
                            }`}
                          >
                            {margin.toFixed(0)}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => setModal({ type: 'sale', item })}
                              className="text-xs bg-stone-800 hover:bg-amber-500/20 hover:text-amber-400 text-stone-400 border border-stone-700 rounded-lg px-2.5 py-1.5 transition-colors"
                            >
                              + Sale
                            </button>
                            <button
                              onClick={() => setModal({ type: 'edit', item })}
                              className="p-1.5 text-stone-500 hover:text-stone-300 transition-colors"
                            >
                              <Icon d={ICONS.edit} size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteId(item.id)}
                              className="p-1.5 text-stone-500 hover:text-red-400 transition-colors"
                            >
                              <Icon d={ICONS.trash} size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {filtered.map((item) => {
                const margin =
                  item.selling_price > 0
                    ? ((item.selling_price - item.cost_price) /
                        item.selling_price) *
                      100
                    : 0;
                const isLow =
                  (item.quantity || 0) <=
                  (item.low_stock_alert ?? LOW_STOCK_THRESHOLD);
                return (
                  <div
                    key={item.id}
                    className={`bg-stone-900 border rounded-2xl p-4 ${
                      isLow ? 'border-red-800/50' : 'border-stone-800'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-stone-100">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {item.category && (
                            <span className="bg-stone-800 text-stone-400 text-xs px-2 py-0.5 rounded-md">
                              {item.category}
                            </span>
                          )}
                          {item.sku && (
                            <span className="text-stone-600 font-mono text-xs">
                              {item.sku}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setModal({ type: 'edit', item })}
                          className="p-2 text-stone-500 hover:text-stone-300"
                        >
                          <Icon d={ICONS.edit} size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="p-2 text-stone-500 hover:text-red-400"
                        >
                          <Icon d={ICONS.trash} size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-stone-800/60 rounded-xl p-2.5 text-center">
                        <p className="text-stone-500 text-xs">Stock</p>
                        <p
                          className={`font-bold text-base mt-0.5 ${
                            isLow ? 'text-red-400' : 'text-stone-100'
                          }`}
                        >
                          {item.quantity}
                        </p>
                      </div>
                      <div className="bg-stone-800/60 rounded-xl p-2.5 text-center">
                        <p className="text-stone-500 text-xs">Cost</p>
                        <p className="font-bold text-base mt-0.5 text-stone-300">
                          {fmt(item.cost_price)}
                        </p>
                      </div>
                      <div className="bg-stone-800/60 rounded-xl p-2.5 text-center">
                        <p className="text-stone-500 text-xs">RRP</p>
                        <p className="font-bold text-base mt-0.5 text-amber-400">
                          {fmt(item.selling_price)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setModal({ type: 'sale', item })}
                      disabled={item.quantity < 1}
                      className="w-full bg-stone-800 hover:bg-amber-500/20 hover:text-amber-400 disabled:opacity-40 text-stone-300 border border-stone-700 rounded-xl py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Icon d={ICONS.trending} size={14} />
                      Record Sale
                    </button>
                  </div>
                );
              })}
            </div>

            <p className="text-stone-600 text-xs mt-4 text-right">
              {filtered.length} of {items.length} items
            </p>
          </>
        )}
      </main>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [unlocked, setUnlocked] = useState(false);

  return unlocked ? (
    <Dashboard onLock={() => setUnlocked(false)} />
  ) : (
    <LockScreen onUnlock={() => setUnlocked(true)} />
  );
}
