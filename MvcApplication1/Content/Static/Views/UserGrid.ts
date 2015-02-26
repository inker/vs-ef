/// <reference path="../util" />

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
            handler: () => {
                jobOperationButtonHandler('add')
            }

        }, {
            id: 'removeJobButton',
            icon: 'https://cdn3.iconfinder.com/data/icons/musthave/16/Delete.png',
            text: 'Remove job from user',
            disabled: true,
            handler: () => {
               jobOperationButtonHandler('remove')
            }
        }
    ],
    columns: [
        { text: 'ID', dataIndex: 'ID', width: '10%' },
        { text: 'Full Name', xtype: 'templatecolumn', tpl: '{Name} {Surname}' },
        { text: "Organisation", renderer: getOrgName },
        { text: "Jobs", renderer: getJobString },
        {
            xtype: 'actioncolumn',
            items: [{
                icon: 'https://cdn3.iconfinder.com/data/icons/musthave/128/Delete.png',
                tooltip: 'delete user',
                tooltipType: 'title',
                handler: (grid: Ext.grid.IGridPanel, rowIndex: number) => {
                    var rec = grid.getStore().getAt(rowIndex)
                    var users = Ext.StoreManager.lookup('Users');
                    users.remove(rec);
                    users.sync();
                    //syncAndLoad(users,() => grid.setLoading(false));
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

function getOrgName(value, metadata, record) {
    return Ext.StoreManager.lookup('Organisations').getById(record.get('OrganisationID')).get('Name');
}

function findJobs(user) {
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
}

function getJobString(value, metadata, record, rowIndex, colIndex, store, view) {
    console.log('getting job string');
    // get jobs array, map them to job-name array & convert to string
    var jobs = findJobs(record);
    return jobs.map(job => job.get('Name')).join('<br>');
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

function deleteSelectedHandler() {
    var ug: Ext.grid.IPanel = Ext.getCmp('userGrid');
    var users = Ext.StoreManager.lookup('Users');
    var selectedRows = ug.getSelectionModel().getSelection();
    selectedRows.forEach(row => {
        users.remove(row); // removes from the grid too
    });
    users.sync(); // to sync between the proxy & the database
}

function jobOperationButtonHandler(mode: string) {
    var sel = getSelectedRows()[0];
    Ext.create('Views.AddJobsWindow', {
        id: 'addJobsWindow',
        userId: sel.getId(),
        mode: mode,
        title: sel.get('Name') + ' ' + sel.get('Surname') + ' (id' + sel.getId() + ')'
    }).show();
}