/**
 * This suite will test the data type we store
 */

describe("Stored data types", function() {

	var myUser = 'test0'; //this is the user that's created by createMultipleUser()	

	createMultipleUser(1);

	it("should store boolean data type for vegetarian", function() {

		var vegetarian;
		var user = new StackMob.User({
			username: myUser
		});
		user.fetch({
			success: function(model) {
				vegetarian = model.get('vegetarian');
			}
		});

		waitsFor(function() {
			return typeof(vegetarian) !== 'undefined';
		}, "to finish querying", 20000);

		runs(function() {
			expect(_.isBoolean(vegetarian)).toEqual(true);
		});
	});

	it("should store int data type for age", function() {

		var age = 0;
		var user = new StackMob.User({
			username: myUser
		});
		user.fetch({
			success: function(model) {
				age = model.get('age');
			}
		});

		waitsFor(function() {
			return age !== 0;
		}, "to finish querying", 20000);

		runs(function() {
			expect(_.isNumber(age)).toEqual(true);
			expect(isInteger(age)).toEqual(true);
		});
	});

	it("should store double data type for money", function() {
		var money = 0.00;
		var user = new StackMob.User({
			username: myUser
		});
		user.fetch({
			success: function(model) {
				money = model.get('money');
			}
		});

		waitsFor(function() {
			return money !== 0.00;
		}, "to finish querying", 20000);

		runs(function() {
			expect(_.isNumber(money)).toEqual(true);
			expect(isFloat(money)).toEqual(true);
		});
	});

	it("should not be able to update primary key by using same data type", function() {
		// use the same data type to update our primary key
		var newName = "should_say_instance_does_not_exist";
		var failureObject = null;
		var result = false;
		var user = new StackMob.User({
			username: myUser
		});
		var userToFetch = new StackMob.User({
			username: myUser
		});

		user.save({username: newName}, {
			success: function(model) {
				//should never reach here
			},
			error: function(model, failure) {
				failureObject = failure;

				userToFetch.fetch({
					success: function(model) {
						var fetchedUsrName = model['attributes']['username'];
						if (fetchedUsrName === myUser && _.isString(fetchedUsrName))
							result = true;
					}
				});
			}
		});

		waitsFor(function() {
			return failureObject !== null && result;
		}, "to finish querying", 10000);

		runs(function() {
			expect(result).toEqual(true);
			expect(failureObject['error'].indexOf(StackMobErrors.INSTANCE_DOES_NOT_EXIST)).toNotEqual(-1);
		});
	});

	it("should not be able to update primary key by using different data type", function() {
		// time to use a different data type to update our primary key
		var newName = 13.53552;
		var failureObject = null;
		var result = false;
		var user = new StackMob.User({
			username: myUser
		});
		var userToFetch = new StackMob.User({
			username: myUser
		});
		user.save({username:newName}, {
			success: function(model) {
				//should never reach here
			},
			error: function(model, failure) {
				failureObject = failure;
				userToFetch.fetch({
					success: function(model) {
						result = _.isString(model['attributes']['username']);
					}
				});
			}
		});

		waitsFor(function() {
			return failureObject !== null && result;
		}, "to finish querying", 10000);

		runs(function() {
			expect(result).toEqual(true);
			expect(failureObject['error'].indexOf(StackMobErrors.PRIMARY_KEY_UPDATE)).toNotEqual(-1);
		});
	});

	it("should not accept double data type for age (by using put)", function() {
		var newAge = 18.71;
		var failureObject = null;
		var result = false;
		var user = new StackMob.User({
			username: myUser
		});

		user.save({age: newAge}, {
			success: function(model) {
				//should never reach here
			},
			error: function(model, failure) {
				failureObject = failure;
				user.fetch({
					success: function(model) {
						var fetchedAge = model['attributes']['age'];
						if (isInteger(fetchedAge) && _.isNumber(fetchedAge))
							result = true;
					}
				});
			}
		});

		waitsFor(function() {
			return failureObject !== null && result;
		}, "to finish querying", 20000);

		runs(function() {
			expect(result).toEqual(true);
			expect(failureObject['error'].indexOf(StackMobErrors.INVALID_TYPE)).toNotEqual(-1);
		});
	});

	it("should not accept array[integer] for colors (array[string])", function() {
		var newColors = [1, 3, 5, 7];
		var failureObject = null;
		var result = false;
		var goodToContinue = false;
		var user = new StackMob.User({
			username: myUser
		});

		user.save({colors:newColors}, {
			success: function(model) {
				//should never reach here
			},
			error: function(model, failure) {
				failureObject = failure;
				user.fetch({
					success: function(model) {
						if (_.isArray(model['attributes']['colors'])) {
							var i = 0;
							var max = model['attributes']['colors'].length;
							for (i = 0; i < max; ++i) {
								if (!_.isString(model['attributes']['colors'][i])) {
									result = false;
									goodToContinue = true;
									return;
								}
							}
							result = true;
							goodToContinue = true;
						}
					}
				});
			}
		});

		waitsFor(function() {
			return failureObject !== null && goodToContinue;
		}, "to finish querying", 8000);

		runs(function() {
			expect(result).toEqual(true);
			expect(failureObject['error'].indexOf(StackMobErrors.INVALID_TYPE)).toNotEqual(-1);
		});
	});

	it("should not accept array[string] for numbers (array[integer])", function() {
		var newNumbers = ["1", "3", "5", "7"];
		var failureObject = null;
		var result = false;
		var goodToContinue = false;
		var user = new StackMob.User({
			username: myUser
		});

		user.save({numbers:newNumbers}, {
			success: function(model) {
				//should never reach here
			},
			error: function(model, failure) {
				failureObject = failure;
				user.fetch({
					success: function(model) {
						if (_.isArray(model['attributes']['numbers'])) {
							var i = 0;
							var max = model['attributes']['numbers'].length;
							for (i = 0; i < max; ++i) {
								var myNum = model['attributes']['numbers'][i];
								if (!_.isNumber(myNum) || !isInteger(myNum)) {
									result = false;
									goodToContinue = true;
									return;
								}
							}
							result = true;
							goodToContinue = true;
						}
					}
				});
			}
		});

		waitsFor(function() {
			return failureObject !== null && goodToContinue;
		}, "to finish querying", 10000);

		runs(function() {
			expect(result).toEqual(true);
			expect(failureObject['error'].indexOf(StackMobErrors.INVALID_TYPE)).toNotEqual(-1);
		});
	});

	it("should not accept array[mix_of_types] for numbers (array[integer])", function() {
		var newNumbers = [1, 3.33, true, "7"];
		var failureObject = null;
		var result = false;
		var goodToContinue = false;
		var user = new StackMob.User({
			username: myUser
		});

		user.save({numbers:newNumbers}, {
			success: function(model) {
				//should never reach here
			},
			error: function(model, failure) {
				failureObject = failure;
				user.fetch({
					success: function(model) {
						if (_.isArray(model['attributes']['numbers'])) {
							var i = 0;
							var max = model['attributes']['numbers'].length;
							for (i = 0; i < max; ++i) {
								var myNum = model['attributes']['numbers'][i];
								if (!_.isNumber(myNum) || !isInteger(myNum)) {
									result = false;
									goodToContinue = true;
									return;
								}
							}
							result = true;
							goodToContinue = true;
						}
					}
				});
			}
		});

		waitsFor(function() {
			return failureObject !== null && goodToContinue;
		}, "to finish querying", 20000);

		runs(function() {
			expect(result).toEqual(true);
			expect(failureObject['error'].indexOf(StackMobErrors.INVALID_TYPE)).toNotEqual(-1);
		});
	});

	it("should not accept different data types (array[boolean], double/float, boolean) for vegetarian (boolean)", function() {
		var goodToContinue = false;
		var result = false;
		var waitTime = 5000;

		// try type array
		var newVegetarian = [true, false, true];
		var failureObject = null;
		var user = new StackMob.User({
			username: myUser
		});

		runs(function(){
			user.save({vegetarian: newVegetarian}, {
				success: function(model) {
					//should never reach here
				},
				error: function(model, failure) {
					failureObject = failure;
					user.fetch({
						success: function(m) {
							result = _.isBoolean( m.get('vegetarian') );
							goodToContinue = true;
						}
					});
				}
			});
		});

		waitsFor(function() {
			return failureObject !== null && goodToContinue;
		}, "querying array type to finish", waitTime);

		runs(function() {
			expect(result).toEqual(true);
			expect(failureObject['error'].indexOf(StackMobErrors.INVALID_TYPE)).toNotEqual(-1);
			goodToContinue = false;
		});

		waitsFor(function() {
			return goodToContinue === false;
		}, "to continue to double / float type", waitTime);
		result = false;
		// try type double / float
		runs(function() {
			newVegetarian = 10.32;
			user.save({vegetarian: newVegetarian}, {
				success: function(model) {
					//should never reach here
				},
				error: function(model, failure) {
					failureObject = failure;
					model.fetch({
						success: function(m) {
							result = _.isBoolean(m.get('vegetarian'));
							goodToContinue = true;
						}
					});
				}
			});
		});

		waitsFor(function() {
			return failureObject !== null && goodToContinue;
		}, "querying double / float to finish", waitTime);

		runs(function() {
			expect(result).toEqual(true);
			expect(failureObject['error'].indexOf(StackMobErrors.INVALID_TYPE)).toNotEqual(-1);
			goodToContinue = false;
		});

		waitsFor(function() {
			return goodToContinue === false;
		}, "to continue to boolean type", 20000);
		result = false;

		// try type of boolean
		runs(function(){
			var result = false;
			newVegetarian = true;
			user.save({vegetarian:newVegetarian}, {
				success: function(model) {
					// result = true;
					user.fetch({
						success: function(model) {
							var isVegetarian = model['attributes']['vegetarian'];
							if (isVegetarian === newVegetarian && _.isBoolean(isVegetarian)) {
								result = true;
							}
							goodToContinue = true;
						}
					});
				},
				error: function(model, failure) {
					// should never reach here
				}
			});
		});

		waitsFor(function() {
			return result === true && goodToContinue;
		}, "to finish querying boolean type", 20000);

		runs(function() {
			expect(result).toEqual(true);
		});
	});

	deleteMultipleCreatedUsers(1);

	it("should not create a new user with different data type for 'age'", function() {
		var name = "hehoheho";
		var pass = name;
		var _age = 13.56; // this is double. Age is supposed to be an int
		var failureObject = null;
		var failureObjectFetch = null;
		var user = new StackMob.User({
			username: name, password: pass, age: _age
		});
		user.create({
			success: function(model) {
				// should never reach here
			},
			error: function(model, failure) {
				failureObject = failure;
				var usr = new StackMob.User({
					username: name
				});
				usr.fetch({
					success: function(model) {
						// should never reach here
					},
					error: function(model, failure) {
						failureObjectFetch = failure;
					}
				});
			}
		});

		waitsFor(function() {
			return failureObject !== null && failureObjectFetch !== null;
		}, "to finish creating", 10000);

		runs(function() {
			expect(failureObjectFetch['error'].indexOf(StackMobErrors.INSTANCE_DOES_NOT_EXIST)).toNotEqual(-1);
			expect(failureObject['error'].indexOf(StackMobErrors.INCOMPATIBLE_TYPE)).toNotEqual(-1);
		});
	});
});	