export interface SessionInfo {
  partition: string;
  homepage: string;
}

export interface CommonConfig {
  sessions: Record<string, SessionInfo>;
}
