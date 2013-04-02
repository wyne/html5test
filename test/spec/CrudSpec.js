/*
 * This suite will test CRUD methods
 */

var TestItem = StackMob.Model.extend({ schemaName: 'testitem' });
var thisTestItem = null;
var waitTime = 5000;

describe("CRUD Methods", function() {

	it("should create a user", function() {
		var createdUser = null;

		var user = new StackMob.User({
			username: 'testuser',
			password: 'testpassword'
		});

		user.create({
			success: function(model) {
				createdUser = model.toJSON();
			}
		});		

		waitsFor(function() {
			return createdUser;
		}, "created user should be returned", waitTime);

		runs(function() {
			expect(createdUser['username']).toEqual('testuser');
		});
	});

	it("should create 5 users at once", function() {
		var createdUsers = null;

		// `action: 'batch'` will be used for `destroyAll`
		var user1 = new StackMob.User({
			username: 'testuser10',
			password: 'testpassword',
			action: 'batch'
		});
		var user2 = new StackMob.User({
			username: 'testuser20',
			password: 'testpassword',
			action: 'batch'
		});
		var user3 = new StackMob.User({
			username: 'testuser30',
			password: 'testpassword',
			action: 'batch'
		});
		var user4 = new StackMob.User({
			username: 'testuser40',
			password: 'testpassword',
			action: 'batch'
		});
		var user5 = new StackMob.User({
			username: 'testuser50',
			password: 'testpassword',
			action: 'batch'
		});

		var users = new StackMob.Users([user1, user2, user3, user4, user5]);

		users.createAll({
			success: function(model) {
				createdUsers = model;
			}
		});		

		waitsFor(function() {
			return createdUsers;
		}, "created users should be returned", waitTime);

		runs(function() {
			expect(createdUsers['succeeded'].length).toEqual(5);
		});
	});

	it("should update a user", function() {
		var updatedUser = null;

		var user = new StackMob.User({ username: 'testuser' });
		user.save({ age: 18 }, {
				success: function(model) {
					updatedUser = model.toJSON();	
				} 
			});

		waitsFor(function() {
			return updatedUser;				
		}, "updated user should be returned", waitTime);

		runs(function() {
			expect(updatedUser['age']).toEqual(18);
			expect(updatedUser['lastmoddate']).toBeGreaterThan(updatedUser['createddate']);
		});
	});

	it("should read a user", function() {
		var readUser = null;

		var user = new StackMob.User({ username: 'testuser' });
		user.fetch({
			success: function(model) {
				readUser = model.toJSON();
			}
		});

		waitsFor(function() {
			return readUser;
		}, "user should be fetched", waitTime);

		runs(function() {
			expect(readUser['username']).toEqual('testuser');
			expect(readUser['age']).toEqual(18);
		});
	});

	it("should delete a user", function() {
		var deletedUser = null;

		var user = new StackMob.User({ username: 'testuser' });
		user.destroy({
			success: function(model) {
				deletedUser = model.toJSON();
			}
		});

		waitsFor(function() {
			return deletedUser;
		}, "deleted username should be returned", waitTime);

		runs(function() {
			expect(deletedUser['username']).toEqual(user.get('username'));
		});	
	});

	it("should delete 5 users at once", function() {
		var users = new StackMob.Users();

		var q = new StackMob.Collection.Query();
		// use the one field in `create 5 users`
		q.equals('action', 'batch');

		var result = false;

		users.destroyAll(q, {
			success: function(model) {
				result = true;
			}
		});		

		waitsFor(function() {
			return result == true;
		}, "model in success function should be undefined", waitTime);

		runs(function() {
			expect(result).toEqual(true);
		});
	});

	it("should not be able to fetch the deleted user", function() {
		var failureMessage = null;

		var user = new StackMob.User({ username: 'testuser' });
		user.fetch({
			error: function(model, result) {
				failureMessage = result;
			}
		});

		waitsFor(function() {
			return failureMessage;
		}, 'StackMob should respond', waitTime);

		runs(function() {
			expect(failureMessage['error']).toEqual('object instance does not exist');
		});
	});

});

describe("CRUD Methods for Custom Schemas", function() {
	it("should create a testitem", function() {
		var result = null;

		var item = new TestItem({
			name: 'test',
			num: 1,
			decimal: 2.5,
			bool: true,
			arraystring: ['a','b','c'],
			arraynum: [1,2,3],
			arraydecimal: [1.1,2.2,3.3],
			arraybool: [true, false, true]
		});

		item.create({
			success: function(model) {
				result = model.toJSON();
				thisTestItem = model;
			}
		});		

		waitsFor(function() {
			return result;
		}, "StackMob should respond", waitTime);

		runs(function() {
			expect(result['name']).toEqual('test');
		});
	});

	it("should update a testitem", function() {
		var result = null;

		var item = new TestItem({ 'testitem_id': thisTestItem.get('testitem_id') });
		item.save({ num: 5 }, {
				success: function(model) {
					result = model.toJSON();	
				} 
			});

		waitsFor(function() {
			return result;				
		}, "StackMob should respond", waitTime);

		runs(function() {
			expect(result['num']).toEqual(5);
		});
	});

	it("should read a testitem", function() {
		var result = null;

		var item = new TestItem({ 'testitem_id': thisTestItem.get('testitem_id') });
		item.fetch({
			success: function(model) {
				result = model.toJSON();
			}
		});

		waitsFor(function() {
			return result;
		}, "user should be fetched", waitTime);

		runs(function() {
			expect(result['testitem_id']).toEqual(thisTestItem.get('testitem_id'));
		});
	});

	it("should delete a testitem", function() {
		var result = null;

		var item = new TestItem({ 'testitem_id': thisTestItem.get('testitem_id') });
		item.destroy({
			success: function(model) {
				result = model.toJSON();
			}
		});

		waitsFor(function() {
			return result;
		}, "deleted username should be returned", waitTime);

		runs(function() {
			expect(result['testitem_id']).toEqual(thisTestItem.get('testitem_id'));
		});	
	});

});

