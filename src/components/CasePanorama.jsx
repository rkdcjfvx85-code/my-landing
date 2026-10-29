const CASES = [
  { category: '개인회생', person: '회사원 · 30대', debt: '8,200만원', repay: '1,940만원', rate: 76 },
  { category: '개인파산', person: '무직 · 60대', debt: '1억 2,000만원', repay: '0원', rate: 100 },
  { category: '채무조정', person: '자영업 · 40대', debt: '5,600만원', repay: '2,800만원', rate: 50 },
  { category: '개인회생', person: '프리랜서 · 20대', debt: '4,300만원', repay: '1,080만원', rate: 75 },
  { category: '개인회생', person: '공무원 · 40대', debt: '1억 5,000만원', repay: '4,320만원', rate: 71 },
  { category: '개인파산', person: '주부 · 50대', debt: '9,800만원', repay: '0원', rate: 100 },
  { category: '채무조정', person: '회사원 · 20대', debt: '3,100만원', repay: '1,550만원', rate: 50 },
  { category: '개인회생', person: '자영업 · 50대', debt: '2억 3,000만원', repay: '6,900만원', rate: 70 },
]

function CaseCard({ item }) {
  return (
    <article className="case-card">
      <div className="case-top">
        <span className="case-tag">{item.category}</span>
        <span className="case-person">{item.person}</span>
      </div>
      <dl className="case-numbers">
        <div>
          <dt>총 채무</dt>
          <dd>{item.debt}</dd>
        </div>
        <div>
          <dt>변제 금액</dt>
          <dd>{item.repay}</dd>
        </div>
      </dl>
      <div className="case-rate">
        <span>탕감률</span>
        <strong>{item.rate}%</strong>
      </div>
      <div className="case-bar">
        <span style={{ width: `${item.rate}%` }} />
      </div>
    </article>
  )
}

export default function CasePanorama() {
  return (
    <section id="cases" className="section section-soft">
      <div className="container">
        <p className="section-eyebrow">CASES</p>
        <h2 className="section-title">탕감 사례</h2>
        <p className="section-desc">비슷한 상황의 분들이 이렇게 새 출발을 하셨습니다.</p>
      </div>

      {/* 같은 목록을 두 번 이어 붙여 끊김 없이 흐르게 하고, 복제본은 스크린리더에서 숨김 */}
      <div className="marquee">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="marquee-group" aria-hidden={copy === 1}>
              {CASES.map((c, i) => (
                <CaseCard key={i} item={c} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        <p className="notice">
          ※ 위 사례는 이해를 돕기 위한 예시 사례이며, 실제 결과는 개인의 소득·재산·채무 상황에 따라 다를 수 있습니다.
        </p>
      </div>
    </section>
  )
}
