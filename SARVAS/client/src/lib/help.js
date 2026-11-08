// Answers for the help console: questions about SARVAS itself, matched by keyword.
// Order matters: on a tie the earlier entry wins. A key of 4+ letters also matches
// words it starts (approv → approve, approval).
const FAQ = [
  {
    keys: ['sarvas', 'platform', 'overview', 'purpose'],
    answer: 'SARVAS is an AI coding platform for your GitHub repositories. You can ask questions about a '
      + "repository's code, or describe a change in plain English. SARVAS plans it, makes it in a sandbox, runs the "
      + 'checks and opens a pull request that your engineers review and merge.',
  },
  {
    keys: ['audit', 'activity', 'histor'],
    answer: "Your Activity page lists what you've done in SARVAS. Administrators can also see the full audit log "
      + 'of every sign-in, proposal, refusal and approval.',
  },
  {
    keys: ['sign', 'signin', 'login', 'log', 'account', 'github', 'oauth', 'password', 'connect'],
    answer: "Choose Connect GitHub. SARVAS uses GitHub's own sign-in, so it never sees or asks for your password. "
      + "Your GitHub account must be on this site's list of allowed users. If it isn't, ask an administrator to "
      + 'add your GitHub username.',
  },
  {
    keys: ['demo', 'try', 'trial'],
    answer: 'If this site has the demo turned on, choose "Try the demo, no GitHub needed" on the sign-in page. '
      + 'Everyone shares one demo visitor account that is limited to one demo repository, and every change still '
      + 'ends as a pull request there.',
  },
  {
    keys: ['ask', 'answer', 'codebase', 'citation', 'explain'],
    answer: "Open a repository from the dashboard and use the Ask tab. Answers come from that repository's code "
      + "and docs, with links to the exact lines. If the code doesn't support an answer, SARVAS says so instead "
      + 'of guessing.',
  },
  {
    keys: ['change', 'feature', 'bug', 'fix', 'build', 'task', 'request', 'implement'],
    answer: 'Open a repository and choose "Request a change". Describe the feature, bug or UI change and how '
      + "you'll know it's done. The agent asks if anything is unclear, then shows a plan with acceptance criteria "
      + "and a risk level. Once the plan is approved, it makes the change in an isolated sandbox and runs the "
      + "repository's checks.",
  },
  {
    keys: ['pull', 'pr', 'merg', 'approv', 'review', 'branch', 'diff'],
    answer: "SARVAS never pushes to your default branch and can't approve or merge anything. When you approve "
      + 'the diff, it opens a pull request listing the task, changed files, test results and risks. Your engineers '
      + "review and merge it, and GitHub's branch protection decides who can.",
  },
  {
    keys: ['risk', 'role', 'engineer', 'admin', 'requester', 'permission'],
    answer: 'You can approve the plan for your own low-risk request. Medium-risk plans need an engineer with push '
      + 'access to the repository. High-risk requests, such as anything touching authentication, payments, '
      + 'infrastructure, CI or credentials, are declined.',
  },
  {
    keys: ['privacy', 'data', 'secur', 'safe', 'store', 'token', 'cookie', 'ai', 'model', 'provider', 'send', 'sent'],
    answer: 'Your GitHub access token is stored encrypted, and your browser holds only a random session ID. '
      + 'Repository code goes to an AI provider only if this site allows it, and your dashboard shows which model '
      + 'is used and whether code leaves the servers. The full privacy policy is linked in the footer.',
  },
  {
    keys: ['install', 'app', 'repositor', 'repo', 'access'],
    answer: 'SARVAS only works where its GitHub App is installed. Use "Install the GitHub App" to choose which '
      + 'repositories it can access. They then appear on your dashboard.',
  },
  {
    keys: ['readme'],
    answer: 'Open a repository and use the README tab to add or delete a README.md. You see the exact diff '
      + 'first, and the change goes through a pull request too.',
  },
];

export const OUTSIDE_CONTEXT = "That question is outside the context of SARVAS, so I can't answer it. I can help "
  + 'with signing in, the demo, asking about a repository, requesting changes, pull requests, roles and risk, '
  + 'and privacy. For questions about your own code, open a repository and use Ask.';

const hits = (words, key) => words.some((w) => w === key || (key.length >= 4 && w.startsWith(key)));

export function answerHelp(question) {
  const words = question.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  let best = null;
  let bestScore = 0;
  for (const entry of FAQ) {
    const score = entry.keys.filter((k) => hits(words, k)).length;
    if (score > bestScore) { best = entry; bestScore = score; }
  }
  return best ? { status: 'answered', answer: best.answer } : { status: 'outside_context', answer: OUTSIDE_CONTEXT };
}
