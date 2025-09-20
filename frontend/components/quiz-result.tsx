import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Brain, ArrowRight } from "lucide-react";
import Link from "next/link";

interface QuizResultProps {
  result: {
    score: number;
    maxScore: number;
    level: string;
    recommendations: Array<{
      title: string;
      description: string;
    }>;
  };
  quizTitle: string;
  onRetake: () => void;
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Low':
      return 'text-green-600';
    case 'Moderate':
      return 'text-yellow-600';
    case 'High':
      return 'text-red-600';
    default:
      return 'text-foreground';
  }
};

const getLevelDescription = (level: string) => {
  switch (level) {
    case 'Low':
      return 'You\'re managing stress well!';
    case 'Moderate':
      return 'Some stress management techniques could help.';
    case 'High':
      return 'Consider speaking with a mental health professional.';
    default:
      return 'Keep monitoring your mental health regularly.';
  }
};

const QuizResult: React.FC<QuizResultProps> = ({ result, quizTitle, onRetake }) => {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
          <CardDescription className="mt-2">Here are your results for the {quizTitle}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div>
            <div className="text-3xl font-bold text-foreground mb-2">
              Stress Level: <span className={getLevelColor(result.level)}>{result.level}</span>
            </div>
            <p className="text-muted-foreground">
              {getLevelDescription(result.level)}
            </p>
          </div>

          <div className="bg-muted/30 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-2">Your Score</div>
            <div className="text-2xl font-bold text-foreground">
              {result.score}/{result.maxScore}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Recommendations</h3>
          <div className="space-y-3">
            {result.recommendations?.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                <Brain className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onRetake}
            variant="outline"
            className="flex-1"
          >
            Retake Quiz
          </Button>
          <Link href="/dashboard/quizzes" className="flex-1">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              More Quizzes
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizResult;