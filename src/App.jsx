import { useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import CasePanorama from './components/CasePanorama'
import PracticeAreas from './components/PracticeAreas'
import Process from './components/Process'
import Footer from './components/Footer'
import AdminPage from './components/AdminPage'

// GitHub Pages는 서버 라우팅이 없으므로 주소 끝의 #admin 으로 관리자 화면을 구분
function useIsAdminRoute() {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin')

  useEffect(() => {
    const onHashChange = () => {
      setIsAdmin(window.location.hash === '#admin')
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return isAdmin
}

export default function App() {
  const isAdmin = useIsAdminRoute()

  if (isAdmin) {
    return (
      <>
        <main>
          <AdminPage />
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <CasePanorama />
        <PracticeAreas />
        <Process />
      </main>
      <Footer />
    </>
  )
}
