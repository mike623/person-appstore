<!--
  PUBLIC profile corpus for the AskMike butler chat.
  Distilled from career-ops/cv.md + career-ops/article-digest.md by the
  `distill-public-profile` skill, then human-reviewed before shipping.

  RULES (why this file exists):
  - PUBLIC. Every line here is answerable by a public bot to anyone.
  - Facts only, third person. No interview framing, no title-framing
    rules, no attribution-boundary lines, no gap lists, no compensation
    or bargaining notes, no per-company targeting, no phone or personal
    email. See the distill-public-profile skill for the full strip list.
  - Private strategy stays in career-ops and does not ship here.
-->

# Mike Wong — Professional Profile

Senior software engineer. Based in Doncaster, England, United Kingdom. 13+ years building full-stack products.
Contact: hello@namike.me · GitHub @mike623 · namike.me · LinkedIn /in/mike-wong-namike.
Open to new roles in 2026.
Languages: Chinese (native/bilingual), English (full professional), Mandarin (professional working).

## Summary

Senior software engineer who owns the solution architecture and then builds it — designs the solution, works it through with the team into deliverable tickets, and writes a substantial share of the code personally (roughly half of each week). Specialises in cloud-native, event-driven systems on AWS (Lambda, ECS, Bedrock, DynamoDB, DocumentDB, RDS, OpenSearch/Elasticsearch, SQS, SNS, Athena, Glue, CDK, S3) and full-stack delivery with TypeScript, Node.js, React, and Next.js. AWS Certified Solutions Architect – Associate.

Has delivered across regulated healthcare, enterprise SaaS, consumer and hybrid mobile, IoT and data R&D, and systems-integration consulting, in both the UK and Hong Kong, and adapts to a new domain quickly. Recent work spans two transferable problem classes: integrating against externally mandated standards under conformance testing and audit, and putting large language models into production over real business data with guardrails, human-in-the-loop escalation, and automated evaluation.

## Experience

### Blinx Solutions — Senior Software Engineer · United Kingdom · June 2021–June 2026

Senior engineer on PACO, a cloud-native NHS-aligned care platform (a Global Health Record, not a traditional org-bound EPR) used by 200+ healthcare organisations across 2M+ patient records and 10,000+ daily patient interactions. Owned solution architecture across the integration, AI, and booking workstreams, worked designs through with the team into deliverable tickets, and built a large share of them personally. Split roughly half hands-on production code, half design and coordination.

**Platform & architecture**
- Designed and evolved a microservices, event-driven architecture on AWS — Lambda, ECS, SQS, SNS, DynamoDB, DocumentDB, RDS, Athena, Glue, OpenSearch, PostgreSQL, MySQL — carrying 100+ integrations across fault-tolerant healthcare services.
- Separate deployables per business domain behind one URL domain (fronted by routing/gateway), all sharing one PostgreSQL database. Services own their domain tables; a shared kernel of patient and clinician demographics is read directly by everything to keep a single source of truth — a deliberate coupling chosen over per-service copies that would risk divergent patient identity.
- Multi-tenant on shared tables with an `org_id` column (no database-per-org, no schema-per-org). Row-level security was deliberately not used: a user holds access to a *set* of organisations (cross-org reading is a product requirement), so the tenant boundary is not the query boundary; enforcement lives in the service layer.
- Full-stack with TypeScript, Node.js, AdonisJS, React, Next.js, GraphQL, and Vite; migrated legacy apps to React/Next.js with microfrontends via Module Federation.
- CI/CD and Infrastructure-as-Code with AWS CDK, Terraform, Serverless Framework, GitHub Actions, CircleCI, Docker, Kubernetes, and service meshes.
- Production observability with OpenTelemetry, Grafana, and InfluxDB, driving incident root-cause analysis; instrumented the LLM path with OpenTelemetry so agent behaviour was traceable in production rather than inferred.
- Accessibility built into engineering practice: accessibility-driven markup as the basis for test selectors, WCAG checks embedded as CI quality gates.
- Security as routine practice: least-privilege IAM, KMS encryption at rest, Secrets Manager, WAF and CloudTrail across the estate; mTLS on every NHS service API interaction with VPN and IP allowlisting where required; OWASP-informed review, Dependabot/CVE monitoring in CI, and remediation of third-party penetration-test findings.

