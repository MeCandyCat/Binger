"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { DiscIcon as Discord, QrCode ,Shield ,Users  } from "lucide-react"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (provider?: "discord") => {
    try {
      setLoading(true)
      let result

      if (provider === "discord") {
        result = await supabase?.auth.signInWithOAuth({ provider: "discord" })
      }

      if (result?.error) throw result.error

      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      })
      router.push("/")
    } catch (error) {
      console.error("Error logging in:", error)
      toast({
        title: "Error",
        description: "An error occurred while logging in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
    <Card className="w-[380px] border-2 border-[#5865F2]/20 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Login to Binger</CardTitle>
        <CardDescription className="text-center">
          Connect your Discord account to unlock personalized features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col items-center p-4 bg-discord-100 rounded-lg">
            <QrCode className="h-8 w-8 text-[#5865F2] mb-2" />
            <p className="text-sm font-medium text-center">Quick Login</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-discord-100 rounded-lg">
            <Shield className="h-8 w-8 text-[#5865F2] mb-2" />
            <p className="text-sm font-medium text-center">Secure Access</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-discord-100 rounded-lg">
            <Users className="h-8 w-8 text-[#5865F2] mb-2" />
            <p className="text-sm font-medium text-center">Profile Sync</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-discord-100 rounded-lg">
            <Discord className="h-8 w-8 text-[#5865F2] mb-2" />
            <p className="text-sm font-medium text-center">Direct Connect</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-[#5865F2] hover:bg-[#5865F2]/90 text-white" 
          onClick={() => handleLogin("discord")} 
          disabled={loading}
        >
          <Discord className="mr-2 h-5 w-5" />
          Continue with Discord
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}

