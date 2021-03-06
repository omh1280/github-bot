'use strict';

var Cesium = require('cesium');
var rp = require('request-promise');

var defined = Cesium.defined;

module.exports = GitHubServer;

/**
 *
 * @param {String} userAgent
 * @param {String} authToken
 * @constructor
 */
function GitHubServer(userAgent, authToken) {
    this.headers = {
        'User-Agent': userAgent,
        Authorization: 'token ' + authToken
    };
}

/**
 * Search for old pull requests, comment on each to remind user that they are stale
 * @param {String} repo REST URL repository to search (https://api.github.com/repos/AnalyticalGraphicsInc/cesium/pulls)
 * @return {Promise | undefined}
 */
GitHubServer.prototype.bumpAllPullRequests = function(repo) {
    if (!defined(repo)) {
        return;
    }

    return this.get(repo + '?state=open&sort=updated&direction=asc')
    .then(function() {
        // TODO
        // loop through PRs
        // if (older than some date)
        //    postComment()
    });
};

/** Send GET request to GitHub issue and return Promise to results
 *
 * @param {String} url
 * @return {Promise<String[]> | undefined}
 */
GitHubServer.prototype.get = function(url) {
    if (!defined(url)) {
        return;
    }
    return rp.get({
        uri: url,
        headers: this.headers,
        json: true
    });
};

/** Post a single comment to `url`
 *
 * @param {String} url
 * @param {String} message
 * @return {Promise<String> | undefined} Status of response
 */
GitHubServer.prototype.postComment = function(url, message) {
    if (!defined(url) || !defined(message)) {
        return;
    }
    return rp.post({
        uri: url,
        headers: this.headers,
        body: {
            body: message
        },
        json: true
    });
};
