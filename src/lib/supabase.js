import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase 환경 변수(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)가 설정되지 않았습니다.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// 첨부파일이 저장되는 Storage 버킷 이름
export const FILE_BUCKET = 'post-files'
