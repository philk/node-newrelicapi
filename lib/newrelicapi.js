
var request = require('request'),
    nrx = require('./elements'),
    qs = require('querystring');

var NewRelicApi = function(){};

NewRelicApi.prototype.setApiKey = function (apikey) {
  this.apikey = apikey;
  return this.apikey;
};

NewRelicApi.prototype.setAccountId = function (accountId) {
  this.accountId = accountId;
  return this.accountId;
};

NewRelicApi.prototype._request = function (options, cb) {
  options.headers = options.headers || {};
  if (this.apikey) {
    options.headers['x-api-key'] = this.apikey;
  }else{
    cb(new Error('Missing API KEY'), null);
  }
  request(options, function(err, resp, body){
    if (err) {
      cb(err, null);
    } else {
      cb(null, body);
    }
  });
};

NewRelicApi.prototype._get = function (path, cb) {
  var base = "https://rpm.newrelic.com/accounts/";
  var uri = [base,path].join("");
  this._request({
    uri: uri
  }, cb);
};

NewRelicApi.prototype._apiGet = function (path, cb) {
  var base = "https://api.newrelic.com/api/v1/";
  var uri = [base,path].join("");
  this._request({
    uri: uri
  }, function(err, body){
    if (err) { cb(err, null); }else{
      var res = JSON.parse(body);
      cb(null, res);
    }
  });
};

NewRelicApi.prototype.getApplications = function (cb) {
  this._get(this.accountId + "/applications.xml", function(err, result){
    if (err) { cb(err, null); }else{
      cb(null, nrx.parseApplications(result));
    }
  });
};

NewRelicApi.prototype.getSummaryMetrics = function (appid, cb) {
  var path = [
    this.accountId,
    "applications",
    appid,
    "threshold_values.xml"
  ].join("/");

  this._get(path, function(err, res){
    if (err) { cb(err, null); }else{
      cb(null, nrx.parseThresholdValues(res));
    }
  });
};

NewRelicApi.prototype.getAppMetrics = function (appid, cb) {
  var path = [
    "applications",
    appid,
    "metrics.json"
  ].join("/");

  this._apiGet(path, cb);
};

NewRelicApi.prototype.getMetrics = function (options, cb) {
  var path = [
    "accounts",
    this.accountId,
    "applications",
    options.appId,
    "data.json?"
  ].join("/");
  delete options.appId;
  path += qs.stringify(options);

  this._apiGet(path, cb);
};

module.exports = new NewRelicApi();
