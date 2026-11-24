import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { DashboardSidebar } from '../components/DashboardSidebar';
import { requireRole } from "@/lib/authorization";

const DashboardLayout = async ({children}:{children:React.ReactNode}) => {
    const role = await requireRole();
    return (
       <SidebarProvider>
      <DashboardSidebar role={role} />
      <main className="min-w-0 flex-1">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
    );
};

export default DashboardLayout;
