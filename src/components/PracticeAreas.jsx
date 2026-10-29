const AREAS = [
  {
    title: '개인회생',
    no: '01',
    desc: '일정한 소득이 있는 분이 3~5년간 일부만 갚으면 나머지 채무를 면제받는 제도입니다.',
    points: ['원금 일부 탕감 가능', '급여 압류·독촉 중지', '직장·재산 유지 가능'],
  },
  {
    title: '개인파산',
    no: '02',
    desc: '소득이나 재산으로 빚을 갚기 어려운 분이 법원 결정으로 채무를 면책받는 제도입니다.',
    points: ['채무 전액 면책 가능', '고령·질병·실직 상황 적합', '면책 후 경제활동 재개'],
  },
  {
    title: '채무조정',
    no: '03',
    desc: '신용회복위원회를 통해 이자 감면, 상환 기간 연장 등으로 부담을 줄이는 제도입니다.',
    points: ['이자·연체이자 감면', '상환 기간 연장', '법원 절차 없이 진행'],
  },
]

export default function PracticeAreas() {
  return (
    <section id="areas" className="section">
      <div className="container">
        <p className="section-eyebrow">PRACTICE AREAS</p>
        <h2 className="section-title">업무 분야</h2>
        <p className="section-desc">상황에 맞는 제도를 변호사가 직접 판단해 안내해 드립니다.</p>

        <div className="area-grid">
          {AREAS.map((a) => (
            <article key={a.title} className="area-card">
              <span className="area-no">{a.no}</span>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
              <ul>
                {a.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
