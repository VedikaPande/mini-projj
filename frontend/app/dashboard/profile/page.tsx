"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Calendar, Shield, Bell, Palette, Save, Edit3 } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    bio: "Psychology student passionate about mental health awareness and helping others on their wellness journey.",
    joinDate: "January 2024",
    notifications: {
      dailyReminders: true,
      weeklyReports: true,
      quizUpdates: false,
    },
    privacy: {
      profileVisible: false,
      shareProgress: true,
    },
  })

  const handleSave = () => {
    // Here you would typically save to a database
    console.log("Profile updated:", formData)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }))
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value },
    }))
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-lg text-muted-foreground">Manage your account and preferences</p>
          </div>
          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center space-y-4">
                <Avatar className="w-24 h-24 mx-auto bg-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                    {formData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{formData.name}</CardTitle>
                  <CardDescription className="mt-1">{formData.email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Joined {formData.joinDate}
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Activity Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mood entries</span>
                      <Badge variant="secondary">47</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quizzes completed</span>
                      <Badge variant="secondary">3</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Chat sessions</span>
                      <Badge variant="secondary">12</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details and bio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      disabled={!isEditing}
                      className="bg-background border-border/60 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      disabled={!isEditing}
                      className="bg-background border-border/60 focus:border-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    disabled={!isEditing}
                    className="bg-background border-border/60 focus:border-primary min-h-20"
                    placeholder="Tell us a bit about yourself..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose what notifications you'd like to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Daily Mood Reminders</Label>
                    <p className="text-xs text-muted-foreground">Get reminded to log your daily mood</p>
                  </div>
                  <Switch
                    checked={formData.notifications.dailyReminders}
                    onCheckedChange={(value) => handleNotificationChange("dailyReminders", value)}
                    disabled={!isEditing}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Weekly Progress Reports</Label>
                    <p className="text-xs text-muted-foreground">Receive weekly summaries of your progress</p>
                  </div>
                  <Switch
                    checked={formData.notifications.weeklyReports}
                    onCheckedChange={(value) => handleNotificationChange("weeklyReports", value)}
                    disabled={!isEditing}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">New Quiz Notifications</Label>
                    <p className="text-xs text-muted-foreground">Get notified when new quizzes are available</p>
                  </div>
                  <Switch
                    checked={formData.notifications.quizUpdates}
                    onCheckedChange={(value) => handleNotificationChange("quizUpdates", value)}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>Control your privacy and data sharing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Public Profile</Label>
                    <p className="text-xs text-muted-foreground">Make your profile visible to other users</p>
                  </div>
                  <Switch
                    checked={formData.privacy.profileVisible}
                    onCheckedChange={(value) => handlePrivacyChange("profileVisible", value)}
                    disabled={!isEditing}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Share Progress Data</Label>
                    <p className="text-xs text-muted-foreground">Allow anonymized data to help improve our services</p>
                  </div>
                  <Switch
                    checked={formData.privacy.shareProgress}
                    onCheckedChange={(value) => handlePrivacyChange("shareProgress", value)}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Account Actions
                </CardTitle>
                <CardDescription>Manage your account settings and data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="bg-transparent">
                    Export My Data
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    Change Password
                  </Button>
                  <Button variant="destructive" className="sm:ml-auto">
                    Delete Account
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Need help? Contact our support team for assistance with your account.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
