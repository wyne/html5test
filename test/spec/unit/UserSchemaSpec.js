describe("User Schema Tests", function() {

  it("should be a 'user' schema and use 'username' and 'password' as the username and password fields by default", function() {

    var Student = StackMob.User.extend({});

    runs(function() {
      var s = new Student({ username: 'testUser', password: 'testPass'});
      expectEndpoint(s, [true], 'login', 'POST', 'user/accessToken');
      
    });
    
    runs(function() {
      var s = new Student({ username: 'testUser', password: 'testPass'});
      s.login(true, {
        done: function(model, params, method) {
          expect(params).toHaveParam('username', 'testUser');
          expect(params).toHaveParam('password', 'testPass');
        }
      });
    });
  });

  it("should be a 'student' schema and use 'name' and 'pass' as the username and password fields when schemaName, loginField, and passwordField are set", function() {

    var Student = StackMob.User.extend({ schemaName: 'student', loginField: 'name', passwordField: 'pass' });

    runs(function() {
      var s = new Student({ name: 'testUser', pass: 'testPass'});
      expectEndpoint(s, [true], 'login', 'POST', 'student/accessToken');
      
    });
    
    runs(function() {
      var s = new Student({ name: 'testUser', pass: 'testPass'});
      s.login(true, {
        done: function(model, params, method) {
          expect(params).toHaveParam('name', 'testUser');
          expect(params).toHaveParam('pass', 'testPass');
        }
      });
    });
  });

});