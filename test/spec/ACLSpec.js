
var HTTP_RESPONSE = {
	SUCCESS: "SUCCESS",
	_400: "Bad Request",
	_401: "Insufficient authorization",
	_404: "object instance does not exist",
	_405: "Invalid HTTP method"
};

var LOGIN_TYPE = {
	NONE: { username: null },
	ANY: { username: "acl_any", password: "acl_any" },
	PRIVATE_KEY: { username: "acl_private", password: "acl_private" },
	OWNER: { username: "acl_owner", password: "acl_owner" },
	ROLE: { username: "acl_role", password: "acl_role" },
	RELATIONSHIP: { username: "acl_relationship", password: "acl_relationship" }
};

function userWorks(userType){
  it("should log in as " + userType.username, function(){
    var user = new StackMob.User(userType);
    aclLoginUser(user);
    aclLogoutUser(user);
  });
}
function aclLoginUser(user){
  if (user.username == null)
    return;
  var loginFlag;
  runs(function(){
    user.login( false, {
      success: function(){ loginFlag = true; },
      error: function(){ loginFlag = false; }
    });
  });

  waitsFor(function() {
    return typeof loginFlag !== "undefined";
  }, "user (" + user.username + ") to login");

  runs(function(){
    expect(loginFlag).toEqual(true);
  });
}

function aclLogoutUser(user){
  var logoutFlag;

  runs(function(){
    user.logout({
      success: function(){ logoutFlag = true }
    });
  });

  waitsFor(function() {
    return typeof logoutFlag !== "undefined";
  }, "user to logout");
  runs(function(){
    expect(logoutFlag).toEqual(true);
  });
}

