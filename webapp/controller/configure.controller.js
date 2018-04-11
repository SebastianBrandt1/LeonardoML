/* global JSZip:true */
sap.ui.define([
	"LeonardoML/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("LeonardoML.controller.configure", {
		onInit: function() {
			this.oViewModel = new JSONModel({
				url: ""
			});
			this.getView().setModel(this.oViewModel);
		},
	
		onMenuAction: function(oEvent) {
			var oItem = oEvent.getParameter("item"),
				sItemPath = "";
			while (oItem instanceof sap.m.MenuItem) {
				sItemPath = oItem.getText() + " > " + sItemPath;
				oItem = oItem.getParent();
			}

			sItemPath = sItemPath.substr(0, sItemPath.lastIndexOf(" > "));

			sap.m.MessageToast.show("Action triggered on item: " + sItemPath);
		}

	});
});