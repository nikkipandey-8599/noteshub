import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeSubjectSuggestions} from '../src/lib/subjects.js';
test('catalog suggestions include unused subjects and normalize aliases',()=>{assert.deepEqual(mergeSubjectSuggestions(['Cloud Computing','Data Structures'],['DSA','cloud computing','']),['Cloud Computing','Data Structures'])});
test('catalog fallback preserves existing subjects',()=>{assert.deepEqual(mergeSubjectSuggestions([],['Python','Python']),['Python'])});
