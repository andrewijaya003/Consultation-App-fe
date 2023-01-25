export const msalConfig = {
    auth: {
        clientId: process.env.clientId,
        authority: process.env.tenantId,
        redirectUri: process.env.redirectUri,
        postLogoutRedirectUri: process.env.postLogoutRedirectUri,
        navigateToLoginRequestUrl: false
    },
    cache: {
        cacheLocation: process.env.cacheLocation,
        storeAuthStateInCookie: process.env.storeAuthStateInCookie == "true" ? true : false
    },
};

export const loginRequest = {
    scopes: ["User.Read"]
};

export const graphConfig = {
    graphMeEndpoint: process.env.graphMeEndpoint
};

