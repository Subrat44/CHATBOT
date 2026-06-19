# Rule-Based Natural Language Processing (NLP) Chatbot Engine

A highly interactive educational sandbox and logic simulator built using **React 19**, **TypeScript**, and **Tailwind CSS**. This application demonstrates how deterministic rule sets, string normalization, lexical tokenization, and regular expression (Regex) evaluation form the absolute foundations of modern natural language processing.

---

## 🎨 Design Concept: Professional Polish
The workspace has been crafted under the **Professional Polish** design guidelines, offering a responsive dual-pane cockpit:
- **Left Side (The Console)**: An immersive chat simulator equipped with multiple scenario agents, suggestion trigger chips, and latency telemetry indicators.
- **Right Side (The Logic Engine)**: A step-by-step diagnostic trace log displaying live token extraction, substring matching weights, and custom rule-injection forms.

---

## 🚀 Key Features

### 1. Multi-Agent Scenarios
Toggle instantly between three distinct preloaded behavioral engines:
*   **Support Assistant**: A customer helpdesk module prioritizing FAQs on billing schedules, pricing guides, password resets, and supervisor escalation.
*   **ELIZA Psychotherapist**: A recreation of the historic 1966 Rogerian therapist, employing open-ended reflective pattern matching to turn statements into introspective questions.
*   **Adventure Quest**: A command-driven text adventure game where strict actions (`look`, `go north`, `take key`, `unlock`) steer a survival scenario.

### 2. The NLP Evaluation Pipeline
An exhaustive execution tracer inspects every single user query:
*   **Text Normalization**: How symbols are scrubbed, repeated spaces squeezed, and characters lowercased to secure uniform matches.
*   **Lexical Tokenization**: Deriving individual word arrays (word-tokens) from unstructured text inputs.
*   **Precedence Evaluation**: Shows exactly which rule was matched (Exact, Prefix, Substring, or RegExp) and lists its calculated confidence-match score.
*   **Step Logs**: Details chronological processing metrics and performance lookup times in milliseconds.

### 3. Dynamic Rule Injection
Extend the chatbot's database at runtime. Use the custom rule form to configure:
*   **Exact Matches**: Triggered only when the normalized text perfectly matches the target.
*   **Prefix Matches**: Triggers when user phrases start with designated search terms.
*   **Regex Matches**: Run powerful Javascript regular expression evaluations (e.g., `refund.*money`) directly in the scanner.
*   **Substring Contains**: Search for keyword arrays inside user sentences.

### 4. Live Match Simulator (Sandbox)
A real-time reactive card at the bottom allows you to type draft messages and instantly watch character normalization and tokenization happen dynamically as you type.

---

## 💡 The Importance of Rule-Based Chatbots in Modern Software

While modern Large Language Models (LLMs) excel at creative prose, rule-based systems remain highly critical in production and enterprise applications for several reasons:

1.  **Guaranteed Determinism & Zero Hallucinatory Risk**  
    For billing queries, banking details, medical instructions, and legal policies, giving an incorrect or "hallucinated" answer is a critical liability. Rule-based bots guarantee that only pre-reviewed, compliant, and legally checked responses are returned to users.
2.  **Unbeatable Latency & Efficiency**  
    Traditional rule evaluation resolves in sub-millisecond periods (<1ms) on client devices. This matches beautifully against cloud-based LLMs, which consume massive GPU power and require seconds to stream API responses.
3.  **High Security & Prompt-Injection Immunity**  
    With a strict rule compiler, there is zero risk of context windows being compromised, models being derailed by hostile prompts, or sensitive instruction databases being leaked.
4.  **Foundation of Hybrid Architectures**  
    Modern high-production conversational agents use rule engines as a primary guardrail shield or high-speed router. Queries are first processed by rule-based classifiers to resolve common FAQs instantly; only unrecognized, complex intents are passed upstream to expensive generative models.

---

## 🛠️ Architecture and Dependencies

-   **Frontend**: React 19, TypeScript, Vite
-   **Animations**: `motion` for physics-based entrance transitions
-   **Style System**: Tailwind CSS
-   **Icons**: Lucide React
-   **Module Rules**: Located inside `/src/data.ts` and evaluated sequentially via `processRuleEngine()`