/**
 * One to many relationship (user has messages)
 * This suite will test the appendAndCreate, appendAndSave, fetchExpanded,
 * deleteAndSave
 *   (fetchExpanded as well)
 * @param usr username
 * @param count the number of messages to append
 */

describe("CRUD for Relationships", function() {
	var usr = 'testuser';
	var count = 10;

	function getMessages() {
		var msgs = [];
		for (var i = 0; i < count; ++i) {
			msgs.push(new Message({'content' : 'message ' + i}));
		}
		return msgs;
	}

	it("should add " + count + " messages to user " + usr, function() {

		//TODO:move this 
		// deleteUser(usr);
		// createSimpleUser(usr);

		var res = null;

		var user = new StackMob.User({username : usr});
		user.addRelationship('messages', getMessages(), {
			success: function(addResult) {
				res = addResult;
			}
		})

		waitsFor(function() {
			return res;
		}, "StackMob should respond", waitTime);

		runs(function() {
			expect(res['succeeded'].length).toEqual(count);
		});
	});

	it("should append " + count + " more messages", function() {

		var user = new StackMob.User({username : usr});
		var res = null;

		user.addRelationship('messages', getMessages(), {
			success: function(addResult) {
				res = addResult;
			}
		})

		waitsFor(function() {
			return res;
		}, "StackMob should respond", waitTime);

		runs(function() {
			expect(res['succeeded'].length).toEqual(count);
		});
	});

	it("should fetch an expanded user with 50 full messages (as indicated by existence of 'message_id' field)", function() {
		var user = new StackMob.User({ username : usr});

		var res = null;

		user.fetchExpanded(1, {
			success: function(model) {
				res = model.toJSON();
			}
		});

		waitsFor(function() {
			return res;
		}, "StackMob should respond", waitTime);

		runs(function() {
			expect(_.all(res['messages'], function(message) { return message['messages_id']; })).toEqual(true);
			expect(res['messages'].length).toEqual(count * 2);
		});
	});

	it("should soft delete a message", function() {
		var userMessages = [];
		var goodToContinue = false;
		var softDeleteMessageID = null;
		var res;
		var user = new StackMob.User({ username: usr });

		// Set up the user messages to track
		runs(function() {
			user.fetch({
				success: function(model) {
					userMessages = model.toJSON()['messages'];
					softDeleteMessageID = userMessages[0];
				}
			});
		});

		waitsFor(function() {
			return softDeleteMessageID != null;
		}, "user fetch to succeed", waitTime);

		runs(function() {
			user.deleteAndSave('messages', softDeleteMessageID, false, {
				success: function(result) {
  				goodToContinue = true;
  			}
			});
		});

		waitsFor(function() {
				return goodToContinue == true;
		}, "deleteAndSave to succeed", waitTime);

		runs(function() {
			goodToContinue = false;	
			user.fetch({
				success: function(model) {
					goodToContinue = true;
					res = model.toJSON();
				}
			});
		});	

		waitsFor(function() {
			return goodToContinue;
		}, "user fetch to succeed", waitTime);

		runs(function() {
			expect(_.include(res['messages'], softDeleteMessageID)).not.toBeTruthy();
			expect(res['messages'].length).toEqual(count * 2 - 1);
		});		

	});

	it("should cascade delete all messages", function() {
		var userMessages = [];
		var softDeleteMessageID = null;
		var goodToContinue = false;
		var res;
		var user = new StackMob.User({ username: usr });

		runs(function() {
			user.fetch({
				success: function(model) {
					userMessages = model.toJSON()['messages'];
					softDeleteMessageID = userMessages[0];
				}
			});

		});

		waitsFor(function() {
			return softDeleteMessageID;
		}, "user fetch to succeed", waitTime);	

		runs(function() {
			user.deleteAndSave('messages', userMessages, true, {
				success: function(result) {
  				goodToContinue = true;
  			}
			});		
		});

		waitsFor(function() {
			return goodToContinue;
		}, "deleteAndSave to succeed for " + usr, waitTime);

		runs(function() {		
			goodToContinue = false;
			user.fetch({
				success: function(model) {
					goodToContinue = true;
					res = model.toJSON();
				}
			});
		});

		waitsFor(function() {
			return goodToContinue;
		}, "user fetch to succeed", waitTime);

		runs(function() {
			expect(res['messages'].length).toEqual(0);
		});	

	});

	deleteUser(usr);
})