var makeACLTest = function( opt ){
    var dis = ( opt.expectation == HTTP_RESPONSE.SUCCESS ) ? "" : "dis"

    it("should " + dis + "allow CRUD actions on " + opt.schema + " performed by (" + opt.loginType.username + ")", function(){
        var Class = StackMob.Model.extend({ schemaName: opt.schema });
        var obj = new Class({ name: "test" });

        var idFieldName = opt.schema + "_id";
        var randomID = Math.floor( Math.random() * 110 )
        obj.set(idFieldName, "id" + randomID);

        var user = new StackMob.User( opt.loginType );

        // Different setup procedures per test type
        switch ( opt.schema ){
        	case "perm_logged_in_relationship":
            case "perm_logged_in_owner":
                runs(function(){
                    // If testing owner, do creates first under OWNER
                    var loginFlag;
                    user = new StackMob.User( LOGIN_TYPE.OWNER );
                    user.login( false, {
                        success: function(){ loginFlag = true; },
                        error: function(){ loginFlag = false; }
                    });
                    opt.original_expectation = opt.expectation
                    opt.expectation = HTTP_RESPONSE.SUCCESS

                    waitsFor(function() {
                        return (loginFlag === true || loginFlag === false);
                    }, "user to login", 10000);
                });
                break;

            default:
                runs(function(){
                    if ( opt.loginType.username != null ){
                        // Optional Login
                        var loginFlag;

                        user.login( false, {
                            success: function(){ loginFlag = true; },
                            error: function(){ loginFlag = false; }
                        });

                        waitsFor(function() {
                            return (loginFlag === true || loginFlag === false);
                        }, "user to login", 10000);
                    }
                });
                break;
        }

        var response = null;

        // Create
        //TODO: also check sm_owner
        runs(function() {
            if ( opt.schema == "perm_logged_in_relationship" )
            	obj.set("collaborators", ["acl_relationship"]);

            obj.create({
                success: function(){ response = HTTP_RESPONSE.SUCCESS },
                error: function(m,r){ response = r.error }
            });
        });

        waitsFor(function() {
            return ( response != null );
        });

        // Different setup procedures per test type
        switch ( opt.schema ){
        	case "perm_logged_in_relationship":
            case "perm_logged_in_owner":
                // Switch back to original user
                var logoutFlag;
                runs(function(){
                    user.logout({
                        success: function(){ logoutFlag = true }
                    });
                });

                waitsFor(function() {
                    return (logoutFlag === true || logoutFlag === false);
                }, "user to logout", 10000);

                runs(function(){
                    if ( opt.loginType.username != null ){
                        user = new StackMob.User( opt.loginType );
                        var loginFlag;
                        runs(function(){
                            user.login( false, {
                                success: function(){ loginFlag = true; },
                                error: function(){ loginFlag = false; }
                            });
                        });

                        waitsFor(function() {
                            return (loginFlag === true || loginFlag === false);
                        }, "user to login", 10000);
                    }
                });
                break;
        }

        // Read
        var readFlag;
        runs(function() {
            expect(response).toEqual(opt.expectation);
            if ( opt.original_expectation != null )
                opt.expectation = opt.original_expectation
            response = null;

            obj.fetch({
                success: function(){ response = HTTP_RESPONSE.SUCCESS },
                error: function(m,r){ response = r.error }
            });
        });

        waitsFor(function() {
            return ( response != null );
        });

        // Update
        var updateFlag;
        runs(function(){
            expect(response).toEqual(opt.expectation);
            response = null;

            obj.save({ name: "test2" }, {
                success: function(){ response = HTTP_RESPONSE.SUCCESS },
                error: function(m,r){ response = r.error }
            });
        });

        waitsFor(function() {
            return ( response != null );
        });

        // Delete

        runs(function(){
            expect(response).toEqual(opt.expectation);
            response = null;

            obj.destroy({
                success: function(){ response = HTTP_RESPONSE.SUCCESS },
                error: function(m,r){ response = r.error }
            });
        });

        waitsFor(function() {
            return ( response != null );
        });

        runs(function() {
            if (opt.expectation == HTTP_RESPONSE._404)
                opt.expectation = "This object does not exist";
            expect(response).toEqual(opt.expectation);

        });

        // logout and wait
        if ( opt.loginType.username != null ){
	        var logoutFlag;
	        runs(function(){
	            user.logout({
	                success: function(){ logoutFlag = true }
	            });
	        });

	        waitsFor(function() {
	            return (logoutFlag === true || logoutFlag === false);
	        }, "user to logout", 10000);
        }

        // Different teardown procedures depending on schema
        switch ( opt.schema ){
        	case "perm_logged_in_relationship":
                var reloginFlag;
                runs(function(){
                    // If testing owner, delete under OWNER
                    user = new StackMob.User( LOGIN_TYPE.RELATIONSHIP );
                    user.login( false, {
                        success: function(){ reloginFlag = true; },
                        error: function(){ reloginFlag = false; }
                    });
                });

                waitsFor(function() {
                    return (reloginFlag === true || reloginFlag === false);
                }, "user to login", 10000);

                runs(function(){
                    response = null;
                    obj.destroy({
                        success: function(){ response = HTTP_RESPONSE.SUCCESS },
                        error: function(m,r){ response = r.error }
                    });
                });
                break;
            case "perm_logged_in_owner":
                var reloginFlag;
                runs(function(){
                    // If testing owner, delete under OWNER
                    user = new StackMob.User( LOGIN_TYPE.OWNER );
                    user.login( false, {
                        success: function(){ reloginFlag = true; },
                        error: function(){ reloginFlag = false; }
                    });
                });

                waitsFor(function() {
                    return (reloginFlag === true || reloginFlag === false);
                }, "user to login", 10000);

                runs(function(){
                    response = null;
                    obj.destroy({
                        success: function(){ response = HTTP_RESPONSE.SUCCESS },
                        error: function(m,r){ response = r.error }
                    });
                });
                break;
        }
    });
}

describe("Access Control Users Work", function(){
  userWorks(LOGIN_TYPE.ANY);
  userWorks(LOGIN_TYPE.ROLE);
  userWorks(LOGIN_TYPE.OWNER);
  userWorks(LOGIN_TYPE.RELATIONSHIP);
});

