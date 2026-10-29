import ConsultForm from './ConsultForm'

const POINTS = ['채무 전문 변호사 직접 검토', '상담 내용 철저한 비밀 보장', '로그인 없이 1분 만에 신청']

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">개인회생 · 개인파산 · 채무조정</p>
          <h1>
            감당하기 어려운 빚,
            <br />
            <em>법으로 정리</em>할 수 있습니다
          </h1>
          <p className="hero-desc">
            늘어나는 이자와 독촉 전화로 힘드셨나요? YN 변호사 사무실이 현재 상황을 꼼꼼히 검토하고, 가장 알맞은
            채무 해결 방법을 안내해 드립니다.
          </p>
          <ul className="hero-points">
            {POINTS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <ConsultForm />
      </div>
    </section>
  )
}
