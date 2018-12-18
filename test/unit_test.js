const assert = require('assert');
const math = require('mathjs');
describe('Unit Test', function() {
    it('Test 1',function(){
        assert.equal(1,1);
        assert.equal(0,"0");
        assert.equal(0,"");
        assert.notEqual(10,-2);
    });
    it('Test 2',function(){
        assert.deepEqual(1,1);
        assert.notDeepStrictEqual(0,"");
        assert.notDeepStrictEqual(1,"1");
    });
    it('Test 3',function() {
        const result = math.add(2,3);
        assert.equal(result, 5);
    });
    it('Test 4',function(){
        const result = math.square(3);
        assert.equal(result,9);
    });
    it('Test 5',function(){
        const scope = {a:3, b:4};
        const result = math.eval('a * b', scope);
        assert.equal(result,3*4)
    });
    it('Test 6',function(){
        const scope = {a:3, b:4,c:23};
        const result = math.eval('(a * b) * (a - b) * (b * a) * a - (sqrt(c)*sqrt(a))', scope);
        const right = (3 * 4) * (3 - 4) * (4 * 3) * 3 - (math.sqrt(23)*math.sqrt(3));
        assert.equal(result, right);
    });
});