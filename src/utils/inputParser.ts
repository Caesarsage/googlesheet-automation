// Utility to parse various input formats into rows for sheets
export function parseInput(input: any): any[] {
  if (Array.isArray(input)) return input;
  if (typeof input === 'object') return [input];
  // Add more parsing logic as needed
  throw new Error('Unsupported input format');
}
