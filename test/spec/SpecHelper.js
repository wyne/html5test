/**
* If some tests are failing, please try running ALL the tests again for another 2 times
* Tests are split into some functions and these functions get called at the bottom of this file under document.ready
*/

var Message = StackMob.Model.extend({
  schemaName : 'message'
});

var Messages = StackMob.Collection.extend({
  model : Message
});

var Attraction = StackMob.Model.extend({
  schemaName: 'attraction'
});

var Attractions = StackMob.Collection.extend({
  model: Attraction
});

var initAge = 10;
var initMoney = 100.01;
var range = 3;
var initLocation = 'location';

var StackMobErrors = {
  INVALID_TYPE : "has invalid type, please check your schema",
  PRIMARY_KEY_UPDATE : "unable to update primary key",
  INSTANCE_DOES_NOT_EXIST : "instance does not exist",
  INCOMPATIBLE_TYPE: "an incompatible type, please check your schema"
};

function isFloat (n) {
  return n===+n && n!==(n|0);
}

function isInteger (n) {
  return n===+n && n===(n|0);
}

/** CREATE AND DELETE USER START **/
function createSimpleUser(usr) {
  it("should create " + usr, function() {
    var user = new StackMob.User({
      username : usr,
      password : usr
    });

    var createdUser = null;

    user.create({
      success: function(model) {
        createdUser = model.toJSON();
      }
    });

    waitsFor(function() {
      return createdUser;
    }, 'StackMob should respond', 20000);

  });
}

function loginUser(usr) {
  it("should login " + usr, function() {
    var loggedIn = false;

    var user = new StackMob.User({
      username : usr,
      password : usr
    });

    user.login(false, {
      success : function(model) {
        loggedIn = true;
      }
    });

    waitsFor(function() {
      return loggedIn == true;
    }, "user logged in should be " + usr, 20000);

    runs(function() {
      expect(loggedIn).toBeTruthy();
      expect(user.isLoggedIn()).toBeTruthy();
      expect(StackMob.isLoggedOut()).toBeFalsy();
      expect(StackMob.isLoggedIn()).toBeTruthy();
      expect(StackMob.getLoggedInUser()).toNotBe(null);
    });
  });
}

function logoutUser(usr) {
  it("should logout " + usr, function() {
    var user = new StackMob.User({
      username : usr
    });

    var loggedOut = false;

    user.logout({
      success : function(model) {
        loggedOut = true;
      }
    });

    waitsFor(function() {
      return loggedOut === true;
    }, "user logged out should be " + usr, 20000);

    runs(function() {
      expect(loggedOut).toBeTruthy();
      expect(user.isLoggedIn()).toBeFalsy();
      expect(StackMob.isLoggedOut()).toBeTruthy();
      expect(StackMob.isLoggedIn()).toBeFalsy();
      expect(StackMob.getLoggedInUser()).toBeNull();
    });
  });
}

/**
* This function is to create user with some special fields
* User will have 'age' and 'location' fields.
* Age field will start from 10...(10 + howMany)
* 'flag' field is for us to delete the users created solely from this function
*   (so we can query users who have this flag and delete them)
* @param howMany the number of users to create
* @return the number of created multiple users
*/
function createMultipleUser(howMany) {
  var count = 0; 
  it(howMany + " user(s) should be created", function() {
    for (var i = 0; i < howMany; ++i) {
      var user = new StackMob.User({
        'username' : 'test' + i, 
        'password' : 'test' + i, 
        'age' : initAge + i, 
        'location' : initLocation + i, 
        'money' : initMoney + i, 
        'colors' : ['red', 'green', 'blue', 'some_color' + i],
        'numbers' : [1, 2, 3, i],
        'flag' : 'mUser',
        'vegetarian' : true
      });  

      user.create({
        success : function(model) {
          count = count + 1; 
        }    
      });  
    }    

    waitsFor(function() {
      return count === howMany;
    }, "number of created user should be " + howMany, howMany * 2000);

    runs(function() {
      expect(count).toEqual(howMany);
    });
  });

  waitsFor(function() {
    return count === howMany;
  }, "before returning the number of created users", howMany * 2000);
  return howMany;
}

/**
* If you use createdMultipleUsers, make sure to call this deleteMultipleCreatedUsers in the end
*   to delete all the users created from createdMultipleUsers
* @param howMany the number of users to delete
*/
function deleteMultipleCreatedUsers(howMany) {
  it(howMany + " user(s) should be deleted", function() {
   var count = 0;

   var q = new StackMob.Collection.Query();
   var users = new StackMob.Users();
   q.equals('flag', 'mUser');

   users.query(q, {
    success : function(collection) {
     for (var i = 0; i < collection.models.length; ++i) {
      var user = new StackMob.User({ username : collection.models[i]['id'] });
      user.destroy({
       success : function() {
        count = count + 1;
      }
    });
    }
  }
});

   waitsFor(function() {
    return count === howMany;
  }, "user deleted should be " + howMany, howMany * 2000);

   runs(function() {
    expect(count).toEqual(howMany);
  });
 });
}

/**
* Does not delete relationship
* @param usr the user to delete
*/
function deleteUser(usr) {
  it("should delete user: " + usr, function() {
   var user = new StackMob.User({
    username : usr
  });
   var name = "";

   user.destroy({
    success : function(model) {
     name = model.get('username');
   }
 });

   waitsFor(function() {
    return name === usr;
  }, "user deleted should be " + usr, 20000);

   runs(function() {
    expect(name).toEqual(usr);
  });
 });
}

/** CREATE AND DELETE USER SECTION END **/

/** MICRO FUNCTIONS START **/
/**
* This method is to delete all messages in the schema, in case it needs to be cleaned up
*/
function deleteAllMessagesInSchema() {
  var msgs = new Messages();
  var msgIDs = [];
  msgs.fetch({
   success: function(collection) {
    for (var i = 0; i < collection.models.length; ++i) {
     var msg = collection.models[i];
     msg.destroy();
   }
 }
});
}

/**
* This method is to delete all attractions in the schema, in case it needs to be cleaned up
*/
function deleteAllAttractions() {
  var attrs = new Attractions();
  var attrIDs = [];
  attrs.fetch({
    success: function(collection) {
      for (var i = 0; i < collection.models.length; ++i) {
        var attr = collection.models[i];
        attr.destroy();
      }
    }
  });
}
