"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Clock, Users, Award, ArrowRight, CheckCircle, Play } from "lucide-react"
import Link from "next/link"

const quizzes = [
  {
    id: "stress-assessment",
    title: "Stress Assessment Quiz",
    description: "Evaluate your current stress levels and learn coping strategies.",
    duration: "5-7 minutes",
    questions: 15,
    category: "Assessment",
    difficulty: "Beginner",
    completed: true,
    score: 85,
    icon: Brain,
    color: "bg-blue-500",
  },
  {
    id: "anxiety-awareness",
    title: "Anxiety Awareness Quiz",
    description: "Understand anxiety symptoms and discover management techniques.",
    duration: "8-10 minutes",
    questions: 20,
    category: "Education",
    difficulty: "Intermediate",
    completed: false,
    score: null,
    icon: Brain,
    color: "bg-purple-500",
  },
  {
    id: "mindfulness-basics",
    title: "Mindfulness Basics",
    description: "Learn the fundamentals of mindfulness and meditation practices.",
    duration: "6-8 minutes",
    questions: 12,
    category: "Skills",
    difficulty: "Beginner",
    completed: true,
    score: 92,
    icon: Brain,
    color: "bg-green-500",
  },
  {
    id: "sleep-hygiene",
    title: "Sleep Hygiene Assessment",
    description: "Evaluate your sleep habits and learn improvement strategies.",
    duration: "4-6 minutes",
    questions: 10,
    category: "Assessment",
    difficulty: "Beginner",
    completed: false,
    score: null,
    icon: Brain,
    color: "bg-indigo-500",
  },
  {
    id: "emotional-intelligence",
    title: "Emotional Intelligence Quiz",
    description: "Assess your ability to understand and manage emotions effectively.",
    duration: "10-12 minutes",
    questions: 25,
    category: "Assessment",
    difficulty: "Advanced",
    completed: false,
    score: null,
    icon: Brain,
    color: "bg-orange-500",
  },
  {
    id: "resilience-building",
    title: "Building Resilience",
    description: "Learn strategies to bounce back from challenges and setbacks.",
    duration: "7-9 minutes",
    questions: 18,
    category: "Skills",
    difficulty: "Intermediate",
    completed: false,
    score: null,
    icon: Brain,
    color: "bg-teal-500",
  },
]

const categories = ["All", "Assessment", "Education", "Skills"]

export default function QuizzesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredQuizzes =
    selectedCategory === "All" ? quizzes : quizzes.filter((quiz) => quiz.category === selectedCategory)

  const completedQuizzes = quizzes.filter((quiz) => quiz.completed).length
  const averageScore =
    quizzes.filter((quiz) => quiz.score !== null).reduce((sum, quiz) => sum + quiz.score!, 0) /
    quizzes.filter((quiz) => quiz.score !== null).length

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
              <div className="text-2xl font-bold text-foreground">45 min</div>
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
