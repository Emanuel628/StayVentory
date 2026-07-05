import { colors } from '@/src/theme/theme';

export function getPasswordStrength(password: string) {
  const checks = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  let label = 'Too weak';
  let color: string = colors.rust;

  if (score === 2) {
    label = 'Needs work';
    color = colors.ochre;
  } else if (score === 3) {
    label = 'Strong';
    color = colors.teal;
  } else if (score === 4) {
    label = 'Very strong';
    color = colors.teal;
  }

  return {
    score,
    label,
    color,
    checks,
  };
}
