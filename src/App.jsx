import { useState } from "react";

const mockProducts = [
  { id: 1, name: "Coca-Cola 600ml", category: "Bebidas", stock: 48, min: 24, price: 18, cost: 11, sales: 320 },
  { id: 2, name: "Sabritas Original", category: "Botanas", stock: 6, min: 20, price: 22, cost: 13, sales: 210 },
  { id: 3, name: "Leche Lala 1L", category: "Lácteos", stock: 12, min: 15, price: 28, cost: 21, sales: 180 },
  { id: 4, name: "Pan Bimbo Blanco", category: "Panadería", stock: 3, min: 10, price: 45, cost: 32, sales: 95 },
  { id: 5, name: "Jabón Zote", category: "Limpieza", stock: 22, min: 10, price: 19, cost: 11, sales: 60 },
  { id: 6, name: "Galletas Marias", category: "Botanas", stock: 30, min: 15, price: 15, cost: 9, sales: 145 },
  { id: 7, name: "Frijoles La Costeña", category: "Abarrotes", stock: 18, min: 12, price: 32, cost: 22, sales: 88 },
  { id: 8, name: "Agua Ciel 1.5L", category: "Bebidas", stock: 2, min: 20, price: 14, cost: 8, sales: 290 },
];

const mockFiados = [
  { id: 1, name: "Doña Carmen", debt: 185, lastPurchase: "Hoy", products: ["Leche", "Pan", "Jabón"] },
  { id: 2, name: "El Chavo del 8", debt: 340, lastPurchase: "Ayer", products: ["Coca-Cola", "Sabritas"] },
  { id: 3, name: "Familia Pérez", debt: 75, lastPurchase: "Hace 3 días", products: ["Frijoles"] },
  { id: 4, name: "Don Ramiro", debt: 520, lastPurchase: "Hace 1 semana", products: ["Varios"] },
];

const salesData = [
  { day: "Lun", amount: 1240 },
  { day: "Mar", amount: 980 },
  { day: "Mié", amount: 1580 },
  { day: "Jue", amount: 1120 },
  { day: "Vie", amount: 2100 },
  { day: "Sáb", amount: 2650 },
  { day: "Dom", amount: 1890 },
];

const maxSale = Math.max(...salesData.map(d => d.amount));

