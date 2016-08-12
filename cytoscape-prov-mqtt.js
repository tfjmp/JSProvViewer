;(function () {
	'use strict';

	// registers the extension on a cytoscape lib ref
	var register = function (cytoscape) {
		if (!cytoscape) {
			return;
		} // can't register if cytoscape unspecified


		var _instance;
		cytoscape('core', 'prov_mqtt', function (opts) {
			var cy = this;

			var options = {
				clipboardSize: 0
			};

			// Create a client instance
			var client;
			var elementID;
			var channel;

			// called when the client connects
			function onConnect() {
				// Once a connection has been made, make a subscription and send a message.
				console.log("Connected!");
				document.getElementById(elementID).innerHTML="Connected!";
				client.subscribe(channel);
			}

			// called when the client loses its connection
			function onConnectionLost(responseObject) {
				if (responseObject.errorCode !== 0) {
					console.log("onConnectionLost:", responseObject.errorMessage);
					document.getElementById(elementID).innerHTML="Lost connection!";
					setTimeout(function() { client.connect() }, 5000);
				}
			}

			// called when a message arrives
			function onMessageArrived(message) {
				cy.prov_json().parse(message.payloadString);
				console.log(message.payloadString);
				document.getElementById(elementID).innerHTML="Data received!";
			}

			function onFailure(invocationContext, errorCode, errorMessage) {
				alert(errorMessage);
				document.getElementById(elementID).innerHTML=errorMessage;
			}

			$.extend(true, options, opts);

			function getScratch() {
				if (!cy.scratch("_prov_mqtt")) {
					cy.scratch("_prov_mqtt", { });
				}
				return cy.scratch("_prov_mqtt");
			}

			if (!getScratch().isInitialized) {
				getScratch().isInitialized = true;

				_instance = {
					init: function (url, port, clientID){
						client = new Paho.MQTT.Client(url, port, clientID);

						// set callback handlers
						client.onConnectionLost = onConnectionLost;
						client.onMessageArrived = onMessageArrived;
					},

					setOutputElement: function(id){
						elementID = id;
					},

					setChannel: function(name){
						channel = name;
					},

					connect: function(ssl, userName, password){
						client.connect({
										useSSL: ssl,
										userName: userName,
										password: password,
										onSuccess: onConnect,
										onFailure: onFailure
									});
					}
				}
			}
			return _instance; // chainability
		});
	};



	if (typeof module !== 'undefined' && module.exports) { // expose as a commonjs module
		module.exports = register;
	}

	if (typeof define !== 'undefined' && define.amd) { // expose as an amd/requirejs module
		define('cytoscape-clipboard', function () {
			return register;
		});
	}

	if (typeof cytoscape !== 'undefined') { // expose to global cytoscape (i.e. window.cytoscape)
		register(cytoscape);
	}

})();