/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("vwks.nlp.s2p.mm.doc.history.ext.controller.ListReportExt", {
	/*
	 * Event handler for Init 
	 */
	onInit: function () {
		this._oMySmartFilterBar = this.getView().byId("listReportFilter");
		this._oMySmartFilterText = this.getView().byId("template::FilterText"); // label for hidden filter bar toolbar
		this._oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		// adding additional handling for variant management for custom field
		this._oMySmartFilterBar.attachBeforeVariantFetch(this.onBeforeVariantFetch);
		this._oMySmartFilterBar.attachAfterVariantLoad(this.onAfterVariantLoad);
	},
	/*
	 * Event handler for restoring Custom Filter State
	 * @param {object} oEvent is the reference object 
	 */
	onBeforeVariantFetch: function (oEvent) {
		var oCustomFilterSwitch = this.getControlByKey("Last24hours");
		var bFilterState = oCustomFilterSwitch.getState();
		var oFilterBar = oEvent.getSource();
		oFilterBar.setFilterData({
			_CUSTOM: {
				Last24hours: bFilterState
			}
		});
	},
	/*
	 * Setting Custom Filter in Variant
	 * @param {object} oEvent is the reference object 
	 */
	onAfterVariantLoad: function (oEvent) {
		this.getControlByKey("Last24hours").setState(this.getFilterData()._CUSTOM.Last24hours);
	},

	/**
	 * Event handler for Switch change
	 * @param {object} oEvent is the reference object 
	 */
	handleSwitchChange: function (oEvent) {
		var aCustomData = oEvent.getSource().getCustomData();
		for (var i = 0; i < aCustomData.length; i++) {
			if (aCustomData[i].getKey() === "hasValue") {
				aCustomData[i].setValue(oEvent.getSource().getState());
				break;
			}
		}
	},

	/*
	 * Event handler called before rebinding table
	 * @param {object} oEvent is the reference object 
	 */
	onBeforeRebindTableExtension: function (oEvent) {
		var oBindingParams = oEvent.getParameter("bindingParams");
		oBindingParams.parameters = oBindingParams.parameters || {};
		var oSmartTable = oEvent.getSource();
		var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());
		var b24HrFilterValue;
		if (oSmartFilterBar instanceof sap.ui.comp.smartfilterbar.SmartFilterBar) {
			//Custom price filter
			var oCustomControl = oSmartFilterBar.getControlByKey("Last24hours");
			if (oCustomControl instanceof sap.m.Switch) {
				b24HrFilterValue = oCustomControl.getState();
				if (b24HrFilterValue === true) {
					oBindingParams.filters.push(new sap.ui.model.Filter("Last24hr", "EQ", "true"));
				}
				//else all records irrespective of time should come up
			}
		}
	}
});