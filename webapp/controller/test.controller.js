/* global JSZip:true */
sap.ui.define([
	"LeonardoML/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function(BaseController, MessageToast, MessageBox, JSONModel) {
	"use strict";

	return BaseController.extend("LeonardoML.controller.test", {
		onInit: function() {
			this.oViewModel = new JSONModel({
				url: ""
			});
			this.getView().setModel(this.oViewModel);
		},
		onTypeMissmatch: function(oEvent) {
			MessageToast.show(this.getText("test.type_missmatch"));
		},
		onUploadStart: function(oEvent) {
			this.fnUploadDisplay(this.oLastFile);
		},
		onUploadComplete: function(oEvent) {
			// get the current view
			var oView = this.getView();
			var service = "imageclassifier";

			var processResult = function(data) {
			    var sFilename;
			    function findFile(aArray) { 
                        return aArray.Filename === sFilename;
                }
			    var aCollection = this.getView().getModel().getProperty("/ZipCollection");
			    for(var i in data.predictions){
			        //aCollection.find()
			        sFilename = data.predictions[i].name;
                    var oObject = aCollection.find(findFile);
                    oObject.Classification = data.predictions[i].results;
			    }
			    this.getView().getModel().setProperty("/ZipCollection",aCollection);
			};

			if (oEvent.getParameters().status === 200) {
				// get the response as JSON and process the results
				processResult.bind(this)(JSON.parse(oEvent.getParameters().responseRaw));
			} else {
				MessageBox.show("Error " + oEvent.getParameters().status + " : " + JSON.parse(oEvent.getParameters().responseRaw).error_description);
			}
			//this.oBusyIndicator.close();
			MessageToast.show(this.getText("test.upload_complete"));
		},
		fnUploadDisplay: function(oFile) {
			this.getView().getModel().setProperty("/url", []);
			this.getView().getModel().setProperty("/ZipCollection", []);
			var fnCallback = function(oObject) {
				var aCollection = this.getView().getModel().getProperty("/ZipCollection");
				aCollection.push(oObject);
				this.getView().getModel().setProperty("/ZipCollection", aCollection);
			};
			if (oFile.type.match("image.*")) {
				this.fnImageLoad(oFile, fnCallback.bind(this));
			} else {
				this.fnZipLoad(oFile, fnCallback.bind(this));
			}

		},
		fnImageLoad: function(oFile, fnCallback) {
			var oObject = {
				Filename: oFile.name,
				UncompressedSize: (oFile.size / 1024.0).toFixed(2),
				CompressedSize: (oFile.size / 1024.0).toFixed(2),
				Classification: [],
				URL: URL.createObjectURL(oFile)
			};
			fnCallback(oObject);
		},
		fnZipLoad: function(oFile, fnCallback) {
			JSZip.loadAsync(oFile) // 1) read the Blob
				.then(function(zip) {
					zip.forEach(function(sRelPath, oZipObject) {
						if ((oZipObject.dir === false) && (oZipObject.name.split('.').pop().toUpperCase() === 'JPG')) {
							oZipObject.async("blob").then(function(bin) {
								var oObject = {
									Filename: oZipObject.name,
									UncompressedSize: (oZipObject._data.uncompressedSize / 1024.0).toFixed(2),
									CompressedSize: (oZipObject._data.compressedSize / 1024.0).toFixed(2),
									Classification: [],
									URL: URL.createObjectURL(bin)
								};
								fnCallback(oObject);
							});
						}
					});
				}, function(err) {});
		},

		onChange: function(oEvent) {
			this.oLastFile = oEvent.getParameter("files") && oEvent.getParameter("files")[0];
		}

	});
});