export default function TienditaApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newSaleProduct, setNewSaleProduct] = useState("");
  const [newSaleQty, setNewSaleQty] = useState(1);
  const [salesLog, setSalesLog] = useState([
    { id: 1, product: "Coca-Cola 600ml", qty: 3, total: 54, time: "10:32 am" },
    { id: 2, product: "Sabritas Original", qty: 2, total: 44, time: "10:45 am" },
    { id: 3, product: "Leche Lala 1L", qty: 1, total: 28, time: "11:10 am" },
  ]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const lowStock = mockProducts.filter(p => p.stock <= p.min);
  const totalDebt = mockFiados.reduce((sum, f) => sum + f.debt, 0);
  const todaySales = salesData[salesData.length - 1].amount;
  const weekSales = salesData.reduce((sum, d) => sum + d.amount, 0);

  const filteredProducts = mockProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteSale = (id) => {
    setSalesLog(prev => prev.filter(v => v.id !== id));
    setConfirmDelete(null);
  };

  const registerSale = () => {
    if (!newSaleProduct) return;
    const product = mockProducts.find(p => p.name === newSaleProduct);
    if (!product) return;
    const newEntry = {
      id: Date.now(),
      product: product.name,
      qty: newSaleQty,
      total: product.price * newSaleQty,
      time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    };
    setSalesLog([newEntry, ...salesLog]);
    setNewSaleProduct("");
    setNewSaleQty(1);
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Nunito', sans-serif",
      background: "#0f1117",
      minHeight: "100vh",
      color: "#f0f0f0",
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{`
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
        select option { background: #1a1d27; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#13151f", borderBottom: "1px solid #1e2130", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ background: "#f97316", width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏪</div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: "#f97316", letterSpacing: "-0.02em" }}>TiendaFlow</div>
            <div style={{ fontSize: 10, color: "#555", marginTop: -2 }}>Abarrotes Don Chucho</div>
          </div>
        </div>
        <nav style={{ display: "flex", gap: "4px" }}>
          {[
            { id: "dashboard", label: "Dashboard", icon: "📊" },
            { id: "inventario", label: "Inventario", icon: "📦" },
            { id: "ventas", label: "Ventas", icon: "💰" },
            { id: "fiados", label: "Fiados", icon: "📋" },
          ].map(tab => (
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
          <div style={{ width: 34, height: 34, background: "#252836", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer" }}>👤</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "24px", maxWidth: 1200, width: "100%", margin: "0 auto" }}>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="fade-in">
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#f0f0f0" }}>Buenos días, Don Chucho 👋</h1>
              <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>Aquí está el resumen de tu tienda hoy</p>
            </div>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Ventas de Hoy", value: `$${todaySales.toLocaleString()}`, icon: "💵", color: "#22c55e", sub: "+12% vs ayer" },
                { label: "Ventas Semana", value: `$${weekSales.toLocaleString()}`, icon: "📈", color: "#3b82f6", sub: "Últimos 7 días" },
                { label: "Fiados Pendientes", value: `$${totalDebt.toLocaleString()}`, icon: "📋", color: "#f97316", sub: `${mockFiados.length} clientes` },
                { label: "Alertas de Stock", value: lowStock.length, icon: "⚠️", color: "#ef4444", sub: "Productos bajos" },
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
              {/* Sales Chart */}
              <div className="card">
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, color: "#f0f0f0" }}>Ventas de la semana</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140, paddingBottom: 4 }}>
                  {salesData.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <div style={{ fontSize: 10, color: "#666" }}>${(d.amount/1000).toFixed(1)}k</div>
                      <div style={{
                        width: "100%",
                        background: i === salesData.length - 1 ? "#f97316" : "#252836",
                        borderRadius: "6px 6px 0 0",
                        height: `${(d.amount / maxSale) * 100}px`,
                        transition: "height 0.4s ease",
                        border: i === salesData.length - 1 ? "none" : "1px solid #30354a",
                        minHeight: 8,
                      }} />
                      <div style={{ fontSize: 11, color: i === salesData.length - 1 ? "#f97316" : "#666", fontWeight: i === salesData.length - 1 ? 700 : 400 }}>{d.day}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>⚠️ Stock Bajo</div>
                  <span className="badge badge-red">{lowStock.length} items</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {lowStock.map(p => (
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

            {/* Top Products */}
            <div className="card" style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>🏆 Productos más vendidos esta semana</div>
              <div style={{ display: "flex", gap: 12 }}>
                {[...mockProducts].sort((a, b) => b.sales - a.sales).slice(0, 5).map((p, i) => (
                  <div key={p.id} style={{ flex: 1, background: "#252836", borderRadius: 12, padding: "14px", border: "1px solid #30354a", textAlign: "center" }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][i]}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#f0f0f0", marginBottom: 4, lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#f97316" }}>{p.sales}</div>
                    <div style={{ fontSize: 10, color: "#555" }}>ventas</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INVENTARIO TAB */}
        {activeTab === "inventario" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800 }}>📦 Inventario</h1>
                <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>{mockProducts.length} productos registrados</p>
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
                  <input className="input" placeholder="Nombre del producto" />
                  <input className="input" placeholder="Categoría" />
                  <input className="input" type="number" placeholder="Stock inicial" />
                  <input className="input" type="number" placeholder="Precio venta $" />
                  <input className="input" type="number" placeholder="Costo $" />
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button className="btn-primary">Guardar Producto</button>
                  <button className="btn-ghost" onClick={() => setShowAddProduct(false)}>Cancelar</button>
                </div>
              </div>
            )}

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div className="table-header" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr", background: "#13151f", borderBottom: "1px solid #252836" }}>
                <span>PRODUCTO</span>
                <span>CATEGORÍA</span>
                <span>STOCK</span>
                <span>MÍNIMO</span>
                <span>PRECIO</span>
                <span>COSTO</span>
                <span>MARGEN</span>
              </div>
              {filteredProducts.map(p => {
                const margin = Math.round(((p.price - p.cost) / p.price) * 100);
                const isLow = p.stock <= p.min;
                return (
                  <div key={p.id} className="table-row" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr" }}>
                    <div style={{ fontWeight: 600, color: "#f0f0f0" }}>{p.name}</div>
                    <span className="badge badge-blue">{p.category}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, color: isLow ? "#ef4444" : "#22c55e" }}>{p.stock}</span>
                      {isLow && <span className="badge badge-red">Bajo</span>}
                    </div>
                    <div style={{ color: "#666" }}>{p.min}</div>
                    <div style={{ fontWeight: 600, color: "#f0f0f0" }}>${p.price}</div>
                    <div style={{ color: "#888" }}>${p.cost}</div>
                    <div style={{ fontWeight: 700, color: margin >= 40 ? "#22c55e" : margin >= 25 ? "#f97316" : "#ef4444" }}>{margin}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VENTAS TAB */}
        {activeTab === "ventas" && (
          <div className="fade-in">
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800 }}>💰 Registrar Venta</h1>
              <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>Registra cada venta del día fácilmente</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="card" style={{ border: "1px solid rgba(249,115,22,0.2)" }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18, color: "#f97316" }}>Nueva venta</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "#888", marginBottom: 6, display: "block" }}>Producto</label>
                    <select className="input" value={newSaleProduct} onChange={e => setNewSaleProduct(e.target.value)} style={{ appearance: "none" }}>
                      <option value="">-- Selecciona un producto --</option>
                      {mockProducts.map(p => <option key={p.id} value={p.name}>{p.name} — ${p.price}</option>)}
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
                        ${((mockProducts.find(p => p.name === newSaleProduct)?.price || 0) * newSaleQty).toFixed(2)}
                      </div>
                    </div>
                  )}
                  <button className="btn-primary" style={{ padding: "14px", fontSize: 15, marginTop: 4 }} onClick={registerSale}>✅ Registrar Venta</button>
                </div>
              </div>

              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #252836", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Ventas del día</div>
                  <span className="badge badge-green">${salesLog.reduce((s, v) => s + v.total, 0).toLocaleString()} MXN</span>
                </div>
                <div style={{ maxHeight: 340, overflowY: "auto" }}>
                  {salesLog.length === 0 && (
                    <div style={{ padding: "30px 20px", textAlign: "center", color: "#555", fontSize: 13 }}>
                      Sin ventas registradas aún
                    </div>
                  )}
                  {salesLog.map(v => (
                    <div key={v.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid #1e2130", transition: "background 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#1e2130"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{v.product}</div>
                        <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{v.qty} pza{v.qty > 1 ? "s" : ""} • {v.time}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ fontWeight: 700, color: "#22c55e", fontSize: 15 }}>${v.total}</div>
                        {confirmDelete === v.id ? (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => deleteSale(v.id)} style={{ background: "#ef4444", color: "white", border: "none", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700 }}>Sí, borrar</button>
                            <button onClick={() => setConfirmDelete(null)} style={{ background: "#252836", color: "#aaa", border: "none", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>Cancelar</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(v.id)} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>🗑 Borrar</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FIADOS TAB */}
        {activeTab === "fiados" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800 }}>📋 Control de Fiados</h1>
                <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>Total pendiente: <span style={{ color: "#f97316", fontWeight: 700 }}>${totalDebt.toLocaleString()} MXN</span></p>
              </div>
              <button className="btn-primary">+ Nuevo Fiado</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {mockFiados.map(f => (
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
                      <div style={{ fontSize: 24, fontWeight: 800, color: f.debt > 300 ? "#ef4444" : "#f97316", fontFamily: "'Syne', sans-serif" }}>${f.debt}</div>
                      <div style={{ fontSize: 11, color: "#666" }}>pendiente</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                    {f.products.map((prod, i) => <span key={i} className="badge badge-blue">{prod}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-primary" style={{ flex: 1 }}>✅ Registrar Pago</button>
                    <button className="btn-ghost" style={{ flex: 1 }}>+ Agregar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ background: "#13151f", borderTop: "1px solid #1e2130", padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 11, color: "#444" }}>TiendaFlow Pro • Plan Básico • $299/mes</div>
        <div style={{ fontSize: 11, color: "#444" }}>© 2026 TiendaFlow SaaS</div>
      </div>
    </div>
  );
}
