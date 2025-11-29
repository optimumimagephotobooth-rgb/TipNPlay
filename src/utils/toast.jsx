import toast from 'react-hot-toast'

const BASE_OPTIONS = {
  duration: 6000,
  position: 'top-right',
  style: {
    borderRadius: '0.75rem',
    padding: '0.85rem 1.15rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: '#0f172a',
    color: '#f8fafc',
    fontWeight: 500,
    boxShadow: '0 18px 45px rgba(15,23,42,0.6)',
  },
}

const ICONS = {
  success: '✅',
  error: '🚫',
  info: 'ℹ️',
  warning: '⚠️',
}

export const notifySuccess = (message, options = {}) =>
  toast.success(message, { ...BASE_OPTIONS, icon: ICONS.success, ...options })

export const notifyError = (message, options = {}) =>
  toast.error(message, { ...BASE_OPTIONS, icon: ICONS.error, ...options })

export const notifyInfo = (message, options = {}) =>
  toast(message, { ...BASE_OPTIONS, icon: ICONS.info, ...options })

export function guidedToast(message, { type = 'info', actionLabel, onAction, duration } = {}) {
  return toast.custom(
    (t) => (
      <div
        style={{
          ...BASE_OPTIONS.style,
          border: '1px solid rgba(148, 163, 184, 0.3)',
          opacity: t.visible ? 1 : 0,
          transform: t.visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          justifyContent: actionLabel && onAction ? 'space-between' : 'flex-start',
          width: '100%',
        }}
      >
        <span style={{ fontSize: '1.25rem' }}>{ICONS[type] || ICONS.info}</span>
        <div style={{ flex: 1, marginRight: actionLabel && onAction ? '0.75rem' : 0 }}>
          <p style={{ margin: 0 }}>{message}</p>
        </div>
        {actionLabel && onAction && (
          <button
            onClick={() => {
              onAction()
              toast.dismiss(t.id)
            }}
            style={{
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              fontWeight: 600,
              borderRadius: '0.45rem',
              padding: '0.35rem 0.9rem',
              cursor: 'pointer',
            }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    ),
    {
      duration: duration ?? 7000,
      position: 'top-right',
    },
  )
}

export default toast

