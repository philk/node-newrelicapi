
var request = require('request'),
    xml2js = require('xml2js'),
    qs = require('querystring');

module.exports = NewRelicApi = function(){};

NewRelicApi.setApiKey = function (apikey) {
  this.apikey = apikey;
};

NewRelicApi.setAccountId = function (accountId) {
  this.accountId = accountId;
};

NewRelicApi._request = function (options, cb) {
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

NewRelicApi._rpmGet = function (path, cb) {
  var base = "https://rpm.newrelic.com/accounts/";
  var uri = [base,path].join("");
  this._request({
    uri: uri
  }, function(err, body){
    if (err) {
      cb(err, null);
    }else{
      var parser = new xml2js.Parser();
      parser.parseString(body, function(err, result) {
        if (err) { cb(err, null); }else{
          cb(null, result);
        }
      });
    }
  });
};

NewRelicApi._apiGet = function (path, cb) {
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

NewRelicApi.getApplications = function (cb) {
  this._rpmGet(this.accountId + "/applications.xml", function(err, result){
    if (err) { cb(err, null); }else{
      cb(null, result);
    }
  });
};

NewRelicApi.getSummaryMetrics = function (appid, cb) {
  var path = [
    this.accountId,
    "applications",
    appid,
    "threshold_values.xml"
  ].join("/");

  this._rpmGet(path, function(err, res){
    if (err) { cb(err, null); }else{
      var results = [];
      res.threshold_value.forEach(function(value){
        results.push(value['@']);
      });
      cb(null, results);
    }
  });
};

NewRelicApi.getAppMetrics = function (appid, cb) {
  var path = [
    "applications",
    appid,
    "metrics.json"
  ].join("/");

  this._apiGet(path, cb);
};

NewRelicApi.getMetrics = function (options, cb) {
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

