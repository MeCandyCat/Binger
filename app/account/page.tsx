"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { LogOut, Trash2, UserCircle } from "lucide-react"

export default function AccountPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  // Fetch user data on component mount
  useState(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserData(user)
    }
    fetchUserData()
  }, [])

  const handleLogout = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
      toast({
        title: "Error",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setLoading(true)
      // Delete user data from your tables first
      const userId = userData?.id
      await supabase.from('user_data').delete().match({ user_id: userId })
      
      // Then delete the auth account
      await supabase.auth.admin.deleteUser(userId)
      
      toast({
        title: "Account deleted",
        description: "Your account and all associated data have been deleted.",
      })
      router.push("/login")
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        title: "Error",
        description: "An error occurred while deleting your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePrivacyToggle = async () => {
    try {
      setLoading(true)
      await supabase
        .from('user_settings')
        .upsert({ 
          user_id: userData?.id, 
          is_public: !isPublic 
        })
      
      setIsPublic(!isPublic)
      toast({
        title: "Settings updated",
        description: `Your profile is now ${!isPublic ? "public" : "private"}.`,
      })
    } catch (error) {
      console.error("Error updating privacy settings:", error)
      toast({
        title: "Error",
        description: "An error occurred while updating your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <UserCircle className="h-6 w-6" />
            Account Settings
          </CardTitle>
          <CardDescription>
            Manage your account preferences and Discord connection
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Discord Profile Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Discord Profile</h3>
            <div className="flex items-center space-x-4">
              <img
                src={userData?.user_metadata?.avatar_url}
                alt="Discord Avatar"
                className="h-16 w-16 rounded-full"
              />
              <div>
                <p className="font-medium">{userData?.user_metadata?.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {userData?.user_metadata?.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  Discord ID: {userData?.user_metadata?.sub}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Privacy Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Privacy Settings</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public-profile">Public Profile</Label>
                <p className="text-sm text-muted-foreground">
                  Allow others to view your collection and profile.
                </p>
              </div>
              <Switch
                id="public-profile"
                checked={isPublic}
                onCheckedChange={handlePrivacyToggle}
                disabled={loading}
              />
            </div>
          </div>

          <Separator />

          {/* Danger Zone */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleLogout}
                disabled={loading}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={loading}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove all of your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}