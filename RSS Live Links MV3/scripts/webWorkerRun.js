var inWorker = true;
function logMsg(msg) {
	self.postMessage({consoleMsg: msg});
}

importScripts("utilities.js", "feedWorker.js", "../xml4script/tinyxmlsax.js", "../xml4script/tinyxmlw3cdom.js", "xmlhttp.js");

var xmlHttpRequestManager = new XMLHttpRequestManager();
self.addEventListener('message', 
	function(e) {
		var message = e.data;
		runRequest(message);
	}, false);

function runRequest(message) {
	try {
		if (message.request == "set_max_cncrnt_rqsts") {
			xmlHttpRequestManager.setMaxRunning(message.data);
			returnResponse(message.id);
		} else 	if (message.request == "update_feed") {
			runUpdate(message.id, message.data);
		} else {
			returnError(message.id, "Web Worker: unrecognized request: " + message.request);
		}
	} catch (e) {
		returnError(message.id, {name: e.name, message: e.message});
	}
}

function returnResponse(id, data) {
	var response = {};
	response.id = id;
	response.data = data;
	response.ok = true;
	self.postMessage(response);
}

function returnError(id, error) {
	var response = {};
	response.id = id;
	response.error = error;
	self.postMessage(response);
}
