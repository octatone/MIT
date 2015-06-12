'use strict';

var chrome = window.chrome;
var wunderlist = window.wunderlist;
var wunderbits = window.wunderbits;
var WBDeferred = wunderbits.core.WBDeferred;
var when = wunderbits.core.lib.when;

var clientID = 'e6b771a5bb9c2b82f1ca';
var authBase = 'https://www.wunderlist.com';
var authURL = authBase + '/oauth/authorize';
var redirectURI = 'https://nkfmkemlekipdmmkemlpmolpffhdfkgj.chromiumapp.org/provider_cb';
var exchangeProxy = 'https://mit-wunderlist-exchange.herokuapp.com';

var storage = chrome.storage.sync;
var timeout = 30 * 1000;

var notifiedIds = {};
var currentNotifications = [];
var accessToken;

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

  console.log(uri);

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

  var options = {
    'client_id': clientID,
    'response_type': 'code',
    'redirect_uri': redirectURI,
    'state': state
  };

  var parts = [];
  for (var key in options) {
    parts.push(key + '=' + encodeURIComponent(options[key]));
  }

  return authURL + '?' + parts.join('&');
}

function saveTokenData (data, callback) {

  accessToken = data.access_token;

  var saveData = {
    'accessToken': data.access_token
  };

  storage.set(saveData, function () {

    callback && callback();
  });
}

function exchangeCode (code, callback) {

  $.ajax(exchangeProxy + '/exchange', {
    'type': 'POST',
    'data': {
      'code': code
    },
    'timeout': timeout
  })
  .always(function (response) {

    if (response && response.access_token) {
      saveTokenData(response, function () {

        callback && callback(response.access_token);
      });
    }
  });
}

function login () {

  var state = ''+ Math.random();

  chrome.identity.launchWebAuthFlow({
    'url': getAuthURL(state),
    'interactive': true
  }, function (redirectURL) {

    var params = getParams(redirectURL);
    if (params.state === state && params.code) {
      exchangeCode(params.code);
    }
  });
}

function logout () {

  chrome.identity.launchWebAuthFlow({
    'url': authBase + '/logout',
    'interactive': false
  }, function (resp) {

    var err = chrome.runtime.lastError;
    err && console.error(err.message);

    storage.clear();
  });
}

function fetchToken (callback) {

  storage.get([
    'accessToken',
    'refreshToken',
    'expiration'
  ], function (data) {

    accessToken = data.accessToken;
    callback(accessToken);
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

function fetchReminderForTask (taskID) {
  return getService('reminders').forTask(taskID);
}

function createReminder (timestamp, taskID) {
  return getService('reminders').create({
    'date': timestamp,
    'task_id': taskID
  });
}

function updateReminder (timestamp, revision, reminderID) {
  return getService('reminders').update(reminderID, revision, {
    'date': timestamp
  });
}

function createSubtask (subtaskTitle, taskID) {
  return getService('subtasks').create({
    'title': subtaskTitle,
    'task_id': taskID
  });
}

function updateTask (task, data) {
  console.log(data)
  return getService('tasks').update(task.id, task.revision, data);
}

function updateSubtask (subtask, data) {

  return getService('subtasks').update(subtask.id, subtask.revision, data);
}

function fetchSubtasks (taskID) {

  return getService('subtasks').forTask(taskID);
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