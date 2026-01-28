import { ReactNode } from "react";

type ErrorStateProps = {
  title?: string;
  message: string;
  type?: "error" | "warning" | "info" | "notFound" | "unauthorized";
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
};

export function ErrorState({
  title,
  message,
  type = "error",
  action,
  secondaryAction,
}: ErrorStateProps) {
  const getIconAndColor = () => {
    switch (type) {
      case "warning":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-600",
          icon: (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          ),
        };
      case "info":
        return {
          bg: "bg-blue-100",
          text: "text-blue-600",
          icon: (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      case "notFound":
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          icon: (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      case "unauthorized":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-600",
          icon: (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          ),
        };
      default:
        return {
          bg: "bg-red-100",
          text: "text-red-600",
          icon: (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
    }
  };

  const { bg, text, icon } = getIconAndColor();

  const defaultTitles = {
    error: "Something went wrong",
    warning: "Warning",
    info: "Information",
    notFound: "Not Found",
    unauthorized: "Access Denied",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div
        className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center mb-4`}
      >
        <div className={text}>{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {title || defaultTitles[type]}
      </h3>
      <p className="text-gray-600 max-w-md mb-6">{message}</p>
      <div className="flex flex-wrap gap-3 justify-center">
        {action && (
          <button
            onClick={action.onClick}
            className="bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 transition font-medium"
          >
            {action.label}
          </button>
        )}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
