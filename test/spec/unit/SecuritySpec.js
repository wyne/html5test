/**
 * This suite will test the three security modes of the SDK
 * Always - All requests will be made over HTTPS
 * Never - All requests will be made over HTTP
 * Mixed - Only authentication methods will be made over HTTPS
 */

describe("Unit tests for security modes", function() {

  var HTTP  = "http://",
      HTTPS = "https://";

  /******************************************
   ***** SETTING SECURITY MODE TO MIXED *****
   ******************************************/

  it("--Setting Security Mode to Mixed--", function() {
    StackMob.secure = StackMob.SECURE_MIXED;
  });

  it("should use HTTP for non authentication methods", function() {
    runs(function() {
      var model, params, method;
      var Thing = StackMob.Model.extend({ schemaName: 'thing' });
      var thing = new Thing({ name: "testThing" });
      thing.create({
        done: function(mod,p,m){
          model = mod;
          params = p;
          method = m;
        }
      });

      expect(params['url'].indexOf(HTTP)).toEqual(0);
    });
  });

  it("should use HTTPS for User.create", function() {
    runs(function() {
      var model, params, method;
      var user = new StackMob.User({username: "testUser", password: "testUser"});
      user.create({
        done: function(mod,p,m){
          model = mod;
          params = p;
          method = m;
        }
      });

      expect(params['url'].indexOf(HTTPS)).toEqual(0);
    });
  });

  it("should use HTTPS for linkUserWithFacebook", function() {
    runs(function() {
      var model, params, method;
      var user = new StackMob.User({username: "testUser", password: "testUser"});
      user.linkUserWithFacebook("fakeAccessToken", {
        done: function(mod,p,m){
          model = mod;
          params = p;
          method = m;
        }
      });

      expect(params['url'].indexOf(HTTPS)).toEqual(0);
    });
  });

  it("should use HTTPS for authentication methods", function() {
    runs(function() {
      var model, params, method;
      var user = new StackMob.User({username: "testUser", password: "testUser"});
      user.login(true, {
        done: function(mod,p,m){
          model = mod;
          params = p;
          method = m;
        }
      });

      expect(params['url'].indexOf(HTTPS)).toEqual(0);
    });
  });

  /*******************************************
   ***** SETTING SECURITY MODE TO ALWAYS *****
   *******************************************/

  it("--Setting Security Mode to Always--", function() {
    StackMob.secure = StackMob.SECURE_ALWAYS;
  });

  it("should use HTTPS for non-authentication methods", function() {
    runs(function() {
      var model, params, method;
      var user = new StackMob.User({username: "testUser", password: "testUser"});
      user.create({
        done: function(mod,p,m){
          model = mod;
          params = p;
          method = m;
        }
      });

      expect(params['url'].indexOf(HTTPS)).toEqual(0);
    });
  });

  it("should use HTTPS for authentication methods", function() {
    runs(function() {
      var model, params, method;
      var user = new StackMob.User({username: "testUser", password: "testUser"});
      user.login(true, {
        done: function(mod,p,m){
          model = mod;
          params = p;
          method = m;
        }
      });

      expect(params['url'].indexOf(HTTPS)).toEqual(0);
    });
  });

  /******************************************
   ***** SETTING SECURITY MODE TO NEVER *****
   ******************************************/

  it("--Setting Security Mode to Never--", function() {
    runs(function() {
      StackMob.secure = StackMob.SECURE_NEVER;
    });
  });

  it("should use HTTP for non-authentication methods", function() {
    runs(function() {
      var model, params, method;
      var user = new StackMob.User({username: "testUser", password: "testUser"});
      user.create({
        done: function(mod,p,m){
          model = mod;
          params = p;
          method = m;
        }
      });

      expect(params['url'].indexOf(HTTP)).toEqual(0);
    });
  });

  it("should use HTTP for authentication methods", function() {
    runs(function() {
      var model, params, method;
      var user = new StackMob.User({username: "testUser", password: "testUser"});
      user.login(true, {
        done: function(mod,p,m){
          model = mod;
          params = p;
          method = m;
        }
      });

      expect(params['url'].indexOf(HTTP)).toEqual(0);
    });
  });

  it("should use HTTPS for setting request to use secure", function() {
    runs(function() {
      var model, params, method;
      var user = new StackMob.User({username: "testUser", password: "testUser"});
      user.create({
        done: function(mod,p,m){
          model = mod;
          params = p;
          method = m;
        },
        secureRequest: true
      });

      expect(params['url'].indexOf(HTTPS)).toEqual(0);
    });
  });

  it("should use HTTP for linkUserWithFacebook", function() {
    runs(function() {
      var model, params, method;
      var user = new StackMob.User({username: "testUser", password: "testUser"});
      user.linkUserWithFacebook("fakeAccessToken", {
        done: function(mod,p,m){
          model = mod;
          params = p;
          method = m;
        }
      });

      expect(params['url'].indexOf(HTTP)).toEqual(0);
    });
  });

  it("should use HTTPS for linkUserWithFacebook when forced with secureRequest", function() {
    runs(function() {
      var model, params, method;
      var user = new StackMob.User({username: "testUser", password: "testUser"});
      user.linkUserWithFacebook("fakeAccessToken", {
        done: function(mod,p,m){
          model = mod;
          params = p;
          method = m;
        },
        secureRequest: true
      });

      expect(params['url'].indexOf(HTTPS)).toEqual(0);
    });
  });

});