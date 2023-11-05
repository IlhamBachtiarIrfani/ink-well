'use client'

import React, { ReactNode, createContext, useContext, useState } from 'react'
import HeaderComponent from './header'
import FooterComponent from './footer'
import { UserData } from '@/entities/user.entity'

type LayoutContextType = {
    setHeaderActions: (actions: ReactNode) => void;
};

const LayoutContext = createContext<LayoutContextType>({
    setHeaderActions: () => {},
});

export const useLayout = () => useContext<LayoutContextType>(LayoutContext);

interface BaseLayoutProps {
    userData?: UserData | null
    children: ReactNode
}

export default function BaseLayout(props: BaseLayoutProps) {
    const [headerActionsNode, setHeaderActionsNode] = useState<ReactNode>(null)

    const setHeaderActions = (actions: ReactNode) => {
        setHeaderActionsNode(actions)
    };

    return (
        <LayoutContext.Provider value={{ setHeaderActions }} >
            <div className="flex flex-col min-h-screen">
                <HeaderComponent userData={props.userData ? props.userData : null} actions={headerActionsNode} />
                <div className='grow flex-1 flex flex-col justify-start'>
                    {props.children}
                </div>
                <FooterComponent />
            </div>
        </LayoutContext.Provider>
    )
}
