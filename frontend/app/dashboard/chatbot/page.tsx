"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Heart } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

// Dummy conversation data
const initialMessages: Message[] = [
  {
    id: "1",
    content:
      "Hello! I'm your AI mental health companion. I'm here to listen and support you. How are you feeling today?",
    sender: "ai",
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "2",
    content: "Hi, I've been feeling a bit overwhelmed with my studies lately.",
    sender: "user",
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: "3",
    content:
      "I understand that feeling overwhelmed with studies can be really challenging. It's completely normal to feel this way, especially during busy periods. Can you tell me more about what specifically is making you feel overwhelmed? Is it the workload, deadlines, or perhaps something else?",
    sender: "ai",
    timestamp: new Date(Date.now() - 180000),
  },
  {
    id: "4",
    content: "It's mainly the upcoming exams and I feel like I'm behind on everything.",
    sender: "user",
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: "5",
    content:
      "That sounds really stressful. Feeling behind can create a cycle of anxiety that makes it even harder to focus. Let's break this down together. What if we started by identifying just one small task you could complete today? Sometimes taking that first small step can help build momentum and reduce that overwhelming feeling.",
    sender: "ai",
    timestamp: new Date(Date.now() - 60000),
  },
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Thank you for sharing that with me. I'm here to support you through this. Remember, it's okay to take things one step at a time. What would feel most helpful for you right now?",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30 backdrop-blur-sm p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">AI Mental Health Companion</h1>
            <p className="text-sm text-muted-foreground">Always here to listen and support you</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "ai" && (
                <Avatar className="w-8 h-8 bg-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-2xl rounded-2xl px-4 py-3 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground ml-12"
                    : "bg-muted/50 text-foreground mr-12"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              {message.sender === "user" && (
                <Avatar className="w-8 h-8 bg-secondary">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border/40 bg-card/30 backdrop-blur-sm p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-1 bg-background border-border/60 focus:border-primary text-base py-6"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-6"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            This AI companion is here to provide emotional support. For crisis situations, please contact emergency
            services.
          </p>
        </div>
      </div>

      {/* Helpful Tips Card */}
      <Card className="m-6 mt-0 border-border/50 bg-accent/20 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            Conversation Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Be honest about your feelings - there's no judgment here</li>
            <li>• Take your time to express yourself</li>
            <li>• Ask for specific coping strategies or techniques</li>
            <li>• Remember: This is a safe space for you</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
