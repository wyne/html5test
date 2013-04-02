var setSessionExpiry = function(expires_in) {
  _.extend(StackMob, {
    _stubbedExpireTime: function() {
      return expires_in;
    }
  });
};