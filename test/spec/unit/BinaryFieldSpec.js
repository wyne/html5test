/**
 * Binary Field Unit Tests
 */

describe("Binary Field Unit Tests", function() {

  var Profile = StackMob.Model.extend({ 
    schemaName: 'profile',
    binaryFields: ['pic', 'pic2'] 
  });

  it("should exclude binary fields", function() {
    runs(function() {
      var p = new Profile({
        profile_id: '123',
        item: 'stuff',
        profession: 'asdf',
        pic: 'http://s3.amazonaws.com/stuff.png',
        pic2: 'https://s3.amazonaws.com/stuff.png'
      });
      
      p.save(null, {
        done: function(model, param, method) {
          expect(JSON.parse(param['data'])).toEqual({
            profile_id: '123',
            item: 'stuff',
            profession: 'asdf'
            
          });
        }
      });

    });

  });

});
