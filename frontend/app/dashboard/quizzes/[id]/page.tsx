"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, CheckCircle, Brain } from "lucide-react"
import Link from "next/link"

// Dummy quiz data
const quizData = {
  id: "stress-assessment",
  title: "Stress Assessment Quiz",
  description: "Evaluate your current stress levels and learn coping strategies.",
  questions: [
    {
      id: 1,
      question: "How often do you feel overwhelmed by your daily responsibilities?",
      options: [
        { value: "never", label: "Never", score: 0 },
        { value: "rarely", label: "Rarely", score: 1 },
        { value: "sometimes", label: "Sometimes", score: 2 },
        { value: "often", label: "Often", score: 3 },
        { value: "always", label: "Always", score: 4 },
      ],
    },
    {
      id: 2,
      question: "How well do you sleep at night?",
      options: [
        { value: "very-well", label: "Very well", score: 0 },
        { value: "well", label: "Well", score: 1 },
        { value: "okay", label: "Okay", score: 2 },
        { value: "poorly", label: "Poorly", score: 3 },
        { value: "very-poorly", label: "Very poorly", score: 4 },
      ],
    },
    {
      id: 3,
      question: "How often do you experience physical symptoms of stress (headaches, muscle tension, etc.)?",
      options: [
        { value: "never", label: "Never", score: 0 },
        { value: "rarely", label: "Rarely", score: 1 },
        { value: "sometimes", label: "Sometimes", score: 2 },
        { value: "often", label: "Often", score: 3 },
        { value: "daily", label: "Daily", score: 4 },
      ],
    },
  ],
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const calculateScore = () => {
    let totalScore = 0
    quizData.questions.forEach((question) => {
      const answer = answers[question.id]
      if (answer) {
        const option = question.options.find((opt) => opt.value === answer)
        if (option) {
          totalScore += option.score
        }
      }
    })
    return totalScore
  }

  const getStressLevel = (score: number) => {
    if (score <= 4) return { level: "Low", color: "text-green-600", description: "You're managing stress well!" }
    if (score <= 8)
      return {
        level: "Moderate",
        color: "text-yellow-600",
        description: "Some stress management techniques could help.",
      }
    return { level: "High", color: "text-red-600", description: "Consider speaking with a mental health professional." }
  }

  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100
  const currentQ = quizData.questions[currentQuestion]
  const currentAnswer = answers[currentQ?.id]

  if (showResults) {
    const score = calculateScore()
    const stressLevel = getStressLevel(score)

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
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
                <CardDescription className="mt-2">Here are your results for the {quizData.title}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div>
                  <div className="text-3xl font-bold text-foreground mb-2">
                    Stress Level: <span className={stressLevel.color}>{stressLevel.level}</span>
                  </div>
                  <p className="text-muted-foreground">{stressLevel.description}</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-2">Your Score</div>
                  <div className="text-2xl font-bold text-foreground">
                    {score}/{quizData.questions.length * 4}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Recommendations</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                    <Brain className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Practice Mindfulness</h4>
                      <p className="text-sm text-muted-foreground">
                        Try our guided meditation exercises in the chatbot.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                    <Brain className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Track Your Mood</h4>
                      <p className="text-sm text-muted-foreground">Use our mood tracker to identify stress patterns.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setCurrentQuestion(0)
                    setAnswers({})
                    setShowResults(false)
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Retake Quiz
                </Button>
                <Link href="/dashboard/quizzes" className="flex-1">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    More Quizzes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

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
                Question {currentQuestion + 1} of {quizData.questions.length}
              </Badge>
              <div className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</div>
            </div>
            <Progress value={progress} className="mb-4" />
            <CardTitle className="text-xl">{quizData.title}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-foreground leading-relaxed">{currentQ.question}</h2>

              <RadioGroup
                value={currentAnswer || ""}
                onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
                className="space-y-3"
              >
                {currentQ.options.map((option) => (
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
                disabled={!currentAnswer}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {currentQuestion === quizData.questions.length - 1 ? "Finish" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
