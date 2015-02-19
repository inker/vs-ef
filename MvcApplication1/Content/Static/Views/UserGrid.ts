//import util = require('../util');

function getInputValueById(id: string) {
    var table = <HTMLTableElement>Ext.get(id).dom;
    table = <HTMLTableElement>table.tBodies[0];
    var row = <HTMLTableRowElement>table.rows[0];
    var cell = <HTMLTableCellElement>row.cells[1];
    var input = <HTMLInputElement>cell.children[0];
    return input.value;
}

function getSelectedRows() {
    var sel: Ext.selection.IRowModel = Ext.getCmp('userGrid').getSelectionModel();
    return sel.getSelection() 
}

function handleSelection() {
    var num = getSelectedRows().length;
    if (num > 1) {
        Ext.getCmp('deleteSelectedButton').setDisabled(false);
        Ext.getCmp('addJobButton').setDisabled(true)
        Ext.getCmp('removeJobButton').setDisabled(true)
    } else {
        [
            Ext.getCmp('deleteSelectedButton'),
            Ext.getCmp('addJobButton'),
            Ext.getCmp('removeJobButton')
        ].forEach(button => button.setDisabled(!num));
    }

}

var findJobs = function (user) {
    var jobArr = [];
    console.log('job: ');
    var jobs = Ext.StoreManager.lookup('Jobs');
    console.log(jobs.storeId);
    // get userjobs with specified user-id
    // for each userjob find job by its id & push to job array
    Ext.StoreManager.lookup('UserJobs')
        .query('UserID', user.getId(), false, false, true)
        .each(item => jobArr.push(jobs.getById(item.get('JobID'))));
    console.log(jobArr);
    return jobArr;
};

var util2 = {
    onAllStoresLoad: function (callback: () => void) {
        var loading = 0;
        Ext.data.StoreManager.each(store => loading += store.isLoading());
        if (!loading) {
            callback();
        }
    },

    onAjaxSuccess: function (response, options) {
        this.reloadDataOneConnection();
        Ext.getCmp('userGrid').setLoading(false);
    },

    onAjaxFail: function (response, options) {
        Ext.Msg.alert('Error', 'Data was not delivered to the server',() => Ext.getCmp('userGrid').setLoading(false));
    },

    reloadDataOneConnection: function () {
        Ext.Ajax.request({
            url: '/Users',
            method: 'GET',
            success: res => {
                var data = JSON.parse(res.responseText);
                Ext.data.StoreManager.eachKey((key: string, store: Ext.data.IStore) => {
                    if (key != 'ext-empty-store') {
                        store.loadData(data[key]);
                    }
                });
                this.onAllStoresLoad(() => Ext.getCmp('userGrid').getView().refresh());
            },
            failure: this.onAjaxFail
        });
    },

    getJobString: function (value, metadata, record, rowIndex, colIndex, store, view) {
        console.log('getting job string');
        // get jobs array, map them to job-name array & convert to string
        var jobs = findJobs(record);
        return jobs.map(job => job.get('Name')).join('<br>');
    },

    getOrgName: function (value, metadata, record, rowIndex, colIndex, store, view) {
        return Ext.StoreManager.lookup('Organisations').getById(record.get('OrganisationID')).get('Name');
    }
}

Ext.define('Views.UserGrid', {
    extend: 'Ext.grid.Panel',
    id: 'userGrid',
    getId: () => this.id,
    title: 'Users',
    store: Ext.StoreManager.lookup('Users'),
    multiSelect: true,
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            pluginId: "cellEditing",
            clicksToEdit: 1
        })
    ],
    tbar: [
        {
            icon: 'https://cdn3.iconfinder.com/data/icons/musthave/16/Add.png',
            text: 'Insert user',
            handler: () => {
                Ext.create('Views.InsertUserWindow', { id: 'insertUserWindow' }).show();
            }
        }, {
            id: 'deleteSelectedButton',
            icon: 'https://cdn3.iconfinder.com/data/icons/musthave/16/Delete.png',
            text: 'Delete selected users',
            disabled: true,
            handler: deleteSelectedHandler
        }, {
            id: 'addJobButton',
            icon: 'https://cdn3.iconfinder.com/data/icons/musthave/16/Add.png',
            text: 'Add job to user',
            disabled: true,
            //handler: () => {
            //    var ug: Ext.grid.IPanel = Ext.getCmp('userGrid');
            //    var selectedRows = ug.getSelectionModel().getSelection();
            //    var insertParams = {
            //        Name: getInputValueById('nameField'),
            //        Surname: getInputValueById('surnameField'),
            //        Organisation: getInputValueById('orgField')
            //    }
            //    var jobPanelSize = jobPanel.items.getCount();
            //    var jobs = [];
            //    for (var i = 1; i <= jobPanelSize; ++i) {
            //        jobs.push(getInputValueById('jobField' + i))
            //    }
            //    insertParams['Jobs'] = jobs.join(',');
            //    Ext.Ajax.request({
            //        url: '/Users',
            //        params: insertParams,
            //        method: 'POST',
            //        success: util2.onAjaxSuccess,
            //        failure: util2.onAjaxFail
            //    });
            //}
        }, {
            id: 'removeJobButton',
            icon: 'https://cdn3.iconfinder.com/data/icons/musthave/16/Delete.png',
            text: 'Remove job from user',
            disabled: true,
            handler: () => jobOperationButtonHandler('remove')
        }
    ],
    columns: [
        { text: 'ID', dataIndex: 'ID', width: '10%' },
        { text: 'Full Name', xtype: 'templatecolumn', tpl: '{Name} {Surname}' },
        { text: "Organisation", renderer: util2.getOrgName },
        { text: "Jobs", renderer: util2.getJobString },
        {
            xtype: 'actioncolumn',
            items: [{
                icon: 'https://cdn3.iconfinder.com/data/icons/musthave/128/Delete.png',
                tooltip: 'delete user',
                tooltipType: 'title',
                handler: (grid: Ext.grid.IGridPanel, rowIndex: number) => {
                    grid.setLoading();
                    var rec = grid.getStore().getAt(rowIndex)
                    console.log(rec.get('Name'));
                    //Ext.Ajax.request({
                    //    url: '/Users',
                    //    params: {
                    //        Name: rec.get('Name'),
                    //        Surname: rec.get('Surname')
                    //    },
                    //    method: 'DELETE',
                    //    success: util2.onAjaxSuccess,
                    //    failure: util2.onAjaxFail
                    //});
                }
            }]
        }
    ],
    selType: 'rowmodel',
    selModel: {
        listeners: {
            select: handleSelection,
            deselect: handleSelection
        },
        model: 'MULTI'
    },
    //width: 500,
    renderTo: Ext.getBody()
});

function deleteSelectedHandler() {
    var ug: Ext.grid.IPanel = Ext.getCmp('userGrid');
    var users = Ext.StoreManager.lookup('Users');
    var selectedRows = ug.getSelectionModel().getSelection();
    selectedRows.forEach(row => {
        users.remove(row); // removes from the grid too
        //Ext.Ajax.request({
        //    url: '/Users',
        //    params: {
        //        Name: row.get('Name'),
        //        Surname: row.get('Surname')
        //    },
        //    method: 'DELETE',
        //    success: util2.onAjaxSuccess,
        //    failure: util2.onAjaxFail
        //});
    });
    users.sync(); // to sync between the proxy & the database
}

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