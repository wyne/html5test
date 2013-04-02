describe("Custom Code OAuth Signing Tests", function() {

  var userpass = 'ccuser';

  var customCodeCall = function(verb, method, shouldMsg, check) {
    it(shouldMsg, function() {
      var response = null;

      StackMob.customcode(method, {}, verb, {
        success: function(result) {
          response = result;
        }
      });

      waitsFor(function() {
        return response;
      }, "to get result back from custom code", 20000);

      runs(function(response) { check(response); });
    });
  }

  var makeLegitOAuthCustomCodeCall = function(verb) {
    customCodeCall(verb, 'hello_world', "should recognize the logged in user in custom code " + verb + " requests", function(response) {
        return function() { expect(response['msg']).toMatch(userpass); }
    });
  }

  var makeIncorrectOAuthCustomCodeCall = function(verb) {
    customCodeCall(verb, 'hello_world', "should NOT recognize a logged out user in custom code " + verb + " requests", function(response) {
      return function() { expect(response['msg']).toBeNull(); }
    });
  }

  var makeCamelCaseCall = function(verb, method) {
    customCodeCall(verb, method, "should recognize the logged in user for camelcase custom code " + verb + " requests", function(response) {
      return function() { expect(response['msg']).toMatch(userpass); }
    });
  }

  createSimpleUser(userpass);
  loginUser(userpass);

  makeLegitOAuthCustomCodeCall('GET');
  makeLegitOAuthCustomCodeCall('POST');
  makeLegitOAuthCustomCodeCall('PUT');
  makeLegitOAuthCustomCodeCall('DELETE');

  //UPPERCASE
  makeCamelCaseCall('GET', 'CAMELCASE');
  makeCamelCaseCall('POST', 'CAMELCASE');
  makeCamelCaseCall('PUT', 'CAMELCASE');
  makeCamelCaseCall('DELETE', 'CAMELCASE');

  //camelCase
  makeCamelCaseCall('GET', 'camelCase');
  makeCamelCaseCall('POST', 'camelCase');
  makeCamelCaseCall('PUT', 'camelCase');
  makeCamelCaseCall('DELETE', 'camelCase');

  //lowercase
  makeCamelCaseCall('GET', 'camelcase');
  makeCamelCaseCall('POST', 'camelcase');
  makeCamelCaseCall('PUT', 'camelcase');
  makeCamelCaseCall('DELETE', 'camelcase');  

  logoutUser(userpass);

  makeIncorrectOAuthCustomCodeCall('GET');
  makeIncorrectOAuthCustomCodeCall('POST');
  makeIncorrectOAuthCustomCodeCall('PUT');
  makeIncorrectOAuthCustomCodeCall('DELETE');

  deleteUser(userpass);

});
