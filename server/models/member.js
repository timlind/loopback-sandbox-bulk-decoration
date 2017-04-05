'use strict';

module.exports = function(Member) {
    Member.observe('loaded', function(ctx, next) {
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
