// Icons.tsx
import * as LucideIcons from 'lucide-react';

// Re-export your named icons (keeping your aliases)
export {
  User as Username,
  Lock as Password,
  Eye as ShowPassword,
  EyeOff as HidePassword,
  LogIn,
  LogOut as Logout,
  Zap as InstantFeedback,
  BarChart3 as ProgressTracking,
  BookOpen as AllCategories,
  CheckCircle2 as CustomQuiz,
  Play as StartQuiz,
  TrendingUp as AverageScore,
  ChartColumn as TotalTests,
  Award as BestCategory,
  Clock as StudyTime,
  Menu,
  MessageCircle as ShowFeedback,
  Star as Feedback,
  Send as SubmitFeedback,
  ArrowRight as BeginQuiz,
  Users as Verbal,
  BookMarked as Numerical,
  Brain as Analytical,
  Globe as General,
  CheckCircle as CorrectAnswer,
  XCircle as IncorrectAnswer,
  ArrowLeft as BackToDashboard,
  RotateCw as RetakeQuiz,
  TrendingUp as NoResultsYet,
  ChevronRight as ViewDetailedResults,
  Check as Success,
  Mail as Email,
  AlertCircle as ToDelete,
  Settings as AccountSettings,
  HelpCircle as Questions,
  Plus as Add,
  Edit,
  Trash2 as Delete,
  Search,
  EyeIcon as Eye,
  EyeClosedIcon as EyeOff,
  X as Close,
  AtSign,
} from 'lucide-react';

// ──────────────────────────────────────────────
//           ICON GALLERY / CHEATSHEET
// ──────────────────────────────────────────────

const iconList: { name: string; Component: React.ComponentType<any> }[] = [
  { name: 'Username',        Component: LucideIcons.User },
  { name: 'Password',        Component: LucideIcons.Lock },
  { name: 'ShowPassword',    Component: LucideIcons.Eye },
  { name: 'HidePassword',    Component: LucideIcons.EyeOff },
  { name: 'LogIn',           Component: LucideIcons.LogIn },
  { name: 'Logout',          Component: LucideIcons.LogOut },
  { name: 'InstantFeedback', Component: LucideIcons.Zap },
  { name: 'ProgressTracking',Component: LucideIcons.BarChart3 },
  { name: 'AllCategories',   Component: LucideIcons.BookOpen },
  { name: 'CustomQuiz',      Component: LucideIcons.CheckCircle2 },
  { name: 'StartQuiz',       Component: LucideIcons.Play },
  { name: 'AverageScore',    Component: LucideIcons.TrendingUp },
  { name: 'TotalTests',      Component: LucideIcons.ChartColumn },
  { name: 'BestCategory',    Component: LucideIcons.Award },
  { name: 'StudyTime',       Component: LucideIcons.Clock },
  { name: 'Menu',            Component: LucideIcons.Menu },
  { name: 'ShowFeedback',    Component: LucideIcons.MessageCircle },
  { name: 'Feedback',        Component: LucideIcons.Star },
  { name: 'SubmitFeedback',  Component: LucideIcons.Send },
  { name: 'BeginQuiz',       Component: LucideIcons.ArrowRight },
  { name: 'Verbal',          Component: LucideIcons.Users },
  { name: 'Numerical',       Component: LucideIcons.BookMarked },
  { name: 'Analytical',      Component: LucideIcons.Brain },
  { name: 'General',         Component: LucideIcons.Globe },
  { name: 'CorrectAnswer',   Component: LucideIcons.CheckCircle },
  { name: 'IncorrectAnswer', Component: LucideIcons.XCircle },
  { name: 'BackToDashboard', Component: LucideIcons.ArrowLeft },
  { name: 'RetakeQuiz',      Component: LucideIcons.RotateCw },
  { name: 'NoResultsYet',    Component: LucideIcons.TrendingUp },
  { name: 'ViewDetailedResults', Component: LucideIcons.ChevronRight },
  { name: 'Success',         Component: LucideIcons.Check },
  { name: 'Email',           Component: LucideIcons.Mail },
  { name: 'ToDelete',        Component: LucideIcons.AlertCircle },
  { name: 'AccountSettings', Component: LucideIcons.Settings },
  { name: 'Questions',       Component: LucideIcons.HelpCircle },
  { name: 'Add',             Component: LucideIcons.Plus },
  { name: 'Edit',            Component: LucideIcons.Edit },
  { name: 'Delete',          Component: LucideIcons.Trash2 },
  { name: 'Search',          Component: LucideIcons.Search },
  { name: 'Eye',             Component: LucideIcons.EyeIcon },
  { name: 'EyeOff',          Component: LucideIcons.EyeClosedIcon },
  { name: 'Close',           Component: LucideIcons.X },
  { name: 'AtSign',          Component: LucideIcons.AtSign },
];

export function IconGallery() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Icon Reference (lucide-react)
      </h2>

      <div
        className="
          grid gap-6
          grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8
        "
      >
        {iconList.map(({ name, Component }) => (
          <div
            key={name}
            className="
              flex flex-col items-center justify-center
              p-4 rounded-lg border bg-white text-gray-900
              hover:bg-gray-50 transition-colors
              group
            "
          >
            <Component className="w-8 h-8 mb-3 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs text-center font-medium text-gray-500 break-all">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}