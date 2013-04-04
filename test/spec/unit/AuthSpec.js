/**
 * This suite will test all the query functions that StackMob has
 * (StackMob.Collection.Query) except for StackMob.GeoPoint
 * More:
 * https://www.stackmob.com/devcenter/docs/Javascript-API-Docs#a-stackmob.collection.query
 */

describe("Unit tests for Authentication", function() {

  it("should override getOAuthCredentials", function() {
    StackMob._getOAuthCredentials = StackMob.getOAuthCredentials;

    StackMob.getOAuthCredentials = function() {
      var oauth_accessToken = "access_token";
      var oauth_macKey = "mac_key";
      var oauth_expires = 3600;
      var oauth_refreshToken = "refresh_token";
      var creds = {
        'oauth2.accessToken' : "access_token",
        'oauth2.macKey' : "mac_key",
        'oauth2.expires' : 3600,
        'oauth2.userSchemaInfo' : {
          schemaName: 'user',
          loginField: 'username',
          passwordField: 'password'
        }
      };
      creds[StackMob.REFRESH_TOKEN_KEY] = "refresh_token";
      return creds;
    };

  });

  it("should use base url for refreshToken method", function() {
    runs(function(){
      StackMob.refreshSession.call(StackMob, {
        done: function(model, params, method){
          expect(params['url']).toEqual( generateURL("user/refreshToken") );
          expect(method).toEqual("refreshToken");
        }
      });
    });
  });

  it("should restore getOAuthCredentials()", function() {
    StackMob.getOAuthCredentials = StackMob._getOAuthCredentials;
  });

});
