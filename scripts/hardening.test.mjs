import test from 'node:test';import assert from 'node:assert/strict';import {matchesQuery} from '../src/upgrade/search.js';
test('short terms match word prefixes, not arbitrary substrings',()=>{assert.equal(matchesQuery('cost most post','os'),false);assert.equal(matchesQuery('operating systems','os'),true);assert.equal(matchesQuery('OS fundamentals','os'),true)});
