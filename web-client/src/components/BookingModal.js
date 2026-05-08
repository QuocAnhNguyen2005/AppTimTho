import { useState } from 'react';

export default function BookingModal({ worker, user, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    scheduled_time: '',
    address: user?.address || '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.scheduled_time) newErrors.scheduled_time = 'Vui lòng chọn ngày giờ mong muốn';
    else if (new Date(formData.scheduled_time) < new Date()) newErrors.scheduled_time = 'Ngày giờ không được trong quá khứ';

    if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ chính xác';
    if (!formData.description.trim()) newErrors.description = 'Vui lòng mô tả chi tiết tình trạng hỏng hóc';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          worker_id: worker.id,
          customer_id: user.id,
          scheduled_time: formData.scheduled_time,
          address: formData.address,
          description: formData.description,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Đặt thợ thất bại');
      }

      onSuccess();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-secondary)', borderRadius: '20px',
        width: '100%', maxWidth: '500px', overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
        animation: 'slideUp 0.3s ease-out',
      }}>
        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .form-group { margin-bottom: 20px; }
          .form-label { display: block; font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
          .form-input { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1.5px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-family: inherit; font-size: 14px; outline: none; transition: border-color 0.2s; }
          .form-input:focus { border-color: var(--accent-primary); }
          .form-error { color: #EF4444; font-size: 12px; margin-top: 6px; font-weight: 500; }
        `}</style>

        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Xác nhận đặt thợ</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Bạn đang đặt lịch với <strong style={{ color: 'var(--accent-primary)' }}>{worker.full_name}</strong></p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-secondary)' }}>×</button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '24px' }}>
          {errors.submit && (
            <div style={{ padding: '12px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', fontWeight: '600' }}>
              ⚠️ {errors.submit}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Ngày và giờ mong muốn ⏰</label>
            <input
              type="datetime-local"
              className="form-input"
              value={formData.scheduled_time}
              onChange={e => setFormData({ ...formData, scheduled_time: e.target.value })}
            />
            {errors.scheduled_time && <div className="form-error">{errors.scheduled_time}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Địa chỉ chính xác 📍</label>
            <input
              type="text"
              placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện..."
              className="form-input"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
            {errors.address && <div className="form-error">{errors.address}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả tình trạng hỏng hóc 📝</label>
            <textarea
              rows="4"
              placeholder="Vui lòng mô tả chi tiết vấn đề (ví dụ: điều hòa kêu to, chảy nước, không mát...)"
              className="form-input"
              style={{ resize: 'vertical' }}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
            {errors.description && <div className="form-error">{errors.description}</div>}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 24px', backgroundColor: 'var(--bg-primary)', display: 'flex', gap: '12px', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'none', border: '1.5px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: '700', cursor: 'pointer' }}>
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
              backgroundColor: 'var(--accent-primary)', color: 'white', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}>
            {loading ? 'Đang xử lý...' : 'Xác nhận đặt thợ'}
          </button>
        </div>
      </div>
    </div>
  );
}
