"use client"

import type React from "react"

import { Switch, Route } from "wouter"
import { queryClient } from "./lib/queryClient"
import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ThemeProvider } from "@/components/ThemeProvider"
import { ThemeToggle } from "@/components/ThemeToggle"
import NotFound from "@/pages/not-found"
import StaffDashboard from "@/pages/StaffDashboard"
import StudentHome from "@/pages/StudentHome"
import SurveyPage from "@/pages/SurveyPage"
import SupportPage from "@/pages/SupportPage"
import StoryCreate from "@/pages/StoryCreate"
import StoriesPage from "@/pages/StoriesPage"
import AnalyticsPage from "@/pages/AnalyticsPage"
import { useState } from "react"

function Router() {
  return (
    <Switch>
      <Route path="/" component={StudentHome} />
      <Route path="/stories" component={StoriesPage} />
      <Route path="/story/create" component={StoryCreate} />
      <Route path="/support" component={SupportPage} />
      <Route path="/staff/dashboard" component={StaffDashboard} />
      <Route path="/staff/surveys" component={SurveyPage} />
      <Route path="/staff/analytics" component={AnalyticsPage} />
      <Route path="/counselor/analytics" component={AnalyticsPage} />
      <Route component={NotFound} />
    </Switch>
  )
}

function App() {
  const [userRole] = useState<"student" | "staff" | "parent" | "counselor">("staff")

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar userRole={userRole} />
              <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <ThemeToggle />
                </header>
                <main className="flex-1 overflow-auto p-6 md:p-8">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
