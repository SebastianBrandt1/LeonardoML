sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"LeonardoML/model/models",
	"LeonardoML/libs/jszip.min"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("LeonardoML.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			
			// create the views based on the url/hash
            this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		}
	});
});