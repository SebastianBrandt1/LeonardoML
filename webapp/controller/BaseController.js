sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
	],function(Controller, History){
		"use strict";
		
		return Controller.extend("LeonardoML.controller.BaseController",{
			getRouter : function(){
				return sap.ui.core.UIComponent.getRouterFor(this);
			},
			getResourceBundle : function(){
				return this.getView().getModel("i18n").getResourceBundle();
			},
			getText : function(sKey){
				return this.getResourceBundle().getText(sKey);	
			},
			onNavBack : function(){
				var oHistory, sPreviousHash;
				oHistory = History.getInstance();
				sPreviousHash = oHistory.getPreviousHash();
				if(sPreviousHash !== undefined){
					window.history.go(-1);
				}else{
					this.getRouter().navTo("appTest",{},true);
				}
			},
			onMenuNav : function(oEvent){
				var oItem = oEvent.getParameter("item"),
					sId = oItem.getId().split(this.getView().getId()+'--')[1];
				
				switch(sId){
					case "idTest":
						this.getRouter().navTo("testData");
						break;
					case "idTrain":
						this.getRouter().navTo("trainData");
						break;
					case "idConfig":
						this.getRouter().navTo("configureApp");
						break;
				}
			}
		});
	});