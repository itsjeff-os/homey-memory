import { describe, expect, it } from 'vitest';
import { createThinReasoningFrame } from '../packages/reasoning/frame';

describe('reasoning frame', () => {
  it('keeps O-I-N-C-F fields separate', () => {
    const frame = createThinReasoningFrame('user provided context');
    expect(frame.observation).toHaveLength(1);
    expect(frame.interpretation).toEqual([]);
    expect(frame.inference).toEqual([]);
    expect(frame.conclusion).toEqual([]);
    expect(frame.feedback).toEqual([]);
  });
});