**PACO OS — clinical AI (consultation documentation and chat-to-data)**
- Designed and built live consultation capture: Deepgram streaming transcription into AWS Bedrock summarisation, producing draft patient summaries, draft clinician summaries, and draft fit notes (Med3) as structured fill-in-the-blank output for clinician review — never auto-filed. Piloted with GP practices.
- Built, with another engineer, a clinician chat-to-data agent over prescription and observation data. Replaced a pure vector-search baseline with hybrid retrieval: parameterised LangChain query tools with controlled parameters for coded clinical data (no free-form SQL — no injection, no hallucinated joins), keeping semantic/vector search as a safety net for observations recorded as uncoded free text. The agent fuses both paths, evaluates the result, then retries or escalates to a human reviewer.
- Raised answer correctness from 30% to 80% — in order of impact: prompt design, guardrails, the shift from vector search to deterministic parameterised queries, and a model upgrade. Measured by an automated evaluation suite that runs fixed questions like unit tests and scores answers with an LLM judge against deterministic ground truth from the database, corroborated by clinician correctness review.
- Inference on AWS Bedrock, in-region; rollout deliberately gated to a clinician pilot given the risk profile of clinical information.

**NHS interoperability — EPS, ITK v3, MESH, GP Connect, dm+d**
- Co-designed and co-built, with another senior engineer, the platform's live Electronic Prescription Service integration across the full lifecycle — issue, outbound notification, cancellation, and status tracking — over ITK v3 (FHIR) with CIS2 smartcard authentication, spanning infrastructure, data flow, auth, and handler logic.
- Produced the evidence for NHS ITK3/EPS supplier conformance testing and fixed the failures it surfaced, taking the integration to live clinical use; supplied technical risk input (including where existing controls such as encryption were insufficient) to the clinical safety case owned by the business team.
- Built MESH as a general-purpose message delivery service rather than an EPS-specific client, carrying ITK v3, GP Connect, and EPS on one transport: API Gateway + Lambda over TLS, S3 as message store for audit and event triggering, DynamoDB for state, following NHS reference implementation patterns. Delivery is at-least-once with the message id used for idempotency so replays are a no-op; failures go to a DLQ plus notification, never silent infinite retry. Because MESH itself gives no exactly-once guarantee, exactly-once *effect* was built at the service boundary via idempotent handlers.
- Automated dm+d dictionary ingestion with auditable, backward-compatible versioning so historical prescriptions stay resolvable across releases.
- Built a C# / .NET API bridge exposing the EMIS clinical system's native Windows COM interface as a service-oriented API, unblocking SaaS integration with a legacy desktop protocol.

**PACO Connect & PACO for Patients — appointment booking at scale**
- Designed and built the booking engine end to end — serverless AWS CDK infrastructure, backend, and frontend — plus the patient-facing web app, making a two-sided booking system: the provider side publishes and manages slot inventory, the patient side consumes it, both writing to the same pre-generated slot rows.
- Eliminated double-booking under high concurrent load with optimistic locking on the slot row: the write only lands if the slot is unchanged since read, and the losing request retries against fresh state.
- Closed cross-tenant permission gaps by re-deriving service-provider access server-side as a two-hop check (user↔organisation relationship, then patient↔organisation registration), never trusting it from the client.

**PACO GP — analytics and reporting**
- Refactored the analytics and reporting module (QOF, population-health cohorts, demand and capacity, workforce) and integrated it with the health-form system: fixed performance bottlenecks, redesigned the UI/UX, cleared interaction defects, and tightened authorisation with role-based access control.
- Analytics runs on a separate Amazon Redshift store (not a read replica) fed by two daily AWS Glue pipelines — external EPRs such as EMIS, and the transactional Postgres — at D-1 freshness. Batch was the deliberate fit: QOF is a quarterly measure and population health is longitudinal, so daily is well inside clinical tolerance and streaming would add cost for no benefit.

**Collaboration & delivery**
- Mentored engineers by working designs through with them into scoped tickets; verified reported bugs, traced root cause, and assessed blast radius before dispatching them to junior engineers.
- Partnered with product on what a PM cannot produce alone: technical acceptance criteria with required test cases, architecture-decision write-ups, indicative estimates, and explicit risks and trade-offs.
- Authored internal AI agent skills adopted org-wide, and used Claude Code, GitHub Copilot, and Codex in daily practice for bug investigation, architecture-decision drafts, test-case generation, code review, and ticket elaboration.

