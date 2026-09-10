# Nerds Who Fish philosophies

These philosophies apply across Nerds Who Fish: client work, our own products, internal tools, operations, documentation, and communication. They should guide decisions even when nobody outside the company will see the result.

## 1. Don't be greedy. Don't be evil

We want to build a successful business. We won't do it at the expense of people, the planet, or the communities whose work makes ours possible.

We choose work that contributes positively to people and the world. We consider what the tools we build enable, who they affect, and the harm their use could cause. We care about the environment and account for the resources our work consumes and the waste it creates.

We actively contribute back to open source and support work that advances human wellbeing and the health of the planet. We reject projects and uses that conflict with these principles, even when they would make us money.

We put that into practice through:

- **Consider who bears the consequences.** Evaluate effects on users, workers, communities, and people who never agreed to use the tool.
- **Draw boundaries before accepting work.** Decline projects built around deception, exploitation, or foreseeable harm. Reconsider existing work when its purpose or impact changes.
- **Treat environmental impact as an engineering concern.** Avoid unnecessary compute, storage, data movement, and hardware replacement. Measure meaningful costs where we can.
- **Contribute upstream.** Return useful fixes, documentation, and improvements to the open-source projects we depend on, while respecting customer confidentiality.
- **Build for inclusion.** Consider accessibility and who might be excluded by the assumptions we make.
- **Act when we find harm.** Raise concerns, investigate, and change or stop the work when it conflicts with these principles.

## 2. A culture that improves the work

We make it safe to report mistakes, challenge decisions, and suggest unfamiliar ideas. Everyone has a responsibility to help improve the work, regardless of title or which system they own.

