"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calendar, TrendingUp, Smile, Meh, Frown, Heart, Plus } from "lucide-react"

// Dummy mood data for the chart
const moodData = [
  { date: "Jan 15", mood: 7, label: "Good" },
  { date: "Jan 16", mood: 5, label: "Okay" },
  { date: "Jan 17", mood: 8, label: "Great" },
  { date: "Jan 18", mood: 6, label: "Good" },
  { date: "Jan 19", mood: 4, label: "Low" },
  { date: "Jan 20", mood: 7, label: "Good" },
  { date: "Jan 21", mood: 9, label: "Excellent" },
]

const moodOptions = [
  { value: 1, label: "Very Low", icon: Frown, color: "text-red-500" },
  { value: 2, label: "Low", icon: Frown, color: "text-red-400" },
  { value: 3, label: "Poor", icon: Meh, color: "text-orange-500" },
  { value: 4, label: "Below Average", icon: Meh, color: "text-orange-400" },
  { value: 5, label: "Okay", icon: Meh, color: "text-yellow-500" },
  { value: 6, label: "Good", icon: Smile, color: "text-green-400" },
  { value: 7, label: "Very Good", icon: Smile, color: "text-green-500" },
  { value: 8, label: "Great", icon: Smile, color: "text-green-600" },
  { value: 9, label: "Excellent", icon: Smile, color: "text-blue-500" },
  { value: 10, label: "Amazing", icon: Smile, color: "text-blue-600" },
]

export default function TrackerPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [notes, setNotes] = useState("")

  const handleSubmitMood = () => {
    if (selectedMood) {
      // Here you would typically save to a database
      console.log("Mood submitted:", { mood: selectedMood, notes, date: new Date() })
      setSelectedMood(null)
      setNotes("")
      // Show success message
    }
  }

  const averageMood = moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Well-being Tracker</h1>
          <p className="text-lg text-muted-foreground">
            Monitor your emotional patterns and track your mental health journey over time.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Average Mood
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{averageMood.toFixed(1)}/10</div>
              <p className="text-sm text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Tracking Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">7 days</div>
              <p className="text-sm text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Best Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Jan 21</div>
              <p className="text-sm text-muted-foreground">Excellent mood</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mood Chart */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Mood Trends</CardTitle>
              <CardDescription>Your emotional patterns over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis domain={[0, 10]} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Today's Mood Entry */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">How are you feeling today?</CardTitle>
              <CardDescription>Rate your current mood and add any notes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mood Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Select your mood (1-10)</Label>
                <div className="grid grid-cols-5 gap-2">
                  {moodOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <Button
                        key={option.value}
                        variant={selectedMood === option.value ? "default" : "outline"}
                        className={`h-12 flex flex-col gap-1 ${
                          selectedMood === option.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-transparent hover:bg-accent"
                        }`}
                        onClick={() => setSelectedMood(option.value)}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs">{option.value}</span>
                      </Button>
                    )
                  })}
                </div>
                {selectedMood && (
                  <Badge variant="secondary" className="w-fit">
                    {moodOptions.find((opt) => opt.value === selectedMood)?.label}
                  </Badge>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Notes (optional)
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What's on your mind? Any specific events or feelings you'd like to note..."
                  className="bg-background border-border/60 focus:border-primary min-h-20"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitMood}
                disabled={!selectedMood}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Log Today's Mood
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Entries */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Recent Entries</CardTitle>
            <CardDescription>Your mood history and notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moodData
                .slice(-5)
                .reverse()
                .map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{entry.mood}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{entry.label}</p>
                        <p className="text-sm text-muted-foreground">{entry.date}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{entry.mood}/10</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
