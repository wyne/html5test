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

function generateURL(relativePath) {
  if (StackMob['useRelativePathForAjax'] === true) {
    return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/' + relativePath;
  } else {
    switch (StackMob.secure){
      case StackMob.SECURE_ALWAYS:
        return "https://" + StackMob.getBaseURL() + relativePath;
        break;
      case StackMob.SECURE_NEVER:
        return "http://" + StackMob.getBaseURL() + relativePath;
        break;
      case StackMob.SECURE_MIXED:
        return window.location.protocol + "//" + StackMob.getBaseURL() + relativePath;
        break;
    }
  }
}