- **Learn without blame.** When something goes wrong, investigate the conditions, information, and safeguards that shaped the outcome. People can acknowledge mistakes and ask for help without humiliation. We take responsibility for corrective actions and follow them through.
- **Give direct, constructive feedback.** Be specific about the problem, its impact, and a better path. Challenge ideas and decisions respectfully. Listen to feedback, ask questions, and change our minds when the evidence warrants it.
- **Make room for novel ideas.** Encourage unusual approaches, questions, and connections across disciplines. Give promising ideas a fair hearing and test them with focused experiments. Familiarity is not proof that the current approach is best.
- **No change is off limits for consideration.** Existing architecture, processes, and past decisions can all be challenged. Judge a proposed change by its benefits, risks, and consequences, even when it requires substantial work. Apply the standards in [Engineering rigor](#4-engineering-rigor).
- **Improve beyond our own systems.** When the right solution requires changing a dependency, shared platform, or another team's system, we investigate and help make that improvement. We work with its owners and maintainers, understand the wider impact, and coordinate review and rollout. Ownership boundaries should not force us to preserve a defect or build a permanent workaround. See [Reuse before reinvention](#reuse-before-reinvention).

## 3. Human accountability for AI output

We review what AI generates. Every line. Every word.

A human reads, understands, and takes responsibility for AI-generated code, configuration, documentation, and customer-facing language before it ships. Review covers correctness, security, factual claims, and whether the output belongs in the solution at all. Material changes after review require another review.

That responsibility starts before we share the output, including with each other. "I haven't read this, but Claude said..." passes the work of understanding and checking it to someone else. We read it, verify its claims, and decide whether we stand behind it before asking anyone else to spend time on it. A model's answer is not evidence that its claims are true.

We are honest about authorship. When we share AI-generated wording, we acknowledge AI's contribution instead of presenting it as entirely our own writing. Attribution does not excuse unreviewed content, and reviewing content does not erase how it was produced.

Tests, automated checks, and additional AI reviews support human judgment. They cannot provide human approval. If we cannot explain or verify an output, it is not ready to ship. Responsibility stays with us regardless of which tool produced the draft.

Using AI does not lower our engineering standards. AI-assisted changes follow the same testing, independent review, and approval requirements described in [Engineering rigor](#4-engineering-rigor).

## 4. Engineering rigor

We take responsibility for understanding what we build and proving that it works. We investigate assumptions, make deliberate tradeoffs, and verify behavior in the environment where it will run.

When scope must shrink, we deliver a smaller complete solution. We preserve the quality of what we agree to deliver.

### Quality and review

We make that responsibility concrete through repeatable practices:

- **Automated testing.** Tests cover important behavior, integrations, and failure paths. Bug fixes include regression coverage where a test can meaningfully prevent the same failure. We judge tests by what they prove.
- **Reviewed pull requests.** Changes require pull request approval from another experienced engineer before merge. The reviewer must be a human other than the author, with the expertise to evaluate the change. Review examines correctness, security, maintainability, and the evidence that the change works. Material changes after approval require renewed review and approval. Self-review and AI review do not satisfy this requirement.
- **Required CI checks.** Pull requests must pass the project's required automated tests and applicable build, type, lint, and security checks before merge. Failures are investigated and resolved.
- **Validation in the target environment.** We exercise the important behavior where the software will run, including relevant failure paths. A passing build or a convincing demo is insufficient evidence of a finished system.
- **Observability from the start.** We build and verify the telemetry needed to understand important behavior and diagnose failures as part of delivery. See [Observability is a cornerstone](#observability-is-a-cornerstone).

### Architecture and decisions

We record consequential architectural decisions in Architecture Decision Records (ADRs), with their context, options considered, chosen approach, and positive and negative consequences. Rejected alternatives explain why the choice fits. When a decision changes, a new ADR supersedes the old one and preserves the history, so the next engineer can understand how we got here.

### Observability is a cornerstone

We build the ability to understand a system alongside the system itself. We need to know when it fails, what users experience, and where to investigate.

We put that into practice through:

- **Structured, correlated telemetry.** Useful logs, metrics, and traces cover important operations and failure paths. We propagate context across services and connect errors to the operation that caused them, so we can follow a request through the system.
- **Alerts someone can act on.** Each alert has an owner and a useful next step. Alerts identify conditions that need attention. Repeated noise gets investigated and fixed so it does not hide real failures.
- **Visibility into customer experience.** We measure failed operations and degraded performance alongside service availability. Browser applications include visibility into failures on the user's side, where a healthy server does not guarantee a working experience.
- **Verified instrumentation.** We exercise important behavior and failure paths, confirm that telemetry arrives, and check that it supports diagnosis. Installing a library is only a step toward that result. This verification is part of [Quality and review](#quality-and-review).
- **Privacy by design.** We collect only what we need to operate the system safely. Secrets and sensitive customer content do not belong in telemetry. We review what instrumentation captures before enabling it.

### Reuse before reinvention

We look for existing solutions before creating another implementation. We inspect our own code, shared tools, and established products, then judge whether they meet the actual requirements.

We put that into practice through:

- **Search before building.** Check existing implementations and explain why they fit or fall short. Build something new when the requirements justify it.
- **Improve the shared source.** Fix reusable components where they live instead of copying them and letting versions drift. Improvements reach everyone who depends on the shared implementation.
- **Make reuse discoverable.** Give shared components clear responsibilities, interfaces, documentation, and examples. Put them where the next caller can find and use them.
- **Evaluate dependencies.** Consider maintenance, security, licensing, ownership, and operating costs before adopting something. Reuse requires understanding what we are taking responsibility for.
- **Extract real common needs.** Build abstractions around demonstrated use cases. We avoid forcing unrelated problems into the same abstraction merely because their code looks similar. Generality alone is not a reason to add complexity.

### Choose technology with judgment

We use AI where it earns its place. Sometimes the better solution is conventional software, an existing product, or fixing the way the work gets done.

Our recommendations should account for reliability, operating cost, privacy, and the people who will maintain the result. We explain why a technology fits and what it costs to live with that choice.

We put that into practice through:

- **Start with the problem.** Understand the outcome and constraints before choosing a stack.
- **Make complexity earn its place.** Every service, dependency, and abstraction creates something someone must maintain.
- **Evaluate AI against alternatives.** Compare accuracy, predictability, cost, privacy, and failure behavior. Use simpler approaches when they meet the need.
- **Consider the full lifecycle.** Account for deployment, operation, upgrades, handoff, and eventual replacement.
- **Test consequential assumptions.** Validate uncertain capabilities with focused experiments before committing the project to them.
- **Explain the tradeoffs.** Record consequential choices in ADRs, including why we rejected alternatives and what would make us reconsider. See [Architecture and decisions](#architecture-and-decisions).

Our preferred tools give us a starting point. The requirements determine the final choice:

- **Go for most software.** Go is our preferred language. When another language better fits the problem, platform, or people maintaining the result, we use it.
- **React and JavaScript for frontends.** These are our defaults for web interfaces. We choose a different framework, language, or simpler approach when it better serves the application and its users.
- **Codified infrastructure.** When infrastructure is needed, we define it in version-controlled code and apply the same review discipline as application changes. OpenTofu is our default for provisioning. We use tools suited to the task, such as Ansible for configuration, when they fit better. Choosing another tool preserves the requirement for reproducible, reviewable infrastructure.

---

Developed with AI assistance. Reviewed and adopted by Nerds Who Fish. We own these commitments.

