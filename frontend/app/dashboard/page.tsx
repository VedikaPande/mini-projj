import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, TrendingUp, Brain, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-lg text-muted-foreground">
            How are you feeling today? Let's continue your mental health journey.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">5 days</div>
              <p className="text-sm text-muted-foreground">Mood tracking streak</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">12</div>
              <p className="text-sm text-muted-foreground">AI conversations</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">3/5</div>
              <p className="text-sm text-muted-foreground">Quizzes completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Start a Conversation</CardTitle>
                <CardDescription>
                  Chat with our AI assistant for immediate emotional support and guidance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/chatbot">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Open Chatbot
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Track Your Mood</CardTitle>
                <CardDescription>
                  Log how you're feeling today and monitor your emotional patterns over time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/tracker">
                  <Button variant="outline" className="w-full bg-transparent">
                    Open Tracker
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Take a Quiz</CardTitle>
                <CardDescription>
                  Explore interactive quizzes to learn more about mental health and self-awareness.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/quizzes">
                  <Button variant="outline" className="w-full bg-transparent">
                    Browse Quizzes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Daily Inspiration */}
        <Card className="border-border/50 bg-gradient-to-r from-primary/5 to-accent/10 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Daily Inspiration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <blockquote className="text-lg text-foreground font-medium italic">
              "You are braver than you believe, stronger than you seem, and smarter than you think."
            </blockquote>
            <p className="text-sm text-muted-foreground mt-2">— A.A. Milne</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
