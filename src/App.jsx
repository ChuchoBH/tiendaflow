import { useState } from "react";

const initialProducts = [
  { id: 1, name: "Coca-Cola 600ml", category: "Bebidas", stock: 48, min: 24, price: 18, cost: 11, sales: 320 },
  { id: 2, name: "Sabritas Original", category: "Botanas", stock: 6, min: 20, price: 22, cost: 13, sales: 210 },
  { id: 3, name: "Leche Lala 1L", category: "Lácteos", stock: 12, min: 15, price: 28, cost: 21, sales: 180 },
  { id: 4, name: "Pan Bimbo Blanco", category: "Panadería", stock: 3, min: 10, price: 45, cost: 32, sales: 95 },
  { id: 5, name: "Jabón Zote", category: "Limpieza", stock: 22, min: 10, price: 19, cost: 11, sales: 60 },
  { id: 6, name: "Galletas Marias", category: "Botanas", stock: 30, min: 15, price: 15, cost: 9, sales: 145 },
  { id: 7, name: "Frijoles La Costeña", category: "Abarrotes", stock: 18, min: 12, price: 32, cost: 22, sales: 88 },
  { id: 8, name: "Agua Ciel 1.5L", category: "Bebidas", stock: 2, min: 20, price: 14, cost: 8, sales: 290 },
];

const initialFiados = [
  { id: 1, name: "Doña Carmen", debt: 185, lastPurchase: "Hoy", items: ["Leche", "Pan", "Jabón"] },
  { id: 2, name: "El Chavo del 8", debt: 340, lastPurchase: "Ayer", items: ["Coca-Cola", "Sabritas"] },
  { id: 3, name: "Familia Pérez", debt: 75, lastPurchase: "Hace 3 días", items: ["Frijoles"] },
  { id: 4, name: "Don Ramiro", debt: 520, lastPurchase: "Hace 1 semana", items: ["Varios"] },
];

const initialSalesLog = [
  { id: 1, product: "Coca-Cola 600ml", productId: 1, qty: 3, total: 54, time: "10:32 am" },
  { id: 2, product: "Sabritas Original", productId: 2, qty: 2, total: 44, time: "10:45 am" },
  { id: 3, product: "Leche Lala 1L", productId: 3, qty: 1, total: 28, time: "11:10 am" },
];

const weekBase = [
  { day: "Lun", amount: 1240 },
  { day: "Mar", amount: 980 },
  { day: "Mié", amount: 1580 },
  { day: "Jue", amount: 1120 },
  { day: "Vie", amount: 2100 },
  { day: "Sáb", amount: 2650 },
];

