"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, CheckCircle, Brain, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import QuizResult from "@/components/quiz-result"
import quizService from "@/services/quiz"
import { useToast } from "@/components/ui/use-toast"
import { getToken } from "@/services/auth"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function QuizPage({ params }: { params: { id: string } }) {
  const [quiz, setQuiz] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [authError, setAuthError] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true)
        // Check if token exists
        const token = getToken()
        if (!token) {
          console.error("No auth token found")
          setAuthError(true)
          return
        }
        
        const response = await quizService.getQuizById(params.id)
        if (response.success) {
          setQuiz(response.data)
        }
      } catch (error: any) {
        console.error("Failed to fetch quiz:", error)
        if (error.response && error.response.status === 401) {
          setAuthError(true)
        } else {
          toast({
            title: "Error",
            description: "Failed to load quiz. Please try again later.",
            variant: "destructive",
          })
        }
      } finally {
        setLoading(false)
      }
    }

    const fetchResult = async () => {
      try {
        // Skip if there's no auth token
        if (getToken()) {
          const response = await quizService.getQuizResultById(params.id)
          if (response.success) {
            setResult(response.data)
            setShowResults(true)
          }
        }
      } catch (error: any) {
        // If no result exists, just continue without showing an error
        if (error.response && error.response.status !== 404) {
          console.error("Failed to fetch quiz result:", error)
        }
      }
    }

    fetchQuiz()
    fetchResult()
  }, [params.id, toast, router])
  
  // Add auth error UI
  if (authError) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/dashboard/quizzes"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to quizzes
          </Link>

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
      </div>
    )
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      // Check for auth token before submitting
      if (!getToken()) {
        setAuthError(true)
        return
      }
      
      const response = await quizService.submitQuiz(params.id, answers)
      if (response.success) {
        setResult(response.data)
        setShowResults(true)
      }
    } catch (error: any) {
      console.error("Failed to submit quiz:", error)
      if (error.response && error.response.status === 401) {
        setAuthError(true)
      } else {
        toast({
          title: "Error",
          description: "Failed to submit quiz. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Helper functions for quiz results
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'text-green-600'
      case 'Moderate':
        return 'text-yellow-600'
      case 'High':
        return 'text-red-600'
      default:
        return 'text-foreground'
    }
  }

  const getLevelDescription = (level: string) => {
    switch (level) {
      case 'Low':
        return 'You\'re managing stress well!'
      case 'Moderate':
        return 'Some stress management techniques could help.'
      case 'High':
        return 'Consider speaking with a mental health professional.'
      default:
        return 'Keep monitoring your mental health regularly.'
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/dashboard/quizzes"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to quizzes
          </Link>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
              <CardTitle>Loading Quiz...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  if (showResults && result) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/dashboard/quizzes"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to quizzes
          </Link>

          <QuizResult 
            result={result} 
            quizTitle={quiz?.title || 'Mental Health Quiz'}
            onRetake={() => {
              setCurrentQuestion(0)
              setAnswers({})
              setShowResults(false)
              setResult(null)
            }}
          />
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/dashboard/quizzes"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to quizzes
          </Link>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-8 text-center">
            <CardTitle className="mb-4">Quiz Not Found</CardTitle>
            <CardDescription>The quiz you're looking for doesn't exist or has been removed.</CardDescription>
            <Button className="mt-6" asChild>
              <Link href="/dashboard/quizzes">Back to All Quizzes</Link>
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
  const currentQ = quiz.questions[currentQuestion]
  const currentAnswer = answers[currentQ?._id]

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard/quizzes"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to quizzes
        </Link>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </Badge>
              <div className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</div>
            </div>
            <Progress value={progress} className="mb-4" />
            <CardTitle className="text-xl">{quiz.title}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-foreground leading-relaxed">{currentQ.question}</h2>

              <RadioGroup
                value={currentAnswer || ""}
                onValueChange={(value) => handleAnswerChange(currentQ._id, value)}
                className="space-y-3"
              >
                {currentQ.options.map((option: any) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/20 transition-colors"
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
                className="bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!currentAnswer || submitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {currentQuestion === quiz.questions.length - 1 ? "Finish" : "Next"}
                {!submitting && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
