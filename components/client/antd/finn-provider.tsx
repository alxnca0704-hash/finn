"use client"

import * as React from "react"
import { ConfigProvider } from "antd"

const finnTheme = {
  token: {
    colorPrimary: "var(--accent-primary)",
    colorText: "var(--text-primary)",
    colorTextSecondary: "var(--text-muted)",
    colorTextHeading: "var(--text-primary)",
    colorBorder: "var(--border-default)",
    colorBgContainer: "var(--bg-surface)",
    colorBgElevated: "var(--bg-base)",
    colorError: "var(--state-error)",
    colorSuccess: "var(--state-success)",
    fontFamily: "var(--font-sans)",
    controlHeightLG: 44,
    borderRadius: 8,
    borderRadiusLG: 16,
  },
}

function FinnAntProvider({ children }: { children: React.ReactNode }) {
  return <ConfigProvider theme={finnTheme}>{children}</ConfigProvider>
}

export { FinnAntProvider, finnTheme }
