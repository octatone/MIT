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
var localStorage = chrome.storage.local;
var timeout = 30 * 1000;
// CONFIGURE THIS!!!
var threshold = 10;

var notifiedIds = {};
var currentNotifications = [];
var accessToken;
var currentURL = '';
var currentTabId = '';

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

function getCurrentBrowseTime (url, callback) {
  chrome.storage.local.get(url, callback);
}

function extractDomain (url) {
  var a = document.createElement('a');
  a.href = url;
  return a.hostname;
}

function updateTimer (url, callback) {

  var local = chrome.storage.local;
  local.get('domainTimes', function (data) {
    var domainTimes = data.domainTimes || {};
    var currentSeconds = domainTimes[url];
    currentSeconds = currentSeconds !== undefined ? currentSeconds + 1 : 0;
    domainTimes[url] = currentSeconds;
    local.set({
      'domainTimes': domainTimes
    });
  });

  local.get('notificationTimes', function (data) {
    var notificationTimes = data.notificationTimes || {};
    var currentSeconds = notificationTimes[url];
    currentSeconds = currentSeconds !== undefined ? currentSeconds + 1 : 0;
    notificationTimes[url] = currentSeconds;
    local.set({
      'notificationTimes': notificationTimes
    });

    // these need methods
    var hasTask = true;
    var notCompleted = true;

    if (currentSeconds >= threshold && hasTask && notCompleted) {
      fetchTask(function (task) {
        createNotification({
          'url': url,
          'id': task.id,
          'title': task.title,
          'body': 'You should probably get off of ' + url + ' and get back to ' + task.title
        });
      })
    }
  });
}

function updateActiveTabDurations () {

  chrome.tabs.onActiveChanged.addListener(function (tabId) {
    chrome.tabs.get(tabId, function (tabData) {
      var url = extractDomain(tabData.url);
      currentURL = url;
      currentTabId = tabId;
      updateTimer(currentURL);
    });
  });

  if (!currentURL) {
    chrome.tabs.query({active: true, windowType: 'normal', lastFocusedWindow:true}, function (tabData) {
      currentTabId = tabData.id;
      currentURL = extractDomain(tabData.url);
    });
  }

  updateTimer(currentURL);
}

chrome.tabs.onUpdated.addListener(function (tabId, changed) {
  if (changed.url && currentTabId === tabId) {
    currentURL = changed.url;
  }
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

  storage.set({
    'backgroundState': 'exchangingCode'
  }, function () {

    $.ajax(exchangeProxy + '/exchange', {
      'type': 'POST',
      'data': {
        'code': code
      },
      'timeout': timeout
    })
    .always(function (response) {

      storage.set({
        'backgroundState': undefined
      }, function () {

        if (response && response.access_token) {
          saveTokenData(response, function () {

            callback && callback(response.access_token);
          });
        }
      });
    });
  });
}

function login () {

  var state = ''+ Math.random();

  storage.set({
    'backgroundState': 'loggingIn'
  }, function () {

    chrome.identity.launchWebAuthFlow({
      'url': getAuthURL(state),
      'interactive': true
    }, function (redirectURL) {

      storage.set({
        'backgroundState': undefined
      }, function () {

        var params = getParams(redirectURL);
        if (params.state === state && params.code) {
          exchangeCode(params.code);
        }
      });
    });
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

function fetchData (callback) {

  storage.get([
    'accessToken',
    'exchangingCode'
  ], function (data) {

    accessToken = data.accessToken;
    callback(data);
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
        console.error(resp, code);
        callback();
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

  return getService('tasks').update(task.id, task.revision, data);
}

function updateSubtask (subtask, data) {

  return getService('subtasks').update(subtask.id, subtask.revision, data);
}

function fetchSubtasks (taskID) {

  return getService('subtasks').forTask(taskID);
}

function createNotification (data) {

  if (data.id) {
    chrome.notifications.create(
      data.url + '',
      {
        'type': 'basic',
        'iconUrl': '../icons/clock.png',
        'title': 'You have the thing "' + data.title + '" that you wanted to get done.' ,
        'message': data.body,
        'contextMessage': data.title
      },
      function () {
        chrome.runtime.lastError && console.error(chrome.runtime.lastError);
      }
    );

    chrome.notifications.onClosed.addListener(function (notificationId) {
      chrome.storage.local.get('notificationTimes', function (data) {
        var notificationTimes = data.notificationTimes;
        notificationTimes[notificationId] = 0;
        chrome.storage.local.set({
          'notificationTimes': notificationTimes
        });
      });
    });
  }
}

function resetTimers () {
  chrome.storage.local.set({
    'notificationTimes': {}
  });
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

setInterval(function () {
  updateActiveTabDurations();
}, 1000);