describe("Access Control Lists", function(){

	// Open
	makeACLTest({ schema: 'perm_open', loginType: LOGIN_TYPE.NONE, expectation: HTTP_RESPONSE.SUCCESS });
	makeACLTest({ schema: 'perm_open', loginType: LOGIN_TYPE.ANY, expectation: HTTP_RESPONSE.SUCCESS });
	makeACLTest({ schema: 'perm_open', loginType: LOGIN_TYPE.ROLE, expectation: HTTP_RESPONSE.SUCCESS });
	makeACLTest({ schema: 'perm_open', loginType: LOGIN_TYPE.OWNER, expectation: HTTP_RESPONSE.SUCCESS });
	makeACLTest({ schema: 'perm_open', loginType: LOGIN_TYPE.RELATIONSHIP, expectation: HTTP_RESPONSE.SUCCESS });

	// Private Key (only testing negative case)
	makeACLTest({ schema: 'perm_private_key', loginType: LOGIN_TYPE.NONE, expectation: HTTP_RESPONSE._401 });
	makeACLTest({ schema: 'perm_private_key', loginType: LOGIN_TYPE.ANY, expectation: HTTP_RESPONSE._401 });
	makeACLTest({ schema: 'perm_private_key', loginType: LOGIN_TYPE.ROLE, expectation: HTTP_RESPONSE._401 });
	makeACLTest({ schema: 'perm_private_key', loginType: LOGIN_TYPE.OWNER, expectation: HTTP_RESPONSE._401 });
	makeACLTest({ schema: 'perm_private_key', loginType: LOGIN_TYPE.RELATIONSHIP, expectation: HTTP_RESPONSE._401 });

	// Logged In User
	makeACLTest({ schema: 'perm_logged_in_any', loginType: LOGIN_TYPE.NONE, expectation: HTTP_RESPONSE._401 });
	makeACLTest({ schema: 'perm_logged_in_any', loginType: LOGIN_TYPE.ANY, expectation: HTTP_RESPONSE.SUCCESS });
	makeACLTest({ schema: 'perm_logged_in_any', loginType: LOGIN_TYPE.ROLE, expectation: HTTP_RESPONSE.SUCCESS });
	makeACLTest({ schema: 'perm_logged_in_any', loginType: LOGIN_TYPE.OWNER, expectation: HTTP_RESPONSE.SUCCESS });
	makeACLTest({ schema: 'perm_logged_in_any', loginType: LOGIN_TYPE.RELATIONSHIP, expectation: HTTP_RESPONSE.SUCCESS });

	// SM_Owner
	makeACLTest({ schema: 'perm_logged_in_owner', loginType: LOGIN_TYPE.NONE, expectation: HTTP_RESPONSE._401 });
	makeACLTest({ schema: 'perm_logged_in_owner', loginType: LOGIN_TYPE.ANY, expectation: HTTP_RESPONSE._404 });
	makeACLTest({ schema: 'perm_logged_in_owner', loginType: LOGIN_TYPE.ROLE, expectation: HTTP_RESPONSE._404 });
	makeACLTest({ schema: 'perm_logged_in_owner', loginType: LOGIN_TYPE.OWNER, expectation: HTTP_RESPONSE.SUCCESS });
	makeACLTest({ schema: 'perm_logged_in_owner', loginType: LOGIN_TYPE.RELATIONSHIP, expectation: HTTP_RESPONSE._404 });

	// Role
	makeACLTest({ schema: 'perm_logged_in_role', loginType: LOGIN_TYPE.NONE, expectation: HTTP_RESPONSE._401 });
	makeACLTest({ schema: 'perm_logged_in_role', loginType: LOGIN_TYPE.ANY, expectation: HTTP_RESPONSE._401 });
	makeACLTest({ schema: 'perm_logged_in_role', loginType: LOGIN_TYPE.ROLE, expectation: HTTP_RESPONSE.SUCCESS });
	makeACLTest({ schema: 'perm_logged_in_role', loginType: LOGIN_TYPE.OWNER, expectation: HTTP_RESPONSE._401 });
	makeACLTest({ schema: 'perm_logged_in_role', loginType: LOGIN_TYPE.RELATIONSHIP, expectation: HTTP_RESPONSE._401 });

	// Relationship
	makeACLTest({ schema: 'perm_logged_in_relationship', loginType: LOGIN_TYPE.NONE, expectation: HTTP_RESPONSE._401 });
	makeACLTest({ schema: 'perm_logged_in_relationship', loginType: LOGIN_TYPE.ANY, expectation: HTTP_RESPONSE._404 });
	makeACLTest({ schema: 'perm_logged_in_relationship', loginType: LOGIN_TYPE.ROLE, expectation: HTTP_RESPONSE._404 });
	makeACLTest({ schema: 'perm_logged_in_relationship', loginType: LOGIN_TYPE.OWNER, expectation: HTTP_RESPONSE._404 });
	makeACLTest({ schema: 'perm_logged_in_relationship', loginType: LOGIN_TYPE.RELATIONSHIP, expectation: HTTP_RESPONSE.SUCCESS });

	// Not Allowed
	makeACLTest({ schema: 'perm_not_allowed', loginType: LOGIN_TYPE.NONE, expectation: HTTP_RESPONSE._405 });
	makeACLTest({ schema: 'perm_not_allowed', loginType: LOGIN_TYPE.ANY, expectation: HTTP_RESPONSE._405 });
	makeACLTest({ schema: 'perm_not_allowed', loginType: LOGIN_TYPE.ROLE, expectation: HTTP_RESPONSE._405 });
	makeACLTest({ schema: 'perm_not_allowed', loginType: LOGIN_TYPE.OWNER, expectation: HTTP_RESPONSE._405 });
	makeACLTest({ schema: 'perm_not_allowed', loginType: LOGIN_TYPE.RELATIONSHIP, expectation: HTTP_RESPONSE._405 });

})
