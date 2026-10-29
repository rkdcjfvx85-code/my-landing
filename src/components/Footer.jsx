const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-logo">YN 변호사 사무실</p>
          <p>채무탕감 신청 접수 | 개인회생 · 개인파산 · 채무조정</p>
        </div>
        {/* ※ 아래 사무실 정보는 예시입니다. 실제 정보로 바꿔서 사용하세요. */}
        <div className="footer-info">
          <p>대표 변호사 홍길동 | 사업자등록번호 000-00-00000</p>
          <p>주소 서울특별시 서초구 법원로 00 | 대표전화 02-000-0000</p>
          <p>본 사이트의 내용은 일반적인 정보 제공을 위한 것이며 법률 자문을 대신하지 않습니다.</p>
        </div>
      </div>
      <div className="container">
        <p className="copyright">© {YEAR} YN Law Office. All rights reserved.</p>
      </div>
    </footer>
  )
}
