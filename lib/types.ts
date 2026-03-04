import { ReactNode } from "react";

export interface InputFieldProps {
  label?: ReactNode;
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
  textColor: string;          
  backgroundColor: string;   
  borderColor?: string;   
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  text: ReactNode;            
  children?: ReactNode;      
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  isRounded?: boolean;
  ref?: React.ForwardedRef<HTMLButtonElement>;
}



//Done
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

//done
export interface Question {
  id: string;   
  text: string;
  imageUrl?: string | null;
  categoryId: string;            
  category?: QuizCategory | null;
  options: string[]; 
  correctAnswer: "A" | "B" | "C" | "D" | "E";
  explanation: string;
  dateCreated?: Date;    
  dateUpdated?: Date;  
}


//done
export interface QuizSession {
  id: string;  
  user_id: string; 
  category_id: string | null;
  difficulty_id: string;        
  difficulty?: {                
    label: string;
    time_per_question: number;
    description: string | null;
  } | null;
  total_questions: number;
  total_time_seconds: number;
  started_at: Date;
  completed_at: Date | null;
  is_completed: boolean; 
  created_at: Date;
}


//done
export interface QuizAnswer {
  id: string;  
  quiz_session_id: string;   
  question_id: string;      
  selected_option: 'A' | 'B' | 'C' | 'D' | 'E' | null; 
  is_correct: boolean;
  time_taken_seconds: number; 
  created_at: Date;
}

//done
export interface QuizResult {
  id: string;  
  user_id: string;     
  quiz_session_id: string;    
  category_id: string | null;    
  score: number;     
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  skipped_answers: number;
  difficulty_id: string; 
  time_taken_seconds: number; 
  percentage: number; 
  date_taken: Date;  
  created_at: Date;      
}


//done
export interface Feedback {
  id: string;             
  user_id: string;          
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string | null;
  created_at: Date;          
  resolved: boolean;
  resolved_by: string | null;   
  resolved_at: Date | null;
  updated_at: Date;             
}

//done
export interface QuizCategory {
  id: string;                   
  name: string;               
  description: string | null;
  created_at: Date;
  updated_at: Date;
}


//Done
export interface DifficultyLevel {
  id: string;                
  label: string;             
  minutes_per_question: number;
  description: string | null;
}

export interface ChipProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  text: ReactNode;
  className?: string;
  variant?: | 'numerical'
    | 'verbal'
    | 'general'
    | 'analytical'
    | 'correct'
    | 'incorrect'
    | 'resolved'
    | 'score'
    | 'default'
}
