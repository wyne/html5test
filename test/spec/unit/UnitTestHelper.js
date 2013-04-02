/**
 * Unit Test that `obj.sdkMethod` will hit `endPoint` with `verb` request.
 */
function expectEndpoint(obj, methodParams, sdkMethod, verb, endPoint) {
  
  var methodParams = methodParams || [];
  methodParams.push({
    done: function(model, params, method) {
      calledBack = true;
      expect(params).toCall(endPoint, verb);
    }
  });
  var calledBack = false;
  obj[sdkMethod].apply(obj, methodParams);
  expect(calledBack).toEqual(true);
}

beforeEach(function() {
  this.addMatchers({
    toCall: function(endPoint, verb) {
      return this.actual['url'].indexOf(endPoint) > -1 && this.actual['type'] === verb;
    },
    
    toHaveParam: function(key, value) {
      return _.contains(this.actual['data'].split('&'), (key + '=' + value));
    },
    
    toHaveJSONWith: function(key, value) {
      return this.actual['data']['key'] === value;
    }
  });
  
});