import util = require('../util');

Ext.define('Views.UserGrid', {
    extend: 'Ext.grid.Panel',
    id: 'userGrid',
    title: 'Users',
    store: Ext.ModelManager.getModel('Models.User'),
    multiSelect: true,
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            pluginId: "cellEditing",
            clicksToEdit: 1
        })
    ],
    tbar: [
        {
            icon: 'https://cdn0.iconfinder.com/data/icons/weboo-2/128/plus.png',
            text: 'Insert user',
            handler: () => Ext.create('Views.InsertUserWindow')
        }, {
            icon: 'https://cdn0.iconfinder.com/data/icons/weboo-2/128/plus.png',
            text: 'Add job to user',
            disabled: true,
            handler: () => jobOperationButtonHandler('add')
        }, {
            icon: 'https://cdn0.iconfinder.com/data/icons/weboo-2/128/error.png',
            text: 'Remove job from user',
            disabled: true,
            handler: () => jobOperationButtonHandler('remove')
        }
    ],
    columns: [
        { text: 'ID', dataIndex: 'ID', width: '10%' },
        { text: 'Full Name', xtype: 'templatecolumn', tpl: '{Name} {Surname}' },
        { text: "Organisation", renderer: util.getOrgName },
        { text: "Jobs", renderer: util.getJobString },
        {
            xtype: 'actioncolumn',
            items: [{
                icon: 'https://cdn0.iconfinder.com/data/icons/weboo-2/128/error.png',
                tooltip: 'delete user',
                tooltipType: 'title',
                handler: (grid: Ext.grid.IGridPanel, rowIndex: number) => {
                    this.setLoading();
                    var rec = grid.getStore().getAt(rowIndex)
                    console.log(rec.get('Name'));
                    Ext.Ajax.request({
                        url: '/Users',
                        params: {
                            Name: rec.get('Name'),
                            Surname: rec.get('Surname')
                        },
                        method: 'DELETE',
                        success: util.onAjaxSuccess,
                        failure: util.onAjaxFail
                    });
                }
            }]
        }
    ],
    //width: 500,
    renderTo: Ext.getBody()
});

function jobOperationButtonHandler(action: string) {
    //var add: boolean;
    //if (action == 'add') add = true;
    //else if (action == 'remove') add = false;
    //else return;
    //resetToolbarAndButton();
    //tb.add({
    //    id: 'jobField',
    //    xtype: 'textfield',
    //    name: 'Job',
    //    emptyText: 'job to ' + action
    //});
    //tb.show();
    //button.setText(add ? 'Proceed' : 'Remove job');
    //button.setHandler(() => {
    //    gridPanel.setLoading();
    //    Ext.Ajax.request({
    //        url: '/Users/Jobs/' + getInputValueById('jobField'),
    //        params: {
    //            Name: getInputValueById('nameField'),
    //            Surname: getInputValueById('surnameField')
    //        },
    //        method: add ? 'POST' : 'DELETE',
    //        success: onAjaxSuccess,
    //        failure: onAjaxFail
    //    });
    //    resetToolbarAndButton();
    //});
}