### LYNK — Full Stack Engineer · Hong Kong · April 2016–November 2020
Web management platforms for enterprise clients (MongoDB as the primary business database), internal performance/workflow systems, and web communication platforms. Ran agile team processes, gathered requirements and translated them into solution designs, and built mobile apps with React Native and native technologies.

### Sanuker — Software Engineer · Hong Kong · February 2015–March 2016
Native and hybrid mobile apps, web apps and backends with Node.js, Java, and Ruby; big-data R&D and image-processing workflows in Python; IoT prototypes with Arduino, Raspberry Pi, and 3D printing; DevOps with Docker, AWS APIs, and Jenkins.

### Jardine OneSolution — System Analyst · Hong Kong · August 2014–January 2015
Client requirements and solution design; custom solutions with MS SQL and PHP; in-house .NET work.

### Creasant Digital — Web Programmer · Hong Kong · December 2012–May 2014
Mobile and web applications with HTML/JavaScript/CSS; internal frontend and backend systems with PHP and VB; maintenance of existing sites.

## Skills

- **Full-stack:** end-to-end delivery across frontend, backend, APIs, and services.
- **Core practice:** REST/GraphQL API design, microservices, cloud-native and event-driven architecture, automated testing, secure coding, authn/authz, role-based access control, concurrency control, CI/CD, IaC, observability.
- **Leadership:** solution design and technical direction, system design, engineering standards, mentoring, work breakdown and dispatch, technical acceptance criteria, architecture decision records, effort estimation, risk/trade-off analysis, product partnership, agile delivery.
- **AI / LLM:** AWS Bedrock, LangChain, LangGraph, OpenAI, Anthropic Claude, Google Gemini, RAG and hybrid retrieval, tool-calling agents with parameterised query tools, embeddings, vector search, FAISS, Deepgram streaming transcription, Model Context Protocol (MCP), prompt engineering, automated evaluation with LLM-as-judge, guardrails, human-in-the-loop escalation, LLM observability with OpenTelemetry, agentic coding with Claude Code / Copilot / Codex.
- **Backend:** TypeScript, Node.js, NestJS, AdonisJS, GraphQL, REST, authn/authz, multi-tenant authorisation, optimistic locking and concurrency control, C# / .NET, Java, Ruby, PHP, Python.
- **Frontend:** React, Next.js, Vue, HTML5, JavaScript, CSS, Redux, MobX, React Query, Webpack, Vite, microfrontends, Module Federation; accessibility-driven markup with WCAG CI gates.
- **Systems integration & NHS:** third-party/enterprise API integration at scale (100+), legacy-protocol interop; EPS over ITK v3 (FHIR) full lifecycle live, CIS2 auth, MESH transport, GP Connect, dm+d ingestion, ITK3/EPS conformance evidence, technical risk input to clinical safety cases, EMIS interop.
- **Cloud:** AWS (Lambda, ECS, Bedrock, DynamoDB, DocumentDB, RDS, SQS, SNS, Athena, Glue, OpenSearch, S3), Azure, GCP; AWS Certified Solutions Architect – Associate.
- **Data:** data modelling and DB administration, PostgreSQL, MySQL, MS SQL, MongoDB, DocumentDB, DynamoDB, Prisma, Knex.js, Redis, event-driven pipelines, Amazon Redshift + Glue, big-data R&D.
- **DevOps / reliability:** AWS CDK, Terraform, Serverless Framework, GitHub Actions, CircleCI, Docker, Kubernetes, service meshes, Jenkins; OpenTelemetry, Grafana, InfluxDB, production incident root-cause analysis.
- **Security:** least-privilege IAM, KMS, Secrets Manager, VPC isolation, WAF, CloudTrail, server-side authorisation; OWASP-informed review, Dependabot/CVE monitoring, penetration-test remediation; mTLS, VPN/IP allowlisting, TLS in transit.
- **Mobile:** React Native, Ionic, native iOS/Android; Arduino, Raspberry Pi, 3D printing for IoT prototyping.

## Education & certifications

- The Hong Kong Polytechnic University — BA, Computing (2014–2018, part-time alongside full-time work).
- AWS Certified Solutions Architect – Associate.
- Fundamentals of AI Agents Using RAG and LangChain.
- Generative AI: Prompt Engineering Basics.
