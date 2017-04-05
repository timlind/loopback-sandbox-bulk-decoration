var app = require('../server');

// this exists here so that the user and related data needed by hooks,
// is all loaded regardless of which remote method includes the data
app.remotes().before('**', (ctx, next) => {
    var Profile = app.models.Profile;
    // load the user,
    // when loading the user,
    // also load the user's related data,
    // which describes the user's favorites, blocked members, permissions given,
    // TODO this extra related data should only be included if it will be needed by the models include in the original HTTP request
    // i.e if a list of profile is queried (i.e directly or via user.favorites.favoritedMember), 
    // then also load the data that the user.favorites requires.
    if (ctx.req.accessToken && ctx.req.accessToken.userId) {
        // include the viewer's list of favorites efficiently once here,
        // which will be used to decorate each profile that is sent through the rest api, 
        // regardless of model endpoint the profile is accessed or included via
        Profile.findById(ctx.req.accessToken.userId, { include: [
                'favorites'
            ]},
            (e, user) => {
                // place user onto remote hook context
                ctx.authorizedUser = user;
                // place onto the operation hook context
                ctx.args.options = {
                    authorizedUser: user,
                    accessToken: ctx.req.accessToken
                };
                // ERROR: is loopback waiting until next() is called here before executing observer hooks?
                next();
            }
        );
    } else {
        next();
    }
});