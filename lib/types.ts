import { ReactNode } from "react";

export interface InputFieldProps {
  label?: string;
  placeholder?: string;
  type?: string;
  name?: string;
  error?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  className?: string;
  register?: any;
  state?: "editable" | "readonly" | "disabled";   // ← NEW
  [key: string]: any;
}


export interface ButtonProps {
  textColor?: string;          
  backgroundColor?: string;   
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  text?: ReactNode;            
  children?: ReactNode;      
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  isRounded?: boolean;
  ref?: React.ForwardedRef<HTMLButtonElement>;
}
export interface Users {
    id: number;
    name: string;
    userName: string;
    email: string;
    password: string;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Question {
  id: number;
  text: string;
  category: "numerical" | "verbal" | "analytical" | "general";
  options: string[];
  correctAnswer: "A" | "B" | "C" | "D" | "E";
  explanation: string;
  imageUrl?: string;  
  dateCreated?: Date;
  dateUpdated?: Date;
}

export interface QuizSession {
  id: number;                
  user_id: string;              
  category: string;              
  difficulty: 'easy' | 'medium' | 'hard';  
  total_questions: number;      
  time_per_question: number;     
  total_time: number;            
  started_at: Date;              
  completed_at: Date | null;     
}


export interface QuizAnswer {
  id: number;
  quiz_session_id: number;
  question_id: number;
  selected_option: 'A' | 'B' | 'C' | 'D' | 'E' | null;
  is_correct: boolean;
  time_taken: number;         
}


export interface QuizResult {
  id: number;
  user_id: string;         
  quiz_session_id: number;
  category: string;
  score: number;             
  total_questions: number;
  correct_answers: number;
  difficulty: 'easy' | 'medium' | 'hard';
  date_taken: Date;
  time_used: string; 
}

export interface Feedback {
  id: number;
  user_id: string;            
  user_name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string | null;
  date_submitted: Date;
  resolved: boolean;
  resolved_by: string | null;   
  resolved_at: Date | null;
}

export interface QuizCategory {
  id: string;                   
  name: string;               
  description: string | null;
  icon: string | null;     
  color: string | null;
}

export interface DifficultyLevel {
  id: string;                
  label: string;             
  time_per_question: number;
  description: string | null;
}

export interface AdminStatistics {
  id: number;
  total_users: number;
  active_users: number;       
  total_quizzes_taken: number;
  average_score: number;        
  last_updated: Date;
}