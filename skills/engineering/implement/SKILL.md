---
name: implement
description: "Implement a spec or ticket set through fresh implementation-owner subagents."
---

# Implement

The parent agent orchestrates. Fresh implementation-owner subagents write the
code. Apply this skill only to work already described by a spec or tickets.

## Ownership contract

- Assign exactly one fresh implementation owner to each ticket.
- Never let one owner implement multiple tickets.
- Never split one ticket across multiple implementation owners.
- Research, diagnosis, and review subagents do not count as implementation
  owners.
- The parent chooses models, schedules dependencies, inspects results,
  integrates commits, and runs final verification. It does not silently
  implement ticket scope itself.

For one ticket, dispatch one owner. For a small unsliced spec, treat the whole
spec as one implementation unit and dispatch one owner. If a spec contains
several independently testable slices, stop and run `to-tickets` first.

If the harness cannot create fresh subagents or isolate their writes, state that
before changing code. Do not claim this contract was satisfied. Use a fallback
only after the user agrees.

## 1. Load the work

1. Read repository instructions and the complete spec or tickets, including
   comments, acceptance criteria, parent-child links, and blocking relations.
2. Confirm each ticket states its repository, target branch or base, scope,
   blockers, acceptance criteria, and verification.
3. Read only the context and decision documents linked by the work and repository
   instructions.
4. Stop on material ambiguity. Implementation is not permission to redesign the
   plan.

## 2. Build the execution graph

Represent each ticket as one node and each blocker as a directed edge. Reject
cycles and unresolved blockers. The ready frontier contains only tickets whose
blockers are complete.

Run ready tickets in parallel only when the harness provides isolated worktrees
or equivalent write isolation and the tickets do not own overlapping files.
Otherwise dispatch them sequentially. Never let two owners share one working
directory, index, or branch.

## 3. Choose each owner

Invocation of this skill authorizes the parent to select an available model and
reasoning effort independently for each owner.

- Prefer a faster model for narrow, low-risk, well-specified changes.
- Prefer a stronger model or higher reasoning effort for architecture,
  migrations, concurrency, security, uncertain failure modes, or broad blast
  radius.
- Account for required tools and context size.
- Do not invent unavailable model names or hard-code one provider.
- If the harness offers no override, use its default and record that fact.
- Ask before a choice that requires new external cost or permission.

Record the effective model and reasoning setting for every ticket.

## 4. Dispatch one fresh owner per ticket

Give each owner only:

- the complete ticket and parent spec reference;
- repository, target branch, and exact base revision;
- completed blocker results it may rely on;
- linked context and decision documents;
- applicable repository instructions;
- its isolated write scope; and
- the required return format below.

Tell the owner to:

1. verify the base and restate the ticket scope;
2. call the `tdd` skill at pre-agreed seams when behavior changes;
3. implement only this ticket;
4. typecheck and run focused tests regularly;
5. commit only this ticket's changes;
6. call `code-review` against the pre-ticket fixed point;
7. address in-scope review findings and rerun verification; and
8. return the commit, changed files, test evidence, acceptance evidence, and
   remaining risks.

Do not reuse an owner's context for another ticket.

## 5. Inspect and integrate

For each completed owner, the parent:

1. inspects the diff and evidence instead of trusting the summary;
2. confirms the acceptance criteria and scope;
3. integrates the commit in dependency order;
4. routes semantic fixes back to that ticket's owner; the parent may perform
   only mechanical conflict resolution;
5. updates the work item when repository tracker instructions authorize it;
6. blocks dependents when a ticket fails; and
7. recomputes the ready frontier.

## 6. Final verification

After all requested units are integrated, run the relevant full test suite once
from the final revision. Report:

- ticket-to-owner and ticket-to-commit mapping;
- effective model and reasoning setting per ticket;
- focused and combined verification results;
- tracker updates;
- unresolved risks or blocked tickets; and
- whether the one-owner-per-ticket contract was fully satisfied.
