// Copilot Chat History Widget Logic
// This module manages chat history, including time, model, token usage, and cost estimation.
// Data is saved to a local JSON file in the Codespace for persistence.

import * as fs from 'fs';
import * as path from 'path';

const HISTORY_DIR = path.join(process.cwd(), '.copilot-history');
const HISTORY_FILE = path.join(HISTORY_DIR, 'history.json');

export interface CopilotChatEntry {
  timestamp: string; // ISO string
  prompt: string;
  model: string;
  tokens: number;
  estimatedCostUSD: number;
}

export function ensureHistoryDir() {
  if (!fs.existsSync(HISTORY_DIR)) {
    fs.mkdirSync(HISTORY_DIR);
  }
}

export function loadHistory(): CopilotChatEntry[] {
  ensureHistoryDir();
  if (!fs.existsSync(HISTORY_FILE)) return [];
  const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
  try {
    return JSON.parse(raw) as CopilotChatEntry[];
  } catch {
    return [];
  }
}

export function saveHistory(history: CopilotChatEntry[]) {
  ensureHistoryDir();
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');
}

export function addChatEntry(entry: CopilotChatEntry) {
  const history = loadHistory();
  history.push(entry);
  saveHistory(history);
}

export function estimateTokenCost(model: string, tokens: number): number {
  // Example rates (as of 2025, update as needed)
  const rates: Record<string, number> = {
    'gpt-4': 0.03 / 1000, // $0.03 per 1K tokens
    'gpt-4-32k': 0.06 / 1000,
    'gpt-3.5-turbo': 0.002 / 1000
    // Add more models as needed
  };
  const rate = rates[model] || 0.03 / 1000;
  return +(tokens * rate).toFixed(6);
}

// Example usage:
// addChatEntry({
//   timestamp: new Date().toISOString(),
//   prompt: 'How do I use VS Code?',
//   model: 'gpt-4',
//   tokens: 1200,
//   estimatedCostUSD: estimateTokenCost('gpt-4', 1200)
// });

// To display history, loadHistory() returns all entries.
