"use server"

import FooterComponent from "@/components/common/layout/footer"
import HeaderComponent from "@/components/common/layout/header"
import { getLoginCookies } from "../action"
import { redirect } from "next/navigation"
import BaseLayout from "@/components/common/layout/base.layout"

interface AppLayoutProps {
    children: React.ReactNode
}

export default async function AppLayout(props: AppLayoutProps) {
    const userData = await getLoginCookies()

    if (!userData) {
        redirect("/login")
    }

    return (
        <BaseLayout userData={userData}>
            {props.children}
        </BaseLayout>
    )
}