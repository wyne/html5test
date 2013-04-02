/**
 * This suite will test StackMob.Collection.Query
 * @param miles the number of miles you want to test
 */

var miles = 3;

describe("Geo points query", function() {
	it("should create attractions", function() {
		var count = 0;
		var attrs = [{"name":"Golden Gate Bridge","location":{"lon":-122.419416,"lat":37.77493},"flag":"mLocation"},
                {"name":"Coit Tower","location":{"lon":-122.478532,"lat":37.819586},"flag":"mLocation"},
                {"name":"Fisherman's Wharf","location":{"lon":-122.415805,"lat":37.808224},"flag":"mLocation"},
                {"name":"Sunset and Noriega","location":{"lon":-122.495327,"lat":37.753649},"flag":"mLocation"},
                {"name":"19th and Noriega","location":{"lon":-122.47653,"lat":37.754226},"flag":"mLocation"},
                {"name":"Sunset and Taraval","location":{"lon":-122.494726,"lat":37.742112},"flag":"mLocation"},
                {"name":"19th and Taraval","location":{"lon":-122.475758,"lat":37.743164},"flag":"mLocation"},
                {"name":"Inside Box","location":{"lon":-122.48374,"lat":37.749815},"flag":"mLocation"},
                ];

    for (var i = 0; i < attrs.length; ++i) {
    	var attr = new Attraction(attrs[i]);
    	attr.create({
    		success: function(model) {
    			count++;
    		}
    	})
    }

    waitsFor(function() {
    	return count == attrs.length;
    }, "all attractions to be created", attrs.length * 1000);

    runs(function() {
    	expect(count).toEqual(attrs.length);
    });
	});

	// .equals('flag', 'mLocation')
	// var kms = miles * 1.609344;
	var kms = miles * 1.609344;
	var radian = 0.4;

	it("is near " + radian + " radians", function() {
		var q = new StackMob.Collection.Query();
		q.mustBeNear('location', new StackMob.GeoPoint(37.77493, -122.419416), radian);
		var count, expectedCount;

		var attrs = new Attractions();
		attrs.query(q, {
			success: function(collection) {

				// Set expectation
				expectedCount = _.countBy(
					collection.map( function(o) {
						return o.get("location")['distance'];
					}), function(num){
						return num <= radian ? 'isNear' : 'isNotNear';
					}
				);

				count = collection.length;
			}
		});

		waitsFor(function() {
			return typeof(expectedCount) !== 'undefined';
		}, "the collection fetch", attrs.length * 1000);

		runs(function() {
			expect(count).toEqual( expectedCount.isNear );
		});
	});

	it("is near " + miles + " miles", function() {
		var q = new StackMob.Collection.Query();
		q.mustBeNearMi('location', new StackMob.GeoPoint(37.77493, -122.419416), miles);
		var count = 0, expectedCount;

		var attrs = new Attractions();
		attrs.query(q, {
			success: function(collection) {
				// Set expectation
				expectedCount = _.countBy(
					collection.map( function(o) {
						return o.get("location")['distance'];
					}), function(num){
						return num * StackMob.EARTH_RADIANS_MI <= miles ? 'isNear' : 'isNotNear';
					}
				);

				count = collection.length;
			}
		});

		waitsFor(function() {
			return count != 0;
		}, "the collection member", attrs.length * 1000);

		runs(function() {
			expect(count).toEqual( expectedCount.isNear );
		});
	});

	it("is near " + kms + " kilometers", function() {
		var q = new StackMob.Collection.Query();
		q.mustBeNearKm('location', new StackMob.GeoPoint(37.77493, -122.419416), kms);
		var count = 0, expectedCount;

		var attrs = new Attractions();
		attrs.query(q, {
			success: function(collection) {
				// Set expectation
				expectedCount = _.countBy(
					collection.map( function(o) {
						return o.get("location")['distance'];
					}), function(num){
						return num * StackMob.EARTH_RADIANS_KM <= kms ? 'isNear' : 'isNotNear';
					}
				);

				count = collection.length;
			}
		});

		waitsFor(function() {
			return count != 0;
		}, "the collection member", attrs.length * 1000);

		runs(function() {
			expect(count).toEqual( expectedCount.isNear );
		});
	});

	it("is within " + radian + " radian(s)", function() {
		var q = new StackMob.Collection.Query();
		q.isWithin('location', new StackMob.GeoPoint(37.77493, -122.419416), radian);
		var count = 0, expectedCount;

		var attrs = new Attractions();
		attrs.query(q, {
			success: function(collection) {
				a = collection;

				count = collection.length;
			}
		});

		waitsFor(function() {
			return count != 0;
		}, "the collection member", attrs.length * 1000);

		runs(function() {
			expect(count).toEqual(8);
		});
	});

	it("is within " + miles + " miles", function() {
		var q = new StackMob.Collection.Query();
		q.isWithinMi('location', new StackMob.GeoPoint(37.77493, -122.419416), miles);
		var count = 0;

		var attrs = new Attractions();
		attrs.query(q, {
			success: function(collection) {
				count = collection.length;
			}
		});

		waitsFor(function() {
			return count != 0;
		}, "the collection member", attrs.length * 1000);

		runs(function() {
			expect(count).toEqual(2);
		});
	});

	it("is within " + kms + " kilometers", function() {
		var q = new StackMob.Collection.Query();
		q.isWithinKm('location', new StackMob.GeoPoint(37.77493, -122.419416), kms);
		var count = 0;

		var attrs = new Attractions();
		attrs.query(q, {
			success: function(collection) {
				count = collection.length;
			}
		});

		waitsFor(function() {
			return count != 0;
		}, "the collection member", attrs.length * 1000);

		runs(function() {
			expect(count).toEqual(2);
		});
	});

	it("is within a box", function() {
		var q = new StackMob.Collection.Query();
		q.isWithinBox('location', new StackMob.GeoPoint(37.77493,-122.419416), new StackMob.GeoPoint(37.783367,-122.408579));
		var count = 0;

		var attrs = new Attractions();
		attrs.query(q, {
			success: function(collection) {
				count = collection.length;
			}
		});

		waitsFor(function() {
			return count != 0;
		}, "count to be equal to 1");

		runs(function() {
			expect(count).toEqual(1);
		});
	});

	it("should delete all newly created attactions", function()  {
		var attrs = new Attractions();
		var q = new StackMob.Collection.Query();
		q.equals("flag","mLocation");
		var attr_id = [];
		var count = 0;
		var length = 0;

		attrs.query(q, {
			success : function(collection) {
				length = collection.models.length;
				for (var i = 0; i < length; i++) {
					var attr = collection.models[0];
					attr.destroy({
						success : function(result) {
							count++;
						}
					});
				}
			}
		});

		waitsFor(function() {
			return (length>0) && (count == length);
		}, "to finish querying");

		runs(function() {
			expect(count).toEqual(8);
		});
	});
});
