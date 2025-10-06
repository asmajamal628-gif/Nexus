import React from "react";

type Strength = "Very weak" | "Weak" | "Medium" | "Strong";

const getScore = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return score;
};

const mapScoreToStrength = (score: number): { label: Strength; color: string; width: string } => {
  if (score <= 1) return { label: "Very weak", color: "bg-red-500", width: "w-1/4" };
  if (score === 2) return { label: "Weak", color: "bg-orange-400", width: "w-2/4" };
  if (score === 3) return { label: "Medium", color: "bg-yellow-400", width: "w-3/4" };
  return { label: "Strong", color: "bg-green-500", width: "w-full" };
};

export default function PasswordStrength({ password }: { password: string }) {
  const score = getScore(password);
  const { label, color, width } = mapScoreToStrength(score);

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
        <div className={`${color} h-2 ${width} transition-all`} />
      </div>
      <p className="text-xs mt-1 text-gray-600">Strength: <span className="font-medium">{label}</span></p>
      <ul className="text-xs text-gray-500 mt-2">
        <li>• At least 8 characters</li>
        <li>• Uppercase, lowercase, numbers, symbols recommended</li>
      </ul>
    </div>
  );
}
