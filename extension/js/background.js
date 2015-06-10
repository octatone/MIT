'use strict';

var chrome = window.chrome;
var wunderlist = window.wunderlist;
var wunderbits = window.wunderbits;
var WBDeferred = wunderbits.core.WBDeferred;
var when = wunderbits.core.lib.when;


// var clientID = 'Caq9b9StS2HEVA';
// var authURL = 'https://www.reddit.com/api/v1/authorize';
// var apiBase = 'https://oauth.reddit.com';
// var redirectURI = 'https://odmoedfabaohbdoiolgfhedcbfpcindh.chromiumapp.org/provider_cb';
// var exchangeProxy = 'http://reddit-notifier-oauth-exchange.herokuapp.com';

var accessToken = 'a1c22aa0ec0c59e83f3cce214d11af74d6e22c9e452cc41b2d8e24758638';
var clientID = '498d3ffc44ddfa2f275b';

var storage = chrome.storage.sync;
var pollInterval = 15 * 1000;
var timeout = 30 * 1000;

var notifiedIds = {};
var currentNotifications = [];
var currentTimeout;

// todo remove me
storage.set({
  'accessToken': accessToken
});

chrome.storage.onChanged.addListener(function (changes, namespace) {

  for (var key in changes) {
    var storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
  }
});

chrome.notifications.onClicked.addListener(function (notificationID) {
});

function getParams (uri) {

  var params = {};
  var parts = uri.split('?');
  var queries = parts[1].split('&');
  queries.forEach(function (query) {
    var kv = query.split('=');
    var key = kv[0];
    var value = kv[1];

    params[key] = decodeURIComponent(value);
  });

  return params;
}

function getUserAgentString () {

  var version = chrome.runtime.getManifest().version;
  return 'chrome-extension:notifier-for-reddit:' + version + ' (by /u/octatone)';
}

function getAuthURL (state) {

  // var options = {
  //   'client_id': clientID,
  //   'response_type': 'code',
  //   'duration': 'permanent',
  //   'redirect_uri': redirectURI,
  //   'scope': 'privatemessages',
  //   'state': state
  // };

  // var parts = [];
  // for (var key in options) {
  //   parts.push(key + '=' + encodeURIComponent(options[key]));
  // }

  // return authURL + '?' + parts.join('&');
}

function saveTokenData (data) {

  // var saveData = {};

  // data.access_token && (saveData.accessToken = data.access_token);
  // data.refresh_token && (saveData.refreshToken = data.refresh_token);

  // if (data.expires_in) {
  //   var now = Date.now();
  //   saveData.expiration = now + (data.expires_in * 1000) - 60000;
  // }

  // storage.set(saveData);
}

function exchangeCode (code, callback) {

  // $.ajax(exchangeProxy + '/exchange', {
  //   'type': 'POST',
  //   'data': {
  //     'code': code
  //   },
  //   'timeout': timeout
  // })
  // .always(function (response) {

  //   if (response && response.access_token) {
  //     saveTokenData(response);
  //     callback && callback(response.access_token);
  //   }
  // });
}

function exchangeRefreshToken (refreshToken, callback) {

  // var accessToken;

  // $.post(exchangeProxy + '/token', {
  //   'refreshToken': refreshToken
  // })
  // .always(function (response) {

  //   if (response && response.access_token) {
  //     saveTokenData(response);
  //     accessToken = response.access_token;
  //   }

  //   callback && callback(accessToken);
  // });
}

function login () {

  // var state = ''+ Math.random();

  // chrome.identity.launchWebAuthFlow({
  //   'url': getAuthURL(state),
  //   'interactive': true
  // },
  // function (redirectURL) {

  //   var params = getParams(redirectURL);
  //   if (params.state === state && params.code) {
  //     exchangeCode(params.code, poll);
  //   }
  // });
}

function logout () {

  // storage.remove([
  //   'accessToken',
  //   'refreshToken',
  //   'expiration'
  // ]);

  // currentNotifications = [];
}

function fetchToken (callback) {

  storage.get([
    'accessToken',
    'refreshToken',
    'expiration'
  ], function (data) {

    var accessToken = data.accessToken;
    callback(accessToken);
    // var refreshToken = data.refreshToken;
    // var expiration = data.expiration;
    // var now = Date.now();

    // if (accessToken && expiration > now) {
    //   console.log('token still valid');
    //   callback(accessToken);
    // }
    // else if (refreshToken) {
    //   console.log('token expired');
    //   exchangeRefreshToken(refreshToken, callback);
    // }
    // else {
    //   callback();
    // }
  });
}

function fetchTask (callback) {

  storage.get(['taskID'], function (data) {
    var taskID = data.taskID;

    if (!taskID) {
      callback('');
      return;
    }

    getService('tasks').getID(taskID)
      .done(function (taskData, statusCode) {
        callback(taskData);
      })
      .fail(function (resp, code) {
        console.log(errrr)
      });
  });
}


function getService (service) {

  var options = {
    'accessToken': accessToken,
    'clientID': clientID,
    'checkHealth': false
  };

  return new wunderlist.sdk.services[service]({
    'config': options
  });
}

function fetchLists () {

  var deferred = new WBDeferred();
  var lists, positions;

  var listsRequest = getService('lists').all().done(function (allLists) {

    lists = allLists;
  });

  var positionsRequest = getService('list_positions').all().done(function (allListPositions) {

    positions = allListPositions;
  });

  when(listsRequest, positionsRequest)
    .done(function () {

      deferred.resolve(lists);
    });

  return deferred.promise();
}

function fetchTasks (listID) {

  return getService('tasks').forList(listID);
}

function createTask (taskTitle, listID) {

  return getService('tasks').create({
    'title': taskTitle,
    'list_id': listID
  });
}

function createSubtask (subtaskTitle, taskID) {

  return getService('subtasks').create({
    'title': subtaskTitle,
    'task_id': taskID
  });
}

function createNotification (data) {

  // chrome.notifications.create(
  //   data.id,
  //   {
  //     'type': 'basic',
  //     'iconUrl': '../icons/reddit-alien.svg',
  //     'title': data.subject + ' from ' + data.author,
  //     'message': data.body,
  //     'contextMessage': data.link_title
  //   },
  //   function () {
  //     chrome.runtime.lastError && console.error(chrome.runtime.lastError);
  //   }
  // );
}

function updateBadge (unreadCount) {

  chrome.browserAction.setBadgeText({
    'text': unreadCount > 0 ? '' + unreadCount : ''
  });
}

function updateIcon (unreadCount) {

  var base = '../icons/envelope_' + (unreadCount > 0 ? 'unread' : 'read');

  chrome.browserAction.setIcon({
    'path': {
      '19': base + '_19.png',
      '38': base + '_38.png'
    }
  });
}

function clearCurrentTimeout () {

  currentTimeout && clearTimeout(currentTimeout);
}

function setNextPoll () {

  clearCurrentTimeout();
  currentTimeout = setTimeout(poll, pollInterval);
}

function poll () {

  clearCurrentTimeout();

  fetchToken(function (accessToken) {

    if (accessToken) {
      console.log('using token:', accessToken);

    }
    else {
      console.log('no token waiting ...');
      setNextPoll();
    }
  });
}

poll();