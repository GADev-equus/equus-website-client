// Articles data store for the Equus website
// Each article is addressed by a unique slug used in the /articles/:slug route

export const articles = [
  {
    slug: 'ai-powered-tfl-assistant',
    title:
      'The Future of Transit: How AI Agents Are Revolutionizing London Underground Navigation',
    excerpt:
      "Imagine having a personal transport expert for every single London Underground line—one who knows the quirks of the Circle Line, the shortcuts on the Northern Line, and the exact timing of the Victoria Line's high-frequency service.",
    description:
      'Our multi-agent TFL AI system uses specialized GPT-4o agents for each Underground line, real-time TFL data, and streaming intelligence to deliver context-aware, human-in-the-loop journey planning.',
    date: '2025-07-30',
    author: 'Equus Systems',
    tags: ['AI', 'Multi-agent', 'Real-time', 'Voice', 'Whisper'],
    sections: [
      {
        heading: 'Beyond Chatbots: The Age of Specialized AI Agents',
        body:
          'Instead of one overwhelmed assistant, this system employs 14 specialized experts—each with deep knowledge of their specific Underground line—powered by GPT-4o.\n\n' +
          "• Circle Line Agent: Master of Zone 1's orbital route and connection strategies\n" +
          '• Bakerloo Line Agent: Expert in the historic line from Harrow to Elephant & Castle\n' +
          '• District Line Agent: Navigator of the complex western and southwestern branches\n' +
          "• Central Line Agent: Specialist in London's longest east-west corridor\n" +
          '• Northern Line Agent: Guide for the Bank and Charing Cross branch complexities\n' +
          '• Piccadilly Line Agent: Your Heathrow Airport connection authority\n' +
          '• Victoria Line Agent: High-frequency automated service expert\n' +
          '• Jubilee Line Agent: Modern line and Canary Wharf connection specialist\n' +
          '• Metropolitan Line Agent: Historic line extending into Buckinghamshire\n' +
          '• Hammersmith & City Agent: Cross-London connector expertise\n' +
          '• Waterloo & City Agent: Business shuttle specialist (weekdays only)\n' +
          "• Elizabeth Line Agent: Crossrail's newest high-capacity railway expert\n" +
          '• DLR Agent: Docklands Light Railway authority\n' +
          '• Network Status Agent: System-wide disruption and service intelligence',
      },
      {
        heading: 'The Magic of Context-Aware Intelligence',
        body:
          'Agents understand context—passenger psychology, peak patterns, accessibility needs, and live service.\n\n' +
          'Dynamic Agent Selection: Queries are routed to the most relevant line expert(s), often coordinating multiple agents for optimal routes and alternatives.\n' +
          "Real-Time Intelligence Integration: Each agent has live access to TFL's official API for disruptions, status changes, and timing, enabling dynamic rerouting and precise estimates.",
      },
      {
        heading: 'Streaming Intelligence: The Netflix of Transport Advice',
        body:
          "Server-Sent Events (SSE) stream responses in real time, showing the system's reasoning as it unfolds: \n" +
          '1. Initial Analysis: Analyzing your route...\n' +
          '2. Live Data Integration: Checking current line status...\n' +
          '3. Alternative Evaluation: Considering options...\n' +
          '4. Final Recommendation: Optimal route identified.',
      },
      {
        heading: 'The Human-in-the-Loop Revolution',
        body: 'For complex journeys or multiple viable routes, the system collaborates with users to confirm preferences before delivering step-by-step guidance (e.g., Elizabeth Line vs Piccadilly Line to Heathrow).',
      },
      {
        heading: 'Visual Intelligence: Colors That Communicate',
        body: 'Messages are styled with official TFL colors per line (e.g., Victoria light blue, Central red), enhancing cognition in multi-line journeys. Animated typewriter effects and status indicators mirror Underground aesthetics.',
      },
      {
        heading: 'Voice-First Future: Speaking the Language of London',
        body: 'Web Speech API provides immediate voice-to-text tuned for transport terms. OpenAI Whisper integration improves accuracy in noisy environments for complex queries.',
      },
      {
        heading: 'The Architecture Behind the Magic',
        body: 'React 18 + Vite + Tailwind enable smooth, performant UI.\nState Management: ConversationContext, TFLContext, and AuthContext coordinate messaging, line colors/status, and secure sessions.\nReal-Time Data: Sync every 30s with TFL API, backend AI services, and user preferences.',
      },
      {
        heading: 'Security-First Design for Public Infrastructure',
        body: 'JWT authentication with auto-refresh; strict input sanitization; robust rate limiting; and secure cross-domain configuration for public-facing reliability.',
      },
      {
        heading: 'Performance That Scales with London',
        body: 'Code splitting and lazy loading ensure fast first paint. Caching via localStorage and HTTP improves responsiveness. Mobile-first optimization guarantees accessible touch targets and smooth scrolling.',
      },
      {
        heading: "The Future We're Building",
        body: "What's Next:\n• Offline capabilities via service workers\n• Predictive crowd and delay intelligence\n• Enhanced accessibility with voice-guided navigation\n• Multi-modal integration (bus, rail, cycling, walking)\n• Personalized learning of travel patterns",
      },
      {
        heading: 'Behind the Scenes: Technical Implementation',
        body:
          '// Example: Dynamic agent selection based on query\n' +
          'const routeQuery = "Paddington to Canary Wharf fastest route";\n' +
          'const relevantAgents = analyzeQuery(routeQuery);\n' +
          "// Returns: ['elizabeth', 'jubilee', 'circle'] based on station coverage\n\n" +
          '// Stream processing with real-time updates\n' +
          'const streamResponse = await tflApi.streamMessage(query, threadId);\n' +
          'streamResponse.onmessage = (event) => {\n' +
          '  const chunk = JSON.parse(event.data);\n' +
          '  updateUI(chunk); // Real-time UI updates as AI thinks\n' +
          '};',
      },
      {
        heading: 'Making Complex Technology Feel Simple',
        body: 'While the backend coordinates agents, real-time data, and state, the UI remains a clean chat interface that understands London transport—advanced tech as invisible infrastructure.',
      },
      {
        heading: 'Try It Yourself',
        body: 'Experience it at https://ai-tfl.equussystems.co',
      },
    ],
  },
  {
    slug: 'ai-tutor-platform',
    title:
      'Revolutionizing Education: How AI Tutoring is Personalizing Learning for Every Student',
    excerpt:
      'Imagine a tutor that adapts in real time to your learning style, remembers your progress, and generates targeted practice—our AI Tutor makes that a reality.',
    description:
      'A comprehensive AI tutoring system powered by Model Context Protocol (MCP), adaptive response intelligence, context-aware memory, and curriculum-aligned retrieval to deliver personalized biology learning at scale.',
    date: '2025-07-30',
    author: 'Equus Systems',
    tags: ['AI', 'Personalization', 'Adaptive Learning', 'MCP', 'Analytics'],
    sections: [
      {
        heading:
          'Beyond One-Size-Fits-All: The Era of Personalized AI Education',
        body:
          "Traditional education treats students the same—pace, style, and materials—while real learners are diverse. Our AI Tutor adapts automatically to each student's preferences and needs.\n\n" +
          'The Intelligence Behind Personalization: MCP builds a contextual understanding across interactions, tracking knowledge gaps, learning preferences (visual vs. detailed), question difficulty patterns, and progress velocity to tailor every response.',
      },
      {
        heading: 'Adaptive Response Intelligence: Teaching That Evolves',
        body:
          'Dynamic Response Types are selected automatically: \n\n' +
          '• Teaching Mode: Patient, step-by-step explanations with analogies.\n' +
          '• Information Mode: Concise, reference-style facts.\n' +
          '• Exam Question Mode: Practice questions targeting syllabus topics.\n' +
          '• Mark Scheme Mode: Detailed marking criteria and model answers.\n\n' +
          'The system chooses the best mode using context, learning history, and current goals.',
      },
      {
        heading: 'The Science of Context-Aware Learning',
        body:
          'Conversation Memory That Matters: The AI remembers conceptual relationships, error patterns, learning velocity, and preferred example styles to improve future responses.\n\n' +
          'Document Retrieval & Knowledge Synthesis: MCP retrieves curriculum-aligned documents and synthesizes answers at the right level.\n\n' +
          '// Example retrieval flow\n' +
          'const query = "What happens during mitosis?";\n' +
          'const relevantDocs = await mcp.getRelevantDocuments(query);\n' +
          '// Retrieves diagrams and explanations, then crafts a level-appropriate response.',
      },
      {
        heading: 'User Experience That Adapts to You',
        body:
          'Smart Personalization Settings: \n' +
          '• Visual: Font size and markdown formatting.\n' +
          '• Learning Style: Auto or preferred response types; examples vs. core concepts; interactive practice.\n' +
          '• Study Mode Optimization: Homework help, exam preparation, concept review, or quick reference.\n\n' +
          'Intelligent Interface Design: Color-coded message types (teaching, exam, answers, summaries) and progressive disclosure with expandable details prevent overload.',
      },
      {
        heading: 'The Technology Stack Powering Personal Learning',
        body: "React 18's concurrent features ensure smooth interactions; Tailwind powers clear visual styling; the UI streams thinking progress as the AI processes queries.",
      },
      {
        heading: 'Context-Driven State Management',
        body:
          '// Core contexts\n' +
          'const { messages, sendMessage, relevantDocs } = useChat();\n' +
          'const { preferences, updatePreference } = useUserPreferences();\n' +
          'const { theme, fontSize, markdownEnabled } = useTheme();',
      },
      {
        heading: 'Secure Authentication for Educational Privacy',
        body: 'JWT authentication integration preserves continuity while protecting student data. Privacy-first design uses local storage for preferences, minimal data collection, and GDPR-compliant controls.',
      },
      {
        heading: 'Advanced Learning Features',
        body:
          'Exam Preparation Intelligence:\n' +
          '• Question Generation Engine: Targets knowledge gaps with tailored practice.\n' +
          '• Progressive Difficulty Scaling: Foundation → Application → Analysis → Evaluation → Synthesis.\n' +
          '• Mark Scheme Intelligence: Provides criteria and model answers for self-assessment.',
      },
      {
        heading: 'Learning Analytics That Matter',
        body:
          'Conceptual Understanding Tracking: Knowledge networks, misconception detection, and transfer learning.\n\n' +
          'Study Efficiency Optimization: Optimal review timing, cognitive load management, and velocity-aware adjustments.',
      },
      {
        heading: 'The Future of Personalized Education',
        body:
          'What Makes This Revolutionary: Socratic method prompts encourage discovery; metacognitive skill development improves how students learn.\n\n' +
          'Planned Enhancements:\n' +
          '• Visual Learning: Interactive diagrams, animations, virtual labs.\n' +
          '• Collaborative Learning: Study groups, teacher tools, parent dashboards.\n' +
          '• Advanced Assessment: Predictive performance, competency progression, real-time feedback.',
      },
      {
        heading: 'The Science Behind Effective AI Tutoring',
        body: 'Grounded in pedagogy: Zone of Proximal Development, Constructivism, Spaced Repetition, and Multimodal learning support (text, analogies, lists, Q&A).',
      },
      {
        heading: 'Beyond Traditional Boundaries',
        body:
          'Democratizing access to high-quality tutoring: 24/7 availability, infinite patience, and global accessibility.\n\n' +
          'Real-World Impact: Better concept retention, confidence, study efficiency, and exam performance.',
      },
      {
        heading: 'Technical Excellence in Educational Service',
        body: 'Performance: Sub-second responses sustain learning flow; intelligent caching accelerates common topics; mobile-first design supports on-the-go study.',
      },
      {
        heading: 'Accessibility and Inclusion',
        body: 'Universal design: Screen reader compatibility, full keyboard navigation, color-blind support, and clear language with definition tooltips.',
      },
      {
        heading: 'Experience the Future of Learning',
        body: 'Try our AI Tutor at https://ai-tutor.equussystems.co',
      },
      {
        heading: 'Getting Started',
        body: '1) Ask any biology question.\n2) Specify your learning goal.\n3) Customize preferences.\n4) Track your progress as the AI adapts.',
      },
      {
        heading: 'For Educators',
        body: 'Supplement instruction, generate practice materials, identify knowledge gaps, and enhance accessibility for diverse learning needs.',
      },
      {
        heading: 'The Learning Revolution Starts Now',
        body: 'AI tutoring makes learning more human by handling explanation and practice generation, freeing teachers to focus on inspiration, creativity, and social-emotional learning.',
      },
    ],
  },
];

export function getArticleBySlug(slug) {
  return articles.find((a) => a.slug === slug);
}

export function listArticles() {
  return [...articles];
}
