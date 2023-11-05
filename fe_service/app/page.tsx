"use server"

import { getLoginCookies } from "./action"
import BaseLayout from "@/components/common/layout/base.layout"
import HomeComponent from "./home"

export default async function Home() {
  const userData = await getLoginCookies()
  return (
    <BaseLayout userData={userData}>
      <HomeComponent userData={userData} />
    </BaseLayout>
  )
}
