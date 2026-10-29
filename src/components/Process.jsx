const STEPS = [
  { title: '신청서 작성', desc: '홈페이지에서 간단한 상담 신청서를 작성합니다.' },
  { title: '변호사 검토', desc: '담당 변호사가 채무 상황을 꼼꼼히 검토합니다.' },
  { title: '전화 상담', desc: '영업일 기준 24시간 내에 전화로 연락드립니다.' },
  { title: '맞춤 해결 안내', desc: '가장 유리한 해결 방법과 진행 계획을 안내합니다.' },
]

export default function Process() {
  return (
    <section id="process" className="section section-navy">
      <div className="container">
        <p className="section-eyebrow">PROCESS</p>
        <h2 className="section-title">상담 진행 절차</h2>
        <p className="section-desc">신청부터 해결 안내까지 4단계로 진행됩니다.</p>

        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="step">
              <span className="step-num">STEP {String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </li>
          ))}
        </ol>

        <div className="process-cta">
          <button
            type="button"
            className="btn btn-gold btn-lg"
            onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            지금 무료 상담 신청하기
          </button>
        </div>
      </div>
    </section>
  )
}
