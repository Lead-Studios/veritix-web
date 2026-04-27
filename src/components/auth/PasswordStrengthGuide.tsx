"use client";

interface Rule {
  label: string;
  test: (v: string) => boolean;
}

const RULES: Rule[] = [
  { label: "At least 6 characters", test: (v) => v.length >= 6 },
  { label: "One uppercase letter (A–Z)", test: (v) => /[A-Z]/.test(v) },
  { label: "One lowercase letter (a–z)", test: (v) => /[a-z]/.test(v) },
  { label: "One number (0–9)", test: (v) => /[0-9]/.test(v) },
];

interface Props {
  password: string;
}

export default function PasswordStrengthGuide({ password }: Props) {
  if (!password) return null;

  return (
    <ul
      className="mt-2 space-y-1 text-sm"
      aria-label="Password requirements"
      role="list"
    >
      {RULES.map(({ label, test }) => {
        const met = test(password);
        return (
          <li
            key={label}
            className={`flex items-center gap-2 ${met ? "text-green-500" : "text-gray-400"}`}
            aria-label={`${label}: ${met ? "met" : "not met"}`}
          >
            <span aria-hidden="true">{met ? "✓" : "○"}</span>
            {label}
          </li>
        );
      })}
    </ul>
  );
}
