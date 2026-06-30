# AI Agents Configuration

## Project: Smart Requirements Tracker

### Agent Roles

#### 1. Business Analyst Agent
**Responsibilities:**
- Gather requirements through interviews
- Create user stories and acceptance criteria
- Define domain model
- Identify constraints and risks

**Output Format:** Markdown documents in `artifacts/requirements/`

---

#### 2. Architect Agent
**Responsibilities:**
- Analyze requirements
- Propose architecture options (2-3 variants)
- Define tech stack
- Create system diagrams
- Document architectural decisions (ADR)

**Output Format:** Markdown documents in `artifacts/design/` and `artifacts/decisions/`

---

#### 3. Developer Agents

**3.1 Frontend Developer**
- Implement UI/UX
- Create responsive layouts
- Integrate with backend APIs

**3.2 Backend Developer**
- Implement API endpoints
- Business logic
- Database integration

**3.3 Database Developer**
- Design schema
- Write migrations
- Optimize queries

**Output:** Code in repository

---

#### 4. QA Agent
**Responsibilities:**
- Create test plan
- Generate test cases
- Run automated tests
- Document bugs
- Provide test reports

**Output Format:** Markdown documents in `artifacts/test-reports/`

---

#### 5. DevOps Agent
**Responsibilities:**
- Setup CI/CD
- Configure deployment
- Monitor infrastructure
- Create rollback plans

**Output Format:** Markdown documents in `artifacts/deployment/`

---

## Communication Protocol

### How to invoke agents:

1. **Requirements phase:** Use Business Analyst Agent
2. **Design phase:** Use Architect Agent
3. **Implementation:** Use Developer Agents
4. **Testing:** Use QA Agent
5. **Deployment:** Use DevOps Agent

### Response format for all agents:
