# LDRP ERP Project

A comprehensive Educational Resource Planning (ERP) system for learning and development management.

---

## Project Structure

```
ldrp-erp/
├── client/          # React frontend
├── server/          # Express.js backend
├── design/          # Design files and mockups
└── README.md        # This file
```

---

## Quick Start

### For Frontend Developers

```bash
cd client
npm install
npm run dev
```

Runs on: `http://localhost:5173`

### For Backend Developers

```bash
cd server
npm run setup        # First time only
npm run dev
```

Runs on: `http://localhost:5000`

---

## Git Branching Strategy

We use **Git Flow** branching model:

```
main                           (Production - stable code)
├── develop                    (Staging - integration branch)
│   ├── feature/*              (Feature development - merges to develop)
│   ├── bugfix/*               (Bug fixes - merges to develop)
│   └── hotfix/*               (Emergency fixes - merges to develop)
│
└── (Tags for releases)
```

**Key Points:**
- All feature, bugfix, and hotfix branches are **created FROM** develop
- All changes are **merged back TO** develop via Pull Requests
- develop branch holds the next release version
- main branch only receives merged code from develop (stable releases)

### Branch Naming Conventions

All branch names should follow these patterns and be created **FROM develop branch**:

- **Feature:** `feature/<your-feature-name>` 
  - Example: `feature/student-dashboard`, `feature/course-registration`
  - Created from: `develop`
  - Merged back to: `develop`

- **Bug Fix:** `bugfix/<issue-name>`
  - Example: `bugfix/general-fixes`, `bugfix/validation-error`
  - Created from: `develop`
  - Merged back to: `develop`

- **Hotfix:** `hotfix/<critical-issue>`
  - Example: `hotfix/critical-issue`, `hotfix/data-loss-bug`
  - Created from: `develop`
  - Merged back to: `develop`

---

## Development Workflow

### 1. Start New Feature

```bash
# Update develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name
```

### 2. Work on Feature

Make commits regularly with clear messages:
```bash
git commit -m "feat: add student registration form"
git commit -m "fix: correct validation logic"
git commit -m "docs: update API documentation"
```

### 3. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then on GitHub:
1. Create Pull Request to `develop` branch
2. Add descriptive title and description
3. Link related issues
4. Request code review

### 4. Code Review & Merge

- Address review feedback
- After approval, merge to `develop`
- Delete feature branch

---

## Commit Message Format

Use clear, descriptive commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (no logic changes)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Build/dependency updates

**Examples:**
```
feat(student): add enrollment form validation
fix(auth): resolve JWT expiration issue
docs(api): update endpoint documentation
```

---

## Database & Backend Setup

See [server/README.md](server/README.md) for detailed setup instructions.

**Key Points:**
- Use PostgreSQL locally
- Copy `.env.example` to `.env`
- Run migrations with `npm run prisma:deploy`
- View database with `npm run prisma:studio`

---

## Frontend Setup

See [client/README.md](client/README.md) for detailed setup instructions.

---

## Communication Guidelines

### Before Starting Work

- Check existing issues and PRs
- Announce your feature in team chat
- Avoid duplicate work

### During Development

- Push commits regularly
- Ask for help early if stuck
- Keep PRs reasonably sized (not too large)

### Database Changes

🚨 **Important:**
- Announce schema changes in advance
- Create migrations with `npm run prisma:migrate`
- Test migrations locally first
- Document what changed in PR description

### Resolving Conflicts

```bash
# Get latest code
git fetch origin

# Rebase on latest develop
git rebase origin/develop

# Resolve conflicts in editor
# Then continue
git add .
git rebase --continue

# Force push your branch
git push origin feature/your-feature-name -f
```

---

## Environment Setup

Each team member needs:

1. **Node.js** (v16+)
2. **PostgreSQL** (v12+)
3. **Git**
4. **VS Code** (recommended) with extensions:
   - Prisma
   - ES7+ React/Redux/React-Native snippets
   - Prettier
   - ESLint

---

## Important Files

| File | Purpose |
|------|---------|
| `.env.example` | Environment template (DO NOT commit `.env`) |
| `.gitignore` | Files/folders to ignore in git |
| `package.json` | Dependencies and scripts |
| `prisma/schema.prisma` | Database schema definition |
| `eslint.config.js` | Code style rules |

---

## Pull Request Template

When creating a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Testing Done
How did you test these changes?

## Checklist
- [ ] Code follows project style
- [ ] No console errors/warnings
- [ ] Tested locally
- [ ] Updated documentation
- [ ] No secrets in code (check .env)
```

---

## Code Quality Standards

- Use ESLint and Prettier
- Write clear variable/function names
- Add comments for complex logic
- Keep functions small and focused
- No hardcoded values (use config/env)

---

## Helpful Commands

### Git
```bash
git status                          # Check status
git log --oneline -5               # View recent commits
git branch -a                      # View all branches
git fetch origin                   # Update remote tracking
git pull origin develop            # Get latest code
git diff feature/my-feature        # View changes
```

### Prisma
```bash
npm run prisma:studio              # Open database GUI
npm run prisma:migrate             # Create migration
npm run prisma:deploy              # Apply migrations
npm run prisma:generate            # Regenerate client
```

---

## Troubleshooting

### Git Issues
- **Conflicting changes?** See "Resolving Conflicts" section
- **Wrong branch?** `git checkout correct-branch`
- **Need to undo?** `git reset --soft HEAD~1`

### Database Issues
- **Can't connect?** Check PostgreSQL service is running
- **Wrong schema?** Run `npm run prisma:deploy`
- **Want fresh start?** Run `npm run prisma:reset`

### Code Issues
- **Linting errors?** Run `npm run lint:fix`
- **Tests failing?** Debug locally and check test files

---

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## Support

For questions or issues:
1. Check documentation in respective README files
2. Ask in team chat
3. Search existing GitHub issues
4. Create a new issue with details

---

## License

This project is licensed under ISC License.

---

**Happy coding! 🚀**
