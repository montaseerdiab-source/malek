import assert from 'node:assert';
import { parseJson } from './summarize.js';
const o = parseJson('نعم {"relevant":true,"title":"ت","summary":"م","rights":["أ"],"duties":"x","verdict":"غلط"}');
assert.equal(o.verdict, 'يعتمد'); assert.deepEqual(o.duties, []); assert.equal(o.rights[0], 'أ');
assert.throws(() => parseJson('no json'));
console.log('ok');
