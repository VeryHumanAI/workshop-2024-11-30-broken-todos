# Flight Simulator Workshop

**Date**: Sunday, Nov 30, 2025 | 12:00-2:00pm ET  
**Goal**: Learn to debug with AI assistance—think before typing, verify everything.

## Features

| Status | Feature | Difficulty | Notes |
|--------|---------|------------|-------|
| [ ] | **Edit todos** - Click to edit inline | Junior-Mid | Debug demo (live) |
| [ ] | **Todo count** - "X of Y completed" | Junior | Participants debug + PR |
| [ ] | **Show/hide completed** - Filter toggle | Junior-Mid | Build together (live) |
| [ ] | **Search todos** - Filter by text | Mid | Exercise for student |
| [ ] | **Drag to reorder** - Manual ordering | Mid-Senior | Exercise for student |

**Legend**:
- `[ ]` = Not yet implemented
- `[x]` = Implemented and working
- `[!]` = Implemented but BROKEN (intentional bug)

---

## Workshop Agenda

### 🧭 Orientation (12:00-12:20)
- [ ] Explore the codebase with AI
- [ ] Understand what's working vs broken
- [ ] Review the constitution and coding standards

### 🔍 Live Debug Demo (12:20-12:45)  
- [ ] Conroy debugs "edit todos" bug live
- [ ] Think-aloud: How to reason about the problem
- [ ] Show the fix, explain *why* it was broken

### 🛠️ Hands-On Debugging (12:45-1:30)
- [ ] Participants fix "todo count" bug
- [ ] Create a branch, make the fix, open a PR
- [ ] Use AI to help, but verify everything

### 🏗️ Build Together (1:30-1:50)
- [ ] `/speckit.specify` a new feature together
- [ ] Implement "show/hide completed" as a group
- [ ] Demonstrate spec-driven development

### 🎓 Debrief (1:50-2:00)
- [ ] What did we learn?
- [ ] Introduce "homework" features (search, drag-to-reorder)
- [ ] How to submit PRs for review

---

## Post-Workshop (2:00-4:00pm or async)

For those who want to keep going:

1. Pick one of the unimplemented features (search or drag-to-reorder)
2. Write a spec using `/speckit.specify`
3. Implement it
4. Open a PR for feedback

I'll review all PRs and provide feedback!

---

## Quick Reference

**Start the dev server**:
```bash
npm run dev
```

**Database commands**:
```bash
npm run db:studio    # Open Drizzle Studio
npm run db:migrate   # Run migrations
```

**Linting**:
```bash
npm run lint
```

**Key files**:
- `app/actions.ts` - Server Actions (data mutations)
- `app/todo.tsx` - Todo component (client)
- `app/todo-list.tsx` - Todo list with optimistic UI
- `db/schema.ts` - Database schema
