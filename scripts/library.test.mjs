import test from 'node:test';import assert from 'node:assert/strict';import {categoryOptions,relatedNotes,validatePdf} from '../src/lib/library.js';
test('category duplicates collapse',()=>assert.equal(categoryOptions([{subject:' Java '},{subject:'java'}],'subject').length,1));
test('related notes exclude private and current note',()=>{const n={id:'a',subject:'Java',tags:[]};assert.deepEqual(relatedNotes(n,[{...n,status:'approved'},{...n,id:'b',status:'pending'},{...n,id:'c',status:'approved'}]).map(x=>x.id),['c'])});
test('PDF signature validation',async()=>{await assert.rejects(validatePdf(new File(['not pdf'],'bad.pdf',{type:'application/pdf'})));await validatePdf(new File(['%PDF-1.4'],'good.pdf',{type:'application/pdf'}))});
