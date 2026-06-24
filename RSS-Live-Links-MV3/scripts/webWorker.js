function WebWorker() {
	
	this.requestId = 0;

	this.worker = new Worker('scripts/webWorkerRun.js');
	this.requests = {};

	var me = this;
	this.worker.addEventListener('message', 
		function(evt) {
			me.processResponse(evt.data);
		}, false);
}

WebWorker.prototype.runRequest = function(request, data, context, doneFunc, errFunc) {
	var id = "request_" + this.requestId++;
	this.requests[id] = {context: context, doneFunc: doneFunc, errFunc: errFunc};
	this.worker.postMessage({id: id, request: request, data: data});
	return id;
}

WebWorker.prototype.processResponse = function(response) {
	var consoleMsg = response.consoleMsg;

	if (consoleMsg) {
		console.log("WebWorker Message: " + consoleMsg);
		return;
	}

	var id = response.id;
	var data = response.data;
	var error = response.error;
	console.log("Received response to request: " + id);

	request = this.requests[id];

	if (error) {
		if (error instanceof Object) {
			error = "type: " + error.type + ", message: " + error.message;
		}
		console.error("Web Worker error: " + error);
	}

	if (request) {
		delete this.requests[id];
		if (error) {
			if (request.errFunc) {
				console.log("Running error function for: " + id);
				request.errFunc(id, error, data, request.context);
			}
		} else if (request.doneFunc) {
			console.log("Running handler function for: " + id);
			request.doneFunc(id, data, request.context);
		}
	}
}

WebWorker.prototype.cancelRequest = function(id) {
	delete this.requests[id];
}

WebWorker.prototype.terminate = function(id) {
	this.worker.terminate();
}
