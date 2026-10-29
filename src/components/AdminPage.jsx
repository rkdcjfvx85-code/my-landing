import { useEffect, useState } from 'react'
import { FILE_BUCKET, supabase } from '../lib/supabase'

const STATUSES = ['접수', '상담중', '완료']
const FILTERS = ['전체', ...STATUSES]

function formatDate(value) {
  return new Date(value).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' })
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    setLoading(false)
  }

  return (
    <form className="consult-card admin-login" onSubmit={handleSubmit}>
      <h2>관리자 로그인</h2>
      <p className="consult-sub">접수된 상담 신청은 관리자만 확인할 수 있습니다</p>
      <label className="field">
        <span>이메일</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
      </label>
      <label className="field">
        <span>비밀번호</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="btn btn-gold btn-block" disabled={loading}>
        {loading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}

function EntryCard({ entry, onStatusChange }) {
  const [opening, setOpening] = useState(false)

  async function openFile() {
    // 비공개 버킷이므로 1분짜리 임시 주소를 만들어 새 창으로 열기
    setOpening(true)
    const { data, error } = await supabase.storage.from(FILE_BUCKET).createSignedUrl(entry.file_path, 60)
    setOpening(false)
    if (error) return alert('첨부파일을 열 수 없습니다.')
    window.open(data.signedUrl, '_blank', 'noopener')
  }

  return (
    <article className={`entry-card entry-${STATUSES.indexOf(entry.status)}`}>
      <header className="entry-head">
        <div>
          <span className="entry-no">No. {entry.id}</span>
          <h3>{entry.name}</h3>
        </div>
        <select
          className="entry-status"
          value={entry.status}
          onChange={(e) => onStatusChange(entry.id, e.target.value)}
          aria-label="처리 상태"
        >
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </header>

      <div className="entry-tags">
        <span>{entry.category}</span>
        <span>{entry.debt_amount}</span>
      </div>

      <p className="entry-content">{entry.content}</p>

      <footer className="entry-foot">
        <div className="entry-contact">
          <a href={`tel:${entry.phone}`}>{entry.phone}</a>
          {entry.email && <a href={`mailto:${entry.email}`}>{entry.email}</a>}
        </div>
        <div className="entry-meta">
          {entry.file_path && (
            <button type="button" className="entry-file" onClick={openFile} disabled={opening}>
              📎 {entry.file_name || '첨부파일'}
            </button>
          )}
          <time>{formatDate(entry.created_at)}</time>
        </div>
      </footer>
    </article>
  )
}

function EntryList({ session }) {
  const [entries, setEntries] = useState([])
  const [filter, setFilter] = useState('전체')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: isAdmin } = await supabase.rpc('is_admin')
      if (!isAdmin) {
        setError('관리자 권한이 없는 계정입니다.')
        setLoading(false)
        return
      }
      const { data, error } = await supabase.from('consultations').select('*').order('created_at', { ascending: false })
      if (error) setError('신청 목록을 불러오지 못했습니다.')
      else setEntries(data)
      setLoading(false)
    }
    load()
  }, [])

  async function handleStatusChange(id, status) {
    const { error } = await supabase.from('consultations').update({ status }).eq('id', id)
    if (error) return alert('상태 변경에 실패했습니다.')
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)))
  }

  const visible = filter === '전체' ? entries : entries.filter((e) => e.status === filter)

  return (
    <div className="admin-board">
      <div className="admin-top">
        <div>
          <h2>상담 신청 방명록</h2>
          <p>{session.user.email} 님으로 로그인됨</p>
        </div>
        <button type="button" className="btn btn-outline" onClick={() => supabase.auth.signOut()}>
          로그아웃
        </button>
      </div>

      {loading && <p className="admin-empty">불러오는 중...</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="admin-filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={filter === f ? 'active' : ''}
                onClick={() => setFilter(f)}
              >
                {f} {f === '전체' ? entries.length : entries.filter((e) => e.status === f).length}
              </button>
            ))}
          </div>
          {visible.length === 0 ? (
            <p className="admin-empty">해당하는 신청이 없습니다.</p>
          ) : (
            <div className="entry-list">
              {visible.map((e) => (
                <EntryCard key={e.id} entry={e} onStatusChange={handleStatusChange} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function AdminPage() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  return (
    <section className="admin">
      <div className="container">
        <a className="admin-back" href="#">
          ← 홈페이지로 돌아가기
        </a>
        {session === undefined ? null : session ? <EntryList key={session.user.id} session={session} /> : <LoginForm />}
      </div>
    </section>
  )
}
