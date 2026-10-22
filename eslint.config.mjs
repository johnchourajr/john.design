import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  // Agent worktrees are full checkouts, including their own .next builds.
  { ignores: ['.claude/worktrees/**'] },
  ...nextCoreWebVitals,
];

export default eslintConfig;
