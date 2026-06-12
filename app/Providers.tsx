import { ThemeProvider } from "next-themes"
import SyncUser from "@/components/SyncUser"

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange>
      <SyncUser />
      {children}
    </ThemeProvider>
  )
}

export default Providers