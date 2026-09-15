---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

## Mandatory Q&A tool

Before the first question, read [QUESTION-TOOLS.md](QUESTION-TOOLS.md). Deliver
every decision question through the current harness's native structured Q&A
tool. Never ask a grilling question in a normal assistant message.

If no structured Q&A tool is available, stop and explain the missing capability.
Do not fall back to prose questions.

For each tool question:

- make the options mutually exclusive;
- put your recommended option first and label it `(Recommended)`;
- explain the impact or trade-off of every option in one sentence; and
- preserve the tool's free-form `Other` path.

## Work the tree

Work the tree in **rounds**. The **frontier** is every decision whose
prerequisites are already settled: the questions you can ask _now_ without
guessing at answers you have not heard yet.

Ask the whole frontier in one round, split only when the Q&A tool limits the
number of questions per call. Wait for those answers before the next round. Each
answer reshapes the tree: settled decisions push the frontier outward and
unblock questions that depended on them. Recompute the frontier after each
round. A question whose answer depends on another question still open belongs
to a later round, not the current one.

Finding _facts_ is your job, never the user's. When a frontier question needs a
fact from the environment, dispatch a sub-agent to find it; do not ask the user
for anything you can look up. Do not block unrelated branches on that research:
only questions downstream of the unsettled fact wait. The _decisions_ are the
user's: put each to them through the Q&A tool and wait.

The session is done when the frontier is empty: every branch of the design tree
has been visited and nothing remains silently assumed. Ask for the final
shared-understanding confirmation through the Q&A tool. Do not act on the result
until the user confirms it.
