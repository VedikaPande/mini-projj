"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Clock, Users, Award, ArrowRight, CheckCircle, Play, AlertCircle } from "lucide-react"
import Link from "next/link"
import quizService from "@/services/quiz"
import { useToast } from "@/components/ui/use-toast"
import { getToken } from "@/services/auth"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Fallback quiz icon mapping
const IconMap = {
  default: Brain
};

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true)
        // Check if token exists
        const token = getToken()
        if (!token) {
          console.error("No auth token found")
          setAuthError(true)
          return
        }
        
        const response = await quizService.getAllQuizzes()
        if (response.success) {
          setQuizzes(response.data.map((quiz: any) => ({
            ...quiz,
            icon: Brain, // Using Brain icon for all quizzes
            color: getRandomColor(), // Assign a random color
          })))
        }
      } catch (error: any) {
        console.error("Failed to fetch quizzes:", error)
        // Check if it's an authentication error
        if (error.response && error.response.status === 401) {
          setAuthError(true)
        } else {
          toast({
            title: "Error",
            description: "Failed to load quizzes. Please try again later.",
            variant: "destructive",
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [toast, router])

  // Function to get a random color
  const getRandomColor = () => {
    const colors = [
      "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-indigo-500", 
      "bg-orange-500", "bg-teal-500", "bg-pink-500", "bg-red-500"
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Extract unique categories from quizzes
  const categories = ["All", ...Array.from(new Set(quizzes.map(quiz => quiz.category)))]

  const filteredQuizzes =
    selectedCategory === "All" ? quizzes : quizzes.filter((quiz) => quiz.category === selectedCategory)

  const completedQuizzes = quizzes.filter((quiz) => quiz.completed).length
  const averageScore = quizzes.filter((quiz) => quiz.completed && quiz.score !== null).length > 0
    ? Math.round(quizzes.filter((quiz) => quiz.completed && quiz.score !== null).reduce((sum, quiz) => sum + (quiz.score || 0), 0) /
      quizzes.filter((quiz) => quiz.completed && quiz.score !== null).length)
    : 0

  // Calculate estimated time invested based on completed quizzes
  const timeInvested = completedQuizzes * 7 // Rough estimate: 7 minutes per quiz

  if (authError) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            Your session has expired or you are not logged in. Please sign in again to access this page.
          </AlertDescription>
        </Alert>
        <Button asChild>
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Mental Health Quizzes</h1>
          <p className="text-lg text-muted-foreground">Loading quizzes...</p>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="h-5 w-24 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="h-12 w-12 bg-muted animate-pulse rounded-xl mb-4"></div>
                <div className="h-6 w-full bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-16 w-full bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-24 w-full bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Mental Health Quizzes</h1>
          <p className="text-lg text-muted-foreground">
            Explore interactive quizzes to increase your mental health awareness and learn new skills.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {completedQuizzes}/{quizzes.length}
              </div>
              <p className="text-sm text-muted-foreground">Quizzes finished</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Award className="w-4 h-4" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{averageScore.toFixed(0)}%</div>
              <p className="text-sm text-muted-foreground">Great progress!</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time Invested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{timeInvested} min</div>
              <p className="text-sm text-muted-foreground">Learning time</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category ? "bg-primary text-primary-foreground" : "bg-transparent hover:bg-accent"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Quiz Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const Icon = quiz.icon
            return (
              <Card
                key={quiz.id}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group"
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 ${quiz.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {quiz.completed && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{quiz.title}</CardTitle>
                    <CardDescription className="mt-2 leading-relaxed">{quiz.description}</CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {quiz.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {quiz.questions} questions
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {quiz.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {quiz.difficulty}
                    </Badge>
                  </div>

                  {quiz.completed && quiz.score && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Your Score</span>
                        <span className="font-medium text-foreground">{quiz.score}%</span>
                      </div>
                      <Progress value={quiz.score} className="h-2" />
                    </div>
                  )}

                  <Link href={`/dashboard/quizzes/${quiz.id}`}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      {quiz.completed ? (
                        <>
                          <Award className="w-4 h-4 mr-2" />
                          Review Results
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Quiz
                        </>
                      )}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Learning Resources */}
        <Card className="border-border/50 bg-gradient-to-r from-primary/5 to-accent/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Why Take Mental Health Quizzes?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-2">Self-Awareness</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Gain insights into your mental health patterns, triggers, and strengths through structured
                  assessments.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Learn New Skills</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Discover evidence-based techniques for managing stress, anxiety, and improving overall well-being.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Track Progress</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Monitor your growth and understanding over time with retakeable assessments and progress tracking.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Personalized Insights</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Receive tailored recommendations and resources based on your quiz results and learning preferences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
