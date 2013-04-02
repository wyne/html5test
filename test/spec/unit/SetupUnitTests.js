_.extend(StackMob, {
  ajax: function(model, params, method, options){
    options['done'](model, params, method, options);
  },
  initiateRefreshSessionCall: function() {}
});