export default function TienditaApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState(initialProducts);
  const [salesLog, setSalesLog] = useState(initialSalesLog);
  const [fiados, setFiados] = useState(initialFiados);
  const [toast, setToast] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", category: "", stock: "", price: "", cost: "" });
  const [newSaleProduct, setNewSaleProduct] = useState("");
  const [newSaleQty, setNewSaleQty] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showAddFiado, setShowAddFiado] = useState(false);
  const [newFiado, setNewFiado] = useState({ name: "", amount: "", item: "" });
  const [pagoModal, setPagoModal] = useState(null);
  const [pagoAmount, setPagoAmount] = useState("");
  const [agregarModal, setAgregarModal] = useState(null);
  const [agregarItem, setAgregarItem] = useState("");
  const [agregarAmount, setAgregarAmount] = useState("");

  const showToast = (msg, color = "#22c55e") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  // Real-time dashboard calculations
  const todaySalesTotal = salesLog.reduce((s, v) => s + v.total, 0);
  const weekSalesTotal = weekBase.reduce((s, d) => s + d.amount, 0) + todaySalesTotal;
  const totalDebt = fiados.reduce((sum, f) => sum + f.debt, 0);
  const lowStock = products.filter(p => p.stock <= p.min);
  const chartData = [...weekBase, { day: "Hoy", amount: todaySalesTotal }];
  const maxSale = Math.max(...chartData.map(d => d.amount), 1);
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.stock || !newProduct.price || !newProduct.cost) {
      showToast("⚠️ Llena todos los campos", "#ef4444"); return;
    }
    setProducts(prev => [...prev, {
      id: Date.now(), name: newProduct.name, category: newProduct.category,
      stock: parseInt(newProduct.stock), min: 10,
      price: parseFloat(newProduct.price), cost: parseFloat(newProduct.cost), sales: 0,
    }]);
    showToast("✅ Producto agregado — " + newProduct.name);
    setNewProduct({ name: "", category: "", stock: "", price: "", cost: "" });
    setShowAddProduct(false);
  };

  const registerSale = () => {
    if (!newSaleProduct) return;
    const product = products.find(p => p.name === newSaleProduct);
    if (!product) return;
    if (product.stock < newSaleQty) {
      showToast("⚠️ Stock insuficiente. Solo hay " + product.stock + " pzas.", "#ef4444"); return;
    }
    const entry = {
      id: Date.now(), product: product.name, productId: product.id,
      qty: newSaleQty, total: product.price * newSaleQty,
      time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    };
    setSalesLog(prev => [entry, ...prev]);
    setProducts(prev => prev.map(p =>
      p.id === product.id ? { ...p, stock: p.stock - newSaleQty, sales: p.sales + newSaleQty } : p
    ));
    showToast("✅ Venta — " + product.name + " x" + newSaleQty);
    setNewSaleProduct(""); setNewSaleQty(1);
  };

  const deleteSale = (id) => {
    const sale = salesLog.find(v => v.id === id);
    if (sale) {
      setProducts(prev => prev.map(p =>
        p.id === sale.productId ? { ...p, stock: p.stock + sale.qty, sales: Math.max(0, p.sales - sale.qty) } : p
      ));
      showToast("↩️ Venta cancelada — stock devuelto", "#f97316");
    }
    setSalesLog(prev => prev.filter(v => v.id !== id));
    setConfirmDelete(null);
  };

  const addFiado = () => {
    if (!newFiado.name || !newFiado.amount) {
      showToast("⚠️ Nombre y monto son obligatorios", "#ef4444"); return;
    }
    setFiados(prev => [...prev, {
      id: Date.now(), name: newFiado.name,
      debt: parseFloat(newFiado.amount),
      lastPurchase: "Hoy",
      items: newFiado.item ? [newFiado.item] : ["Varios"],
    }]);
    showToast("✅ Fiado agregado — " + newFiado.name);
    setNewFiado({ name: "", amount: "", item: "" });
    setShowAddFiado(false);
  };

  const registrarPago = () => {
    const monto = parseFloat(pagoAmount);
    if (!monto || monto <= 0) { showToast("⚠️ Ingresa un monto válido", "#ef4444"); return; }
    const fiado = fiados.find(f => f.id === pagoModal.id);
    const newDebt = Math.max(0, fiado.debt - monto);
    if (newDebt === 0) {
      setFiados(prev => prev.filter(f => f.id !== pagoModal.id));
      showToast("🎉 ¡Deuda saldada! — " + pagoModal.name);
    } else {
      setFiados(prev => prev.map(f =>
        f.id === pagoModal.id ? { ...f, debt: newDebt, lastPurchase: "Hoy" } : f
      ));
      showToast("✅ Pago de $" + monto + " registrado — " + pagoModal.name);
    }
    setPagoModal(null); setPagoAmount("");
  };

  const agregarAlFiado = () => {
    const monto = parseFloat(agregarAmount);
    if (!agregarItem || !monto || monto <= 0) { showToast("⚠️ Llena producto y monto", "#ef4444"); return; }
    setFiados(prev => prev.map(f =>
      f.id === agregarModal.id
        ? { ...f, debt: f.debt + monto, lastPurchase: "Hoy", items: [...f.items, agregarItem] }
        : f
    ));
    showToast("✅ Agregado $" + monto + " al fiado de " + agregarModal.name);
    setAgregarModal(null); setAgregarItem(""); setAgregarAmount("");
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #1a1d27; }
    ::-webkit-scrollbar-thumb { background: #f97316; border-radius: 4px; }
    .nav-btn { background: none; border: none; cursor: pointer; padding: 10px 18px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; transition: all 0.2s; color: #888; display: flex; align-items: center; gap: 7px; }
    .nav-btn:hover { background: #1e2130; color: #f0f0f0; }
    .nav-btn.active { background: #f97316; color: #fff; }
    .card { background: #1a1d27; border-radius: 16px; padding: 20px; border: 1px solid #252836; }
    .stat-card { background: #1a1d27; border-radius: 16px; padding: 22px; border: 1px solid #252836; transition: transform 0.2s; }
    .stat-card:hover { transform: translateY(-2px); }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .badge-red { background: rgba(239,68,68,0.15); color: #ef4444; }
    .badge-green { background: rgba(34,197,94,0.15); color: #22c55e; }
    .badge-orange { background: rgba(249,115,22,0.15); color: #f97316; }
    .badge-blue { background: rgba(59,130,246,0.15); color: #3b82f6; }
    .btn-primary { background: #f97316; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 13px; transition: all 0.2s; }
    .btn-primary:hover { background: #ea6c0a; transform: translateY(-1px); }
    .btn-ghost { background: #252836; color: #f0f0f0; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 13px; transition: all 0.2s; }
    .btn-ghost:hover { background: #2d3147; }
    .input { background: #252836; border: 1px solid #30354a; color: #f0f0f0; padding: 10px 14px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; width: 100%; outline: none; transition: border-color 0.2s; }
    .input:focus { border-color: #f97316; }
    .table-row { display: grid; padding: 12px 16px; border-bottom: 1px solid #1e2130; align-items: center; font-size: 13px; }
    .table-row:hover { background: #1e2130; }
    .table-header { display: grid; padding: 10px 16px; font-size: 11px; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.05em; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .fade-in { animation: fadeIn 0.3s ease forwards; }
    .alert-pulse { animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
    @keyframes toastIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 200; display: flex; align-items: center; justify-content: center; }
    .modal { background: #1a1d27; border-radius: 20px; padding: 28px; width: 420px; border: 1px solid #30354a; box-shadow: 0 24px 60px rgba(0,0,0,0.6); }
    select option { background: #1a1d27; }
  `;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0f1117", minHeight: "100vh", color: "#f0f0f0", display: "flex", flexDirection: "column" }}>
      <style>{css}</style>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: toast.color, color: "white", padding: "12px 24px", borderRadius: 12, fontWeight: 600, fontSize: 14, zIndex: 9999, boxShadow: "0 8px 24px rgba(0,0,0,0.4)", animation: "toastIn 0.3s ease", whiteSpace: "nowrap" }}>
          {toast.msg}
        </div>
      )}

      {/* Modal Pago */}
      {pagoModal && (
        <div className="overlay" onClick={() => { setPagoModal(null); setPagoAmount(""); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, marginBottom: 6 }}>✅ Registrar Pago</div>
            <div style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>{pagoModal.name} — Deuda: <span style={{ color: "#f97316", fontWeight: 700 }}>${pagoModal.debt}</span></div>
            <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6 }}>¿Cuánto pagó? ($)</label>
            <input className="input" type="number" placeholder="ej: 100" value={pagoAmount} onChange={e => setPagoAmount(e.target.value)} autoFocus />
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={registrarPago}>Confirmar Pago</button>
              <button className="btn-ghost" onClick={() => { setPagoModal(null); setPagoAmount(""); }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Agregar al Fiado */}
      {agregarModal && (
        <div className="overlay" onClick={() => { setAgregarModal(null); setAgregarItem(""); setAgregarAmount(""); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, marginBottom: 6 }}>➕ Agregar al Fiado</div>
            <div style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>{agregarModal.name}</div>
            <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6 }}>Producto</label>
            <input className="input" placeholder="ej: Coca-Cola, Leche..." value={agregarItem} onChange={e => setAgregarItem(e.target.value)} style={{ marginBottom: 12 }} autoFocus />
            <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6 }}>Monto ($)</label>
            <input className="input" type="number" placeholder="ej: 28" value={agregarAmount} onChange={e => setAgregarAmount(e.target.value)} />
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={agregarAlFiado}>Agregar al Fiado</button>
              <button className="btn-ghost" onClick={() => { setAgregarModal(null); setAgregarItem(""); setAgregarAmount(""); }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nuevo Fiado */}
      {showAddFiado && (
        <div className="overlay" onClick={() => { setShowAddFiado(false); setNewFiado({ name: "", amount: "", item: "" }); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, marginBottom: 6 }}>📋 Nuevo Fiado</div>
            <div style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>Registra un nuevo cliente fiado</div>
            <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6 }}>Nombre del cliente</label>
            <input className="input" placeholder="ej: Doña Lupita" value={newFiado.name} onChange={e => setNewFiado(p => ({ ...p, name: e.target.value }))} style={{ marginBottom: 12 }} autoFocus />
            <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6 }}>Producto (opcional)</label>
            <input className="input" placeholder="ej: Leche, Coca-Cola..." value={newFiado.item} onChange={e => setNewFiado(p => ({ ...p, item: e.target.value }))} style={{ marginBottom: 12 }} />
            <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6 }}>Monto ($)</label>
            <input className="input" type="number" placeholder="ej: 50" value={newFiado.amount} onChange={e => setNewFiado(p => ({ ...p, amount: e.target.value }))} />
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={addFiado}>Guardar Fiado</button>
              <button className="btn-ghost" onClick={() => { setShowAddFiado(false); setNewFiado({ name: "", amount: "", item: "" }); }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: "#13151f", borderBottom: "1px solid #1e2130", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ background: "#f97316", width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏪</div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: "#f97316" }}>TiendaFlow</div>
            <div style={{ fontSize: 10, color: "#555", marginTop: -2 }}>Abarrotes Don Chucho</div>
          </div>
        </div>
        <nav style={{ display: "flex", gap: "4px" }}>
          {[{ id: "dashboard", label: "Dashboard", icon: "📊" }, { id: "inventario", label: "Inventario", icon: "📦" }, { id: "ventas", label: "Ventas", icon: "💰" }, { id: "fiados", label: "Fiados", icon: "📋" }].map(tab => (
            <button key={tab.id} className={`nav-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {lowStock.length > 0 && (
            <div className="alert-pulse" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
              ⚠️ {lowStock.length} productos bajos
            </div>
          )}
          <div style={{ width: 34, height: 34, background: "#252836", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "24px", maxWidth: 1200, width: "100%", margin: "0 auto" }}>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="fade-in">
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800 }}>Buenos días, Don Chucho 👋</h1>
              <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>Resumen en tiempo real de tu tienda</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Ventas de Hoy", value: "$" + todaySalesTotal.toLocaleString(), icon: "💵", color: "#22c55e", sub: salesLog.length + " ventas registradas" },
                { label: "Ventas Semana", value: "$" + weekSalesTotal.toLocaleString(), icon: "📈", color: "#3b82f6", sub: "Últimos 7 días" },
                { label: "Fiados Pendientes", value: "$" + totalDebt.toLocaleString(), icon: "📋", color: "#f97316", sub: fiados.length + " clientes" },
                { label: "Alertas de Stock", value: lowStock.length, icon: "⚠️", color: lowStock.length > 0 ? "#ef4444" : "#22c55e", sub: lowStock.length > 0 ? "Requieren surtido" : "Todo en orden ✅" },
              ].map((kpi, i) => (
                <div key={i} className="stat-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#666", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{kpi.label}</div>
                      <div style={{ fontSize: 28, fontWeight: 700, color: kpi.color, fontFamily: "'Syne', sans-serif" }}>{kpi.value}</div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 6 }}>{kpi.sub}</div>
                    </div>
                    <div style={{ fontSize: 28 }}>{kpi.icon}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
              <div className="card">
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Ventas de la semana</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140, paddingBottom: 4 }}>
                  {chartData.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <div style={{ fontSize: 10, color: "#666" }}>${(d.amount / 1000).toFixed(1)}k</div>
                      <div style={{ width: "100%", background: i === chartData.length - 1 ? "#f97316" : "#252836", borderRadius: "6px 6px 0 0", height: Math.max((d.amount / maxSale) * 100, 4) + "px", transition: "height 0.4s ease", border: i === chartData.length - 1 ? "none" : "1px solid #30354a" }} />
                      <div style={{ fontSize: 11, color: i === chartData.length - 1 ? "#f97316" : "#666", fontWeight: i === chartData.length - 1 ? 700 : 400 }}>{d.day}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>⚠️ Stock Bajo</div>
                  <span className="badge badge-red">{lowStock.length} items</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {lowStock.length === 0
                    ? <div style={{ color: "#555", fontSize: 13, textAlign: "center", padding: "20px 0" }}>✅ Todo el inventario está bien</div>
                    : lowStock.map(p => (
                      <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "rgba(239,68,68,0.07)", borderRadius: 10, border: "1px solid rgba(239,68,68,0.15)" }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: "#ef4444", marginTop: 2 }}>Solo {p.stock} pzas • Mín: {p.min}</div>
                        </div>
                        <button className="btn-primary" style={{ padding: "5px 10px", fontSize: 11 }}>Pedir</button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="card" style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>🏆 Productos más vendidos</div>
              <div style={{ display: "flex", gap: 12 }}>
                {[...products].sort((a, b) => b.sales - a.sales).slice(0, 5).map((p, i) => (
                  <div key={p.id} style={{ flex: 1, background: "#252836", borderRadius: 12, padding: 14, border: "1px solid #30354a", textAlign: "center" }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][i]}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#f97316" }}>{p.sales}</div>
                    <div style={{ fontSize: 10, color: "#555" }}>ventas</div>
                  </div>
                ))}
              </div>
            </div>
            {salesLog.length > 0 && (
              <div className="card" style={{ marginTop: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>🕐 Últimas ventas del día</div>
                {salesLog.slice(0, 5).map(v => (
                  <div key={v.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e2130" }}>
                    <div style={{ fontSize: 13 }}>{v.product} <span style={{ color: "#555" }}>x{v.qty}</span></div>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "#555" }}>{v.time}</span>
                      <span style={{ fontWeight: 700, color: "#22c55e" }}>${v.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* INVENTARIO */}
        {activeTab === "inventario" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800 }}>📦 Inventario</h1>
                <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>{products.length} productos registrados</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <input className="input" style={{ width: 220 }} placeholder="🔍 Buscar producto..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <button className="btn-primary" onClick={() => setShowAddProduct(!showAddProduct)}>+ Agregar Producto</button>
              </div>
            </div>
            {showAddProduct && (
              <div className="card fade-in" style={{ marginBottom: 16, border: "1px solid rgba(249,115,22,0.3)" }}>
                <div style={{ fontWeight: 700, marginBottom: 16, color: "#f97316" }}>Nuevo Producto</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                  <input className="input" placeholder="Nombre" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} />
                  <input className="input" placeholder="Categoría" value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} />
                  <input className="input" type="number" placeholder="Stock inicial" value={newProduct.stock} onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))} />
                  <input className="input" type="number" placeholder="Precio venta $" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} />
                  <input className="input" type="number" placeholder="Costo $" value={newProduct.cost} onChange={e => setNewProduct(p => ({ ...p, cost: e.target.value }))} />
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button className="btn-primary" onClick={addProduct}>Guardar Producto</button>
                  <button className="btn-ghost" onClick={() => { setShowAddProduct(false); setNewProduct({ name: "", category: "", stock: "", price: "", cost: "" }); }}>Cancelar</button>
                </div>
              </div>
            )}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div className="table-header" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr", background: "#13151f", borderBottom: "1px solid #252836" }}>
                <span>PRODUCTO</span><span>CATEGORÍA</span><span>STOCK</span><span>MÍNIMO</span><span>PRECIO</span><span>COSTO</span><span>MARGEN</span>
              </div>
              {filteredProducts.map(p => {
                const margin = p.price > 0 ? Math.round(((p.price - p.cost) / p.price) * 100) : 0;
                const isLow = p.stock <= p.min;
                return (
                  <div key={p.id} className="table-row" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr" }}>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <span className="badge badge-blue">{p.category}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, color: isLow ? "#ef4444" : "#22c55e" }}>{p.stock}</span>
                      {isLow && <span className="badge badge-red">Bajo</span>}
                    </div>
                    <div style={{ color: "#666" }}>{p.min}</div>
                    <div style={{ fontWeight: 600 }}>${p.price}</div>
                    <div style={{ color: "#888" }}>${p.cost}</div>
                    <div style={{ fontWeight: 700, color: margin >= 40 ? "#22c55e" : margin >= 25 ? "#f97316" : "#ef4444" }}>{margin}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VENTAS */}
        {activeTab === "ventas" && (
          <div className="fade-in">
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800 }}>💰 Registrar Venta</h1>
              <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>Las ventas actualizan el inventario y el dashboard automáticamente</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="card" style={{ border: "1px solid rgba(249,115,22,0.2)" }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18, color: "#f97316" }}>Nueva venta</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "#888", marginBottom: 6, display: "block" }}>Producto</label>
                    <select className="input" value={newSaleProduct} onChange={e => setNewSaleProduct(e.target.value)} style={{ appearance: "none" }}>
                      <option value="">-- Selecciona un producto --</option>
                      {products.map(p => <option key={p.id} value={p.name}>{p.name} — ${p.price} (stock: {p.stock})</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#888", marginBottom: 6, display: "block" }}>Cantidad</label>
                    <input className="input" type="number" min="1" value={newSaleQty} onChange={e => setNewSaleQty(parseInt(e.target.value) || 1)} />
                  </div>
                  {newSaleProduct && (
                    <div style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 12, padding: 14 }}>
                      <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Total a cobrar</div>
                      <div style={{ fontSize: 32, fontWeight: 800, color: "#f97316", fontFamily: "'Syne', sans-serif" }}>
                        ${((products.find(p => p.name === newSaleProduct)?.price || 0) * newSaleQty).toFixed(2)}
                      </div>
                    </div>
                  )}
                  <button className="btn-primary" style={{ padding: 14, fontSize: 15, marginTop: 4 }} onClick={registerSale}>✅ Registrar Venta</button>
                </div>
              </div>
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #252836", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Ventas del día</div>
                  <span className="badge badge-green">${salesLog.reduce((s, v) => s + v.total, 0).toLocaleString()} MXN</span>
                </div>
                <div style={{ maxHeight: 380, overflowY: "auto" }}>
                  {salesLog.length === 0 && <div style={{ padding: "30px 20px", textAlign: "center", color: "#555", fontSize: 13 }}>Sin ventas registradas aún</div>}
                  {salesLog.map(v => (
                    <div key={v.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid #1e2130" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{v.product}</div>
                        <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{v.qty} pza{v.qty > 1 ? "s" : ""} • {v.time}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ fontWeight: 700, color: "#22c55e", fontSize: 15 }}>${v.total}</div>
                        {confirmDelete === v.id ? (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => deleteSale(v.id)} style={{ background: "#ef4444", color: "white", border: "none", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700 }}>Sí</button>
                            <button onClick={() => setConfirmDelete(null)} style={{ background: "#252836", color: "#aaa", border: "none", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>No</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(v.id)} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>🗑</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FIADOS */}
        {activeTab === "fiados" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800 }}>📋 Control de Fiados</h1>
                <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>Total pendiente: <span style={{ color: "#f97316", fontWeight: 700 }}>${totalDebt.toLocaleString()} MXN</span> • {fiados.length} clientes</p>
              </div>
              <button className="btn-primary" onClick={() => setShowAddFiado(true)}>+ Nuevo Fiado</button>
            </div>
            {fiados.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#555" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#f0f0f0" }}>¡Sin fiados pendientes!</div>
                <div style={{ fontSize: 13, marginTop: 6 }}>Todos los clientes están al corriente</div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {fiados.map(f => (
                <div key={f.id} className="card" style={{ border: f.debt > 300 ? "1px solid rgba(239,68,68,0.25)" : "1px solid #252836" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 42, height: 42, background: "#252836", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👤</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{f.name}</div>
                        <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>Último: {f.lastPurchase}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: f.debt > 300 ? "#ef4444" : "#f97316", fontFamily: "'Syne', sans-serif" }}>${f.debt.toLocaleString()}</div>
                      <div style={{ fontSize: 11, color: "#666" }}>pendiente</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                    {f.items.map((item, i) => <span key={i} className="badge badge-blue">{item}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={() => { setPagoModal(f); setPagoAmount(""); }}>✅ Registrar Pago</button>
                    <button className="btn-ghost" style={{ flex: 1 }} onClick={() => { setAgregarModal(f); setAgregarItem(""); setAgregarAmount(""); }}>+ Agregar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ background: "#13151f", borderTop: "1px solid #1e2130", padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 11, color: "#444" }}>TiendaFlow Pro • Plan Básico • $299/mes</div>
        <div style={{ fontSize: 11, color: "#444" }}>© 2026 TiendaFlow SaaS</div>
      </div>
    </div>
  );
}
