// Run: node --test client/src/lib/help.test.mjs
import assert from 'node:assert/strict';
import test from 'node:test';
import { answerHelp } from './help.js';

test('answers questions about SARVAS', () => {
  assert.match(answerHelp('How do I sign in?').answer, /Connect GitHub/);
  assert.match(answerHelp('Who merges the pull requests?').answer, /never pushes/);
  assert.match(answerHelp('Is my code sent to an AI?').answer, /AI provider/);
  assert.match(answerHelp('How do I ask about my codebase?').answer, /Ask tab/);
});

test('says when a question is out of context', () => {
  for (const q of ["What's the weather in Paris?", 'Who won the world cup', '', '!!!']) {
    assert.equal(answerHelp(q).status, 'outside_context', q);
  }
});
