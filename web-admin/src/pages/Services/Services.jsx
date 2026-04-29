import React, { useState } from 'react';
import { Plus, Edit2, X, Save, ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from 'lucide-react';
import { categories as initialCategories } from '../../utils/mockData';
import { formatVND } from '../../utils/format';
import './Services.css';

// ─── Commission Editor ────────────────────────────────────────────────────────
const CommissionEditor = ({ category, onSave }) => {
  const [rate, setRate] = useState(category.commissionRate);
  const [base, setBase] = useState(category.baseFee);

  return (
    <div className="commission-editor">
      <div className="comm-field">
        <label>Phí cơ bản (gọi thợ)</label>
        <div className="input-suffix-wrap">
          <input type="number" value={base} onChange={(e) => setBase(+e.target.value)} />
          <span className="input-suffix">đ</span>
        </div>
      </div>
      <div className="comm-field">
        <label>Tỷ lệ hoa hồng nền tảng</label>
        <div className="input-suffix-wrap">
          <input
            type="number"
            step="0.5"
            min="0"
            max="100"
            value={rate}
            onChange={(e) => setRate(+e.target.value)}
          />
          <span className="input-suffix">%</span>
        </div>
        <p className="comm-hint">
          Thợ sẽ nhận: {(100 - rate).toFixed(1)}% • Nền tảng giữ: {rate}%
        </p>
      </div>
      <button
        className="btn btn-success btn-sm"
        onClick={() => onSave(category.id, { commissionRate: rate, baseFee: base })}
      >
        <Save size={14} /> Lưu
      </button>
    </div>
  );
};

// ─── Pricing Item Row ─────────────────────────────────────────────────────────
const PricingRow = ({ item, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [vals, setVals] = useState({ ...item });

  const save = () => { onUpdate(vals); setEditing(false); };

  if (editing) {
    return (
      <tr className="pricing-row editing">
        <td>
          <input
            className="inline-input"
            value={vals.name}
            onChange={(e) => setVals({ ...vals, name: e.target.value })}
          />
        </td>
        <td>
          <input
            type="number"
            className="inline-input small"
            value={vals.minPrice}
            onChange={(e) => setVals({ ...vals, minPrice: +e.target.value })}
          />
        </td>
        <td>
          <input
            type="number"
            className="inline-input small"
            value={vals.maxPrice}
            onChange={(e) => setVals({ ...vals, maxPrice: +e.target.value })}
          />
        </td>
        <td>
          <div className="action-btns">
            <button className="btn btn-sm btn-success" onClick={save}><Save size={13} /></button>
            <button className="btn btn-sm btn-ghost" onClick={() => setEditing(false)}><X size={13} /></button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="pricing-row">
      <td>{item.name}</td>
      <td className="price-cell">{formatVND(item.minPrice)}</td>
      <td className="price-cell">{formatVND(item.maxPrice)}</td>
      <td>
        <div className="action-btns">
          <button className="btn btn-sm btn-outline" onClick={() => setEditing(true)}><Edit2 size={13} /></button>
          <button className="btn btn-sm btn-danger" onClick={onDelete}><X size={13} /></button>
        </div>
      </td>
    </tr>
  );
};

// ─── Category Card ─────────────────────────────────────────────────────────────
const CategoryCard = ({ category, onToggle, onUpdateComm, onUpdatePricing, onDeletePricing, onAddPricing }) => {
  const [expanded, setExpanded] = useState(false);
  const [showCommEditor, setShowCommEditor] = useState(false);

  return (
    <div className={`category-card ${!category.isActive ? 'inactive' : ''}`}>
      {/* Card Header */}
      <div className="cat-header" onClick={() => setExpanded(!expanded)}>
        <div className="cat-icon">{category.icon}</div>
        <div className="cat-info">
          <h4 className="cat-name">{category.name}</h4>
          <div className="cat-tags">
            <span className="cat-tag">Phí gọi thợ: {formatVND(category.baseFee)}</span>
            <span className="cat-tag accent">Hoa hồng: {category.commissionRate}%</span>
            <span className="cat-tag">{category.pricingItems.length} mục giá</span>
          </div>
        </div>
        <div className="cat-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className={`toggle-btn ${category.isActive ? 'on' : 'off'}`}
            onClick={() => onToggle(category.id)}
            title={category.isActive ? 'Đang hoạt động' : 'Đã tắt'}
          >
            {category.isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
          </button>
        </div>
        <div className="cat-chevron">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="cat-body">
          {/* Commission */}
          <div className="cat-section">
            <div className="cat-section-header">
              <h5>Cấu hình hoa hồng & phí</h5>
              <button className="btn btn-sm btn-outline" onClick={() => setShowCommEditor(!showCommEditor)}>
                <Edit2 size={13} /> Chỉnh sửa
              </button>
            </div>
            {showCommEditor && (
              <CommissionEditor
                category={category}
                onSave={(id, vals) => { onUpdateComm(id, vals); setShowCommEditor(false); }}
              />
            )}
          </div>

          {/* Pricing Table */}
          <div className="cat-section">
            <div className="cat-section-header">
              <h5>Bảng giá tham khảo</h5>
              <button className="btn btn-sm btn-success" onClick={() => onAddPricing(category.id)}>
                <Plus size={13} /> Thêm mục giá
              </button>
            </div>
            <table className="data-table pricing-table">
              <thead>
                <tr>
                  <th>Tên hạng mục</th>
                  <th>Giá thấp nhất</th>
                  <th>Giá cao nhất</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {category.pricingItems.map((item, idx) => (
                  <PricingRow
                    key={idx}
                    item={item}
                    onUpdate={(vals) => onUpdatePricing(category.id, idx, vals)}
                    onDelete={() => onDeletePricing(category.id, idx)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Services Page ─────────────────────────────────────────────────────────────
const Services = () => {
  const [cats, setCats] = useState(initialCategories);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = (id) => {
    setCats((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const handleUpdateComm = (id, vals) => {
    setCats((prev) => prev.map((c) => c.id === id ? { ...c, ...vals } : c));
    showToast('✅ Đã cập nhật hoa hồng & phí cơ bản!');
  };

  const handleUpdatePricing = (catId, idx, vals) => {
    setCats((prev) => prev.map((c) => {
      if (c.id !== catId) return c;
      const items = [...c.pricingItems];
      items[idx] = vals;
      return { ...c, pricingItems: items };
    }));
    showToast('✅ Đã cập nhật bảng giá!');
  };

  const handleDeletePricing = (catId, idx) => {
    setCats((prev) => prev.map((c) => {
      if (c.id !== catId) return c;
      const items = c.pricingItems.filter((_, i) => i !== idx);
      return { ...c, pricingItems: items };
    }));
  };

  const handleAddPricing = (catId) => {
    setCats((prev) => prev.map((c) => {
      if (c.id !== catId) return c;
      return {
        ...c,
        pricingItems: [...c.pricingItems, { name: 'Hạng mục mới', minPrice: 100000, maxPrice: 300000 }],
      };
    }));
  };

  return (
    <div className="services-page">
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý Dịch vụ</h1>
          <p className="page-subtitle">Danh mục dịch vụ, bảng giá tham khảo và cấu hình hoa hồng</p>
        </div>
        <div className="services-summary">
          <div className="summary-chip">
            <span>{cats.filter((c) => c.isActive).length}</span> Đang hoạt động
          </div>
          <div className="summary-chip inactive-chip">
            <span>{cats.filter((c) => !c.isActive).length}</span> Đã tắt
          </div>
        </div>
      </div>

      <div className="category-list">
        {cats.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onToggle={handleToggle}
            onUpdateComm={handleUpdateComm}
            onUpdatePricing={handleUpdatePricing}
            onDeletePricing={handleDeletePricing}
            onAddPricing={handleAddPricing}
          />
        ))}
      </div>
    </div>
  );
};

export default Services;
