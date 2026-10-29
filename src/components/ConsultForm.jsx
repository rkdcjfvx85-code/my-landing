import { useState } from 'react'
import { FILE_BUCKET, supabase } from '../lib/supabase'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const CATEGORIES = ['개인회생', '개인파산', '채무조정', '잘 모르겠음']
const DEBT_AMOUNTS = ['3천만원 미만', '3천만원 ~ 5천만원', '5천만원 ~ 1억원', '1억원 ~ 3억원', '3억원 이상']

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  category: CATEGORIES[0],
  debt_amount: DEBT_AMOUNTS[0],
  content: '',
  agree_privacy: false,
}

export default function ConsultForm() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  function update(key) {
    return (e) => setForm({ ...form, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  }

  function handleFileChange(e) {
    const selected = e.target.files[0]
    if (selected && selected.size > MAX_FILE_SIZE) {
      setError('첨부파일은 10MB 이하만 가능합니다.')
      e.target.value = ''
      return
    }
    setError('')
    setFile(selected ?? null)
  }

  async function uploadFile() {
    // Storage 경로에는 한글을 쓸 수 없어 시간값+임의값으로 저장하고, 원래 이름은 file_name에 보관
    const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : 'bin'
    const path = `consultations/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from(FILE_BUCKET).upload(path, file)
    if (error) throw new Error('파일 업로드에 실패했습니다. 파일 없이 다시 시도해 주세요.')
    return { file_path: path, file_name: file.name }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const phone = form.phone.replace(/\s/g, '')
    if (!/^[0-9-]{9,15}$/.test(phone)) {
      setError('연락처를 숫자로 정확히 입력해 주세요. (예: 010-1234-5678)')
      return
    }
    if (!form.agree_privacy) {
      setError('개인정보 수집 및 이용에 동의해 주세요.')
      return
    }
    setSubmitting(true)
    try {
      const fileFields = file ? await uploadFile() : {}
      // 방문자는 조회 권한이 없으므로 결과를 돌려받지 않고 저장만 함
      const { error } = await supabase.from('consultations').insert({
        ...form,
        name: form.name.trim(),
        phone,
        email: form.email.trim() || null,
        ...fileFields,
      })
      if (error) throw new Error('신청 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.')
      setDone(true)
      setForm(EMPTY_FORM)
      setFile(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div id="apply" className="consult-card consult-done">
        <span className="done-icon">✓</span>
        <h2>상담 신청이 접수되었습니다</h2>
        <p>담당 변호사가 내용을 검토한 후 영업일 기준 24시간 내에 입력하신 연락처로 연락드리겠습니다.</p>
        <button type="button" className="btn btn-outline" onClick={() => setDone(false)}>
          새 신청서 작성
        </button>
      </div>
    )
  }

  return (
    <form id="apply" className="consult-card" onSubmit={handleSubmit}>
      <h2>무료 상담 신청</h2>
      <p className="consult-sub">로그인 없이 바로 신청하실 수 있습니다</p>

      <div className="field-row">
        <label className="field">
          <span>이름 *</span>
          <input value={form.name} onChange={update('name')} placeholder="홍길동" maxLength={50} required />
        </label>
        <label className="field">
          <span>연락처 *</span>
          <input type="tel" value={form.phone} onChange={update('phone')} placeholder="010-1234-5678" maxLength={15} required />
        </label>
      </div>
      <label className="field">
        <span>이메일 (선택)</span>
        <input type="email" value={form.email} onChange={update('email')} placeholder="example@email.com" maxLength={100} />
      </label>
      <div className="field-row">
        <label className="field">
          <span>상담 분야 *</span>
          <select value={form.category} onChange={update('category')}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>총 채무 금액 *</span>
          <select value={form.debt_amount} onChange={update('debt_amount')}>
            {DEBT_AMOUNTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        <span>상담 내용 *</span>
        <textarea
          value={form.content}
          onChange={update('content')}
          rows={4}
          maxLength={5000}
          placeholder="채권자 수, 월 소득, 연체 여부 등 현재 상황을 간단히 적어 주세요."
          required
        />
      </label>
      <label className="field">
        <span>첨부파일 (선택, 10MB 이하)</span>
        <input type="file" onChange={handleFileChange} />
      </label>

      <label className="agree">
        <input type="checkbox" checked={form.agree_privacy} onChange={update('agree_privacy')} />
        <span>
          개인정보 수집 및 이용에 동의합니다. (수집 항목: 이름, 연락처, 이메일, 상담 내용 / 이용 목적: 법률 상담 / 보유 기간:
          상담 종료 후 1년)
        </span>
      </label>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn btn-gold btn-block btn-lg" disabled={submitting}>
        {submitting ? '접수 중...' : '상담 신청하기'}
      </button>
    </form>
  )
}
