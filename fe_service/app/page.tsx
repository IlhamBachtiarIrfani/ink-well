import HeaderComponent from '@/components/common/header'
import { getLoginCookies } from './action'

export default async function Home() {
  const userData = await getLoginCookies()
  
  return (
    <div>
      <HeaderComponent userData={userData} />
    </div>
  )
}
