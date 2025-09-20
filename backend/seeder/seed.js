const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Quiz = require('../models/Quiz');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Initial quiz data
const quizzes = [
  {
    id: "stress-assessment",
    title: "Stress Assessment Quiz",
    description: "Evaluate your current stress levels and learn coping strategies.",
    duration: "5-7 minutes",
    category: "Assessment",
    difficulty: "Beginner",
    questions: [
      {
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
        question: "How often do you experience physical symptoms of stress (headaches, muscle tension, etc.)?",
        options: [
          { value: "never", label: "Never", score: 0 },
          { value: "rarely", label: "Rarely", score: 1 },
          { value: "sometimes", label: "Sometimes", score: 2 },
          { value: "often", label: "Often", score: 3 },
          { value: "daily", label: "Daily", score: 4 },
        ],
      },
      {
        question: "When faced with a challenging situation, do you feel you have the resources to cope?",
        options: [
          { value: "always", label: "Always", score: 0 },
          { value: "mostly", label: "Most of the time", score: 1 },
          { value: "sometimes", label: "Sometimes", score: 2 },
          { value: "rarely", label: "Rarely", score: 3 },
          { value: "never", label: "Never", score: 4 },
        ],
      },
      {
        question: "How easy is it for you to relax after a stressful day?",
        options: [
          { value: "very-easy", label: "Very easy", score: 0 },
          { value: "easy", label: "Easy", score: 1 },
          { value: "moderate", label: "Moderately difficult", score: 2 },
          { value: "difficult", label: "Difficult", score: 3 },
          { value: "very-difficult", label: "Very difficult", score: 4 },
        ],
      }
    ]
  },
  {
    id: "anxiety-awareness",
    title: "Anxiety Awareness Quiz",
    description: "Understand anxiety symptoms and discover management techniques.",
    duration: "8-10 minutes",
    category: "Education",
    difficulty: "Intermediate",
    questions: [
      {
        question: "How often do you find yourself worrying about future events?",
        options: [
          { value: "never", label: "Never", score: 0 },
          { value: "rarely", label: "Rarely", score: 1 },
          { value: "sometimes", label: "Sometimes", score: 2 },
          { value: "often", label: "Often", score: 3 },
          { value: "always", label: "Always", score: 4 },
        ],
      },
      {
        question: "Do you experience physical symptoms like racing heart, shortness of breath, or sweating when anxious?",
        options: [
          { value: "never", label: "Never", score: 0 },
          { value: "rarely", label: "Rarely", score: 1 },
          { value: "sometimes", label: "Sometimes", score: 2 },
          { value: "often", label: "Often", score: 3 },
          { value: "always", label: "Always", score: 4 },
        ],
      },
      {
        question: "How often do anxious thoughts interfere with your daily activities?",
        options: [
          { value: "never", label: "Never", score: 0 },
          { value: "rarely", label: "Rarely", score: 1 },
          { value: "sometimes", label: "Sometimes", score: 2 },
          { value: "often", label: "Often", score: 3 },
          { value: "daily", label: "Daily", score: 4 },
        ],
      },
      {
        question: "Do you avoid certain situations due to anxiety?",
        options: [
          { value: "never", label: "Never", score: 0 },
          { value: "rarely", label: "Rarely", score: 1 },
          { value: "sometimes", label: "Sometimes", score: 2 },
          { value: "often", label: "Often", score: 3 },
          { value: "always", label: "Always", score: 4 },
        ],
      },
      {
        question: "How confident are you in managing anxiety when it arises?",
        options: [
          { value: "very-confident", label: "Very confident", score: 0 },
          { value: "confident", label: "Confident", score: 1 },
          { value: "somewhat", label: "Somewhat confident", score: 2 },
          { value: "not-very", label: "Not very confident", score: 3 },
          { value: "not-at-all", label: "Not at all confident", score: 4 },
        ],
      }
    ]
  },
  {
    id: "mindfulness-basics",
    title: "Mindfulness Basics",
    description: "Learn the fundamentals of mindfulness and meditation practices.",
    duration: "6-8 minutes",
    category: "Skills",
    difficulty: "Beginner",
    questions: [
      {
        question: "How often do you practice mindfulness or meditation?",
        options: [
          { value: "daily", label: "Daily", score: 0 },
          { value: "few-times", label: "A few times per week", score: 1 },
          { value: "weekly", label: "Weekly", score: 2 },
          { value: "rarely", label: "Rarely", score: 3 },
          { value: "never", label: "Never", score: 4 },
        ],
      },
      {
        question: "How easy is it for you to stay focused on the present moment?",
        options: [
          { value: "very-easy", label: "Very easy", score: 0 },
          { value: "easy", label: "Easy", score: 1 },
          { value: "moderate", label: "Moderately difficult", score: 2 },
          { value: "difficult", label: "Difficult", score: 3 },
          { value: "very-difficult", label: "Very difficult", score: 4 },
        ],
      },
      {
        question: "When eating a meal, how aware are you of the taste, texture, and experience of the food?",
        options: [
          { value: "very-aware", label: "Very aware", score: 0 },
          { value: "aware", label: "Aware", score: 1 },
          { value: "somewhat", label: "Somewhat aware", score: 2 },
          { value: "not-very", label: "Not very aware", score: 3 },
          { value: "not-at-all", label: "Not at all aware", score: 4 },
        ],
      },
      {
        question: "How often do you catch yourself doing tasks on 'autopilot' without awareness?",
        options: [
          { value: "never", label: "Never", score: 0 },
          { value: "rarely", label: "Rarely", score: 1 },
          { value: "sometimes", label: "Sometimes", score: 2 },
          { value: "often", label: "Often", score: 3 },
          { value: "always", label: "Always", score: 4 },
        ],
      },
      {
        question: "How comfortable are you with observing your thoughts without judgment?",
        options: [
          { value: "very-comfortable", label: "Very comfortable", score: 0 },
          { value: "comfortable", label: "Comfortable", score: 1 },
          { value: "neutral", label: "Neutral", score: 2 },
          { value: "uncomfortable", label: "Uncomfortable", score: 3 },
          { value: "very-uncomfortable", label: "Very uncomfortable", score: 4 },
        ],
      }
    ]
  }
];

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data
    await Quiz.deleteMany();
    
    // Insert new data
    await Quiz.create(quizzes);
    
    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await Quiz.deleteMany();
    
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Command line args
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use the correct command: -i (import) or -d (delete)');
  process.exit();
}