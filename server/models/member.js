'use strict';
var assert = require('assert');

module.exports = function(Member) {
    // test whether the remote hook returned the loaded data before this operation hook is run
    Member.observe('loaded', function(ctx, next) {
        var profile = ctx.data;

        if (ctx.accessToken) {
            // ERROR: this doesn't seem to be loaded by the time the hook runs
            assert(ctx.authorizedUser);
            // ensure related data for decoration is loaded
            assert(ctx.authorizedUser.favorites);
            // decorate the user profiles based on the authorised user's favorite status
            profile.isFavorited = ctx.authorisedUser.favorites.map((fav) => { return fav.favoritedMemberId }).indexOf(profile.id) !== -1;
        }

        next();
    });

    // just test whether the extra property on profile is retained
    Member.observe('loaded', function(ctx, next) {
        var profile = ctx.data;

        if (profile) {
            profile.isFavorited = true;
        }

        next();
    });

    Member.on('attached', function() {
        Member.create({ username: 'tester', email: 'tester@localhost', password: '123' }).then(function() {
            Member.findOne({}, function(e, member) {
                console.log("found member", member);
                // ERROR: the additional property does not exist here
                assert(typeof member.isFavorited === 'boolean');
            });
        });
    });
};
