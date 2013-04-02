/**
 * This suite will test custom code to handle GET, POST, PUT, DELETE
 * It will just check the return map from the custom code (check the verb name)
 * HENCE, the custom code method needs to return the verb
 * 
 * NOTICE: make sure the method name you call is returning the verb as a Map("verb" -> "the_verb_as_a_String")
 */

describe("Custom Code Method Verb", function() {

  var makeCustomCodeCall = function(verb) {
    it("should have " + verb + " as the verb", function() {
      var goodToContinue = false;
      var result = '';

      StackMob.customcode('hello_world', {}, verb, {
        success: function(jsonResult) {
          result = jsonResult.verb;
          goodToContinue = true;
        },
        error: function(failure) {}
      });

      waitsFor(function() {
        return goodToContinue === true;
      }, "to finish querying", 20000);

      runs(function() {
        expect(result).toMatch(verb);
      });

    });

  };

	makeCustomCodeCall('GET');
	makeCustomCodeCall('POST');
	makeCustomCodeCall('PUT');
	makeCustomCodeCall('DELETE');
});
