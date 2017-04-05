var properties = {
  firstName: {
    type: String,
    required: true
  }
};

var options = {
  relations: {
    accessTokens: {
      model: accessToken,
      type: hasMany,
      foreignKey: userId
    },
    account: {
      model: account,
      type: belongsTo
    },
    transactions: {
      model: transaction,
      type: hasMany
    }
  },
  acls: [{
    permission: ALLOW,
    principalType: ROLE,
    principalId: $everyone,
    property: myMethod
  }]
};

var user = loopback.Model.extend('user', properties, options);

module.exports = function(User) {
    User.observe('loaded', function(ctx, next) {
        var profile = ctx.data;

        if (ctx.req.accessToken) {
            // ERROR: this doesn't seem to be loaded by the time the hook runs
            assert(ctx.authorizedUser);
            // ensure related data for decoration is loaded
            assert(ctx.authorizedUser.favorites);
            // decorate the user profiles based on the authorised user's favorite status
            profile.isFavorited = ctx.authorisedUser.favorites.map((fav) => { return fav.favoritedMemberId }).indexOf(profile.id) !== -1;
        }

        
    });
};