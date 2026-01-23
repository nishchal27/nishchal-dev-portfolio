// In-memory session management for AI conversations
// Sessions expire after 30 minutes of inactivity

export interface SessionMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface Session {
  id: string;
  messages: SessionMessage[];
  lastActivity: number;
  metadata?: Record<string, unknown>;
}

class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private readonly timeoutMs: number;
  private readonly maxMessagesPerSession = 10; // Keep last 10 messages for context

  constructor() {
    this.timeoutMs = parseInt(
      process.env.SESSION_TIMEOUT_MS || "1800000",
      10
    ); // 30 minutes default

    // Cleanup expired sessions every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  private cleanup(): void {
    const now = Date.now();
    const expiredSessions: string[] = [];

    for (const [id, session] of this.sessions.entries()) {
      if (now - session.lastActivity > this.timeoutMs) {
        expiredSessions.push(id);
      }
    }

    expiredSessions.forEach((id) => this.sessions.delete(id));
  }

  createSession(initialMetadata?: Record<string, unknown>): string {
    const id = crypto.randomUUID();
    const session: Session = {
      id,
      messages: [],
      lastActivity: Date.now(),
      metadata: initialMetadata,
    };

    this.sessions.set(id, session);
    return id;
  }

  getSession(id: string): Session | null {
    const session = this.sessions.get(id);
    if (!session) {
      return null;
    }

    // Check if expired
    if (Date.now() - session.lastActivity > this.timeoutMs) {
      this.sessions.delete(id);
      return null;
    }

    return session;
  }

  addMessage(
    sessionId: string,
    role: "user" | "assistant" | "system",
    content: string
  ): boolean {
    const session = this.getSession(sessionId);
    if (!session) {
      return false;
    }

    session.messages.push({
      role,
      content,
      timestamp: Date.now(),
    });

    // Keep only last N messages
    if (session.messages.length > this.maxMessagesPerSession) {
      session.messages = session.messages.slice(-this.maxMessagesPerSession);
    }

    session.lastActivity = Date.now();
    return true;
  }

  getMessages(sessionId: string): SessionMessage[] {
    const session = this.getSession(sessionId);
    return session?.messages || [];
  }

  updateMetadata(sessionId: string, metadata: Record<string, unknown>): boolean {
    const session = this.getSession(sessionId);
    if (!session) {
      return false;
    }

    session.metadata = { ...session.metadata, ...metadata };
    session.lastActivity = Date.now();
    return true;
  }

  deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  clearExpiredSessions(): void {
    this.cleanup();
  }
}

export const sessionManager = new SessionManager();
