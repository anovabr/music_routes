export default function ShortcutsModal({ onClose }) {
  const shortcuts = [
    { key: 'Ctrl + K  or  /', label: 'Open composer search' },
    { key: '↑ / ↓', label: 'Navigate search results' },
    { key: 'Enter', label: 'Select first search result' },
    { key: 'Escape', label: 'Close video / search / sidebar' },
    { key: '?', label: 'Show this shortcuts panel' },
    { key: 'Scroll on tree', label: 'Zoom lineage tree (hold Ctrl)' },
    { key: 'Drag on tree', label: 'Pan the lineage tree' },
  ];

  return (
    <div className="shortcuts-overlay" onClick={onClose}>
      <div className="shortcuts-modal" onClick={e => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h2 className="shortcuts-title">Keyboard Shortcuts</h2>
          <button className="shortcuts-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <ul className="shortcuts-list">
          {shortcuts.map(({ key, label }) => (
            <li key={key} className="shortcuts-item">
              <kbd className="shortcuts-key">{key}</kbd>
              <span className="shortcuts-label">{label}</span>
            </li>
          ))}
        </ul>
        <p className="shortcuts-footer">Press <kbd>Escape</kbd> or click outside to close</p>
      </div>
    </div>
  );
}
