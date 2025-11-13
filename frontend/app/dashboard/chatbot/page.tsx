"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Heart, RefreshCw, AlertCircle, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import chatbotService from "@/services/chatbot"
import { MarkdownMessage } from "@/components/ui/markdown-message"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting')
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated, user } = useAuth()

  // Initialize chat session on component mount
  useEffect(() => {
    initializeChatSession()
  }, [])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  const initializeChatSession = async () => {
    try {
      setIsInitializing(true)
      setConnectionStatus('connecting')
      setError(null)

      // First check chatbot status
      const statusResponse = await chatbotService.getStatus()
      
      if (!statusResponse.success) {
        throw new Error(statusResponse.error || 'Unable to connect to chatbot service')
      }

      // Start a new session
      const sessionResponse = await chatbotService.startSession()
      
      if (sessionResponse.success && sessionResponse.data) {
        setSessionId(sessionResponse.data.sessionId)
        setConnectionStatus('connected')
        
        // Add welcome message to chat
        const welcomeMessage: Message = {
          id: 'welcome-' + Date.now(),
          content: sessionResponse.data.welcomeMessage,
          sender: "ai",
          timestamp: new Date(sessionResponse.data.timestamp),
        }
        setMessages([welcomeMessage])
      } else {
        throw new Error(sessionResponse.error || 'Failed to start chat session')
      }
    } catch (error) {
      console.error('Failed to initialize chat session:', error)
      setError(error instanceof Error ? error.message : 'Failed to connect to chatbot')
      setConnectionStatus('disconnected')
    } finally {
      setIsInitializing(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !sessionId || isLoading) return

    const userMessage: Message = {
      id: 'user-' + Date.now(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const messageToSend = inputValue.trim()
    setInputValue("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await chatbotService.sendMessage(messageToSend, sessionId)
      
      if (response.success && response.data) {
        const aiResponse: Message = {
          id: 'ai-' + Date.now(),
          content: response.data.message,
          sender: "ai",
          timestamp: new Date(response.data.timestamp),
        }
        setMessages((prev) => [...prev, aiResponse])
      } else {
        throw new Error(response.error || 'Failed to get response from chatbot')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setError(error instanceof Error ? error.message : 'Failed to send message')
      
      // Add error message to chat
      const errorMessage: Message = {
        id: 'error-' + Date.now(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleRetryConnection = () => {
    setError(null)
    initializeChatSession()
  }

  const handleClearChat = async () => {
    if (!sessionId || !isAuthenticated) {
      // For anonymous users or no session, just clear local messages
      setMessages([])
      return
    }

    try {
      const response = await chatbotService.clearChatHistory(sessionId)
      if (response.success) {
        setMessages([])
      } else {
        console.error('Failed to clear chat history:', response.error)
      }
    } catch (error) {
      console.error('Error clearing chat history:', error)
    }
  }

  if (isInitializing) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-lg font-semibold mb-2">Connecting to AI Companion...</h2>
          <p className="text-muted-foreground">Please wait while we establish the connection</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">AI Mental Health Companion</h1>
              <p className="text-sm text-muted-foreground">
                {isAuthenticated ? `Welcome back, ${user?.name}` : 'Anonymous session - Always here to listen and support you'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearChat}
                className="text-xs"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear Chat
              </Button>
            )}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs text-muted-foreground capitalize">{connectionStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetryConnection}
                className="ml-2"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && !isInitializing && (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Start a conversation with your AI companion</p>
            </div>
          )}
          
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
                <MarkdownMessage 
                  content={message.content} 
                  isUserMessage={message.sender === "user"}
                />
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
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8 bg-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="max-w-2xl rounded-2xl px-4 py-3 bg-muted/50 text-foreground mr-12">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <p className="text-sm text-muted-foreground">Thinking...</p>
                </div>
              </div>
            </div>
          )}
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
              placeholder={sessionId ? "Type your message here..." : "Please wait, connecting..."}
              disabled={!sessionId || isLoading}
              className="flex-1 bg-background border-border/60 focus:border-primary text-base py-6"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || !sessionId || isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-6"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <div className="flex justify-between items-center mt-3">
            <p className="text-xs text-muted-foreground">
              This AI companion is here to provide emotional support. For crisis situations, please contact emergency services.
            </p>
            {sessionId && (
              <p className="text-xs text-muted-foreground">
                Session: {sessionId.slice(-8)}
              </p>
            )}
          </div>
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
