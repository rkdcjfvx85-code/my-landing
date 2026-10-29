import { useState } from 'react'

const MENUS = [
  { id: 'cases', label: '탕감 사례' },
  { id: 'areas', label: '업무 분야' },
  { id: 'process', label: '진행 절차' },
  { id: 'apply', label: '상담 신청' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  function scrollTo(id) {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <button type="button" className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="logo-mark">YN</span>
          <span className="logo-text">
            YN 변호사 사무실
            <small>채무탕감 신청 접수</small>
          </span>
        </button>

        <button
          type="button"
          className="menu-toggle"
          aria-label="메뉴 열기"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav ${open ? 'nav-open' : ''}`}>
          {MENUS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={m.id === 'apply' ? 'nav-cta' : 'nav-link'}
              onClick={() => scrollTo(m.id)}
            >
              {m.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
