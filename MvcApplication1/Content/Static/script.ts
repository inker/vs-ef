/// <reference path="./ExtJS.d.ts"/>
Ext.onReady(() => {

    Ext.define('User', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID', type: 'int' },
            { name: 'Name', type: 'string' },
            { name: 'Surname', type: 'string' },
            { name: 'OrganisationID', type: 'int' }
        ],
        idProperty: 'ID',
        validations: [
            { type: 'presence', field: 'ID' }
        ],
        //belongsTo: { 
        //    model: 'Organisation',
        //    name: 'Organisation',
        //    //getterName: 'getOrganisation',
        //    //setterName: 'setOrganisation',
        //    //instanceName: 'Organisation',
        //    primaryKey: 'ID',
        //    foreignKey: 'OrganisationID',
        //    associationKey: 'OrganisationID', 
        //    //foreignStore: 'organisationStore'
        //},
        hasMany: {
            model: 'UserJob',
            name: 'UserJobs',
            primaryKey: 'ID',
            foreignKey: 'UserID'
        }

    });

    Ext.define('Job', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID', type: 'int' },
            { name: 'Name', type: 'string' },
        ],
        idProperty: 'ID',
        validations: [
            { type: 'presence', field: 'ID' }
        ],
        hasMany: {
            model: 'UserJob',
            name: 'UserJobs',
            primaryKey: 'ID',
            foreignKey: 'JobID'
        }
    });

    Ext.define('UserJob', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID', type: 'int' },
            { name: 'UserID', type: 'int' },
            { name: 'JobID', type: 'int' }
        ],
        idProperty: 'ID',
        validations: [
            { type: 'presence', field: 'ID' },
            { type: 'presence', field: 'UserID' },
	        { type: 'presence', field: 'JobID' }
        ]
    });

    Ext.define('Organisation', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID', type: 'int' },
            { name: 'Name', type: 'string' },
        ],
        idProperty: 'ID',
        validations: [
            { type: 'presence', field: 'ID' }
        ],
        hasMany: {
            model: 'User',
            name: 'Users',
            primaryKey: 'ID',
            foreignKey: 'OrganisationID',
        }
    });

    var orgs: Ext.data.IStore = Ext.create('Ext.data.Store', {
        model: 'Organisation',
        storeId: 'Organisations',
        //data: {
        //    items: [
        //        { 'ID': 1, 'Name': 'ITMO' },
        //        { 'ID': 2, 'Name': 'Some organization' },
        //        { 'ID': 3, 'Name': 'Another organization' }
        //    ]
        //},
        //proxy: {
        //    type: 'memory',
        //    reader: {
        //        type: 'json',
        //        root: 'items'
        //    }
        //}
        proxy: {
            type: 'ajax',
            url: '/Users/Organisations'
        },
        autoLoad: { callback: () => onAllStoresLoad(initGUI) }
    });

    var users: Ext.data.IStore = Ext.create('Ext.data.Store', {
        model: 'User',
        storeId: 'Users',
        //data: {
        //    'items': [
        //
        //        { 'ID': 1, 'Name': 'Anton', 'Surname': 'Veselyev', 'OrganisationID': 1 },
        //        { 'ID': 2, 'Name': 'Random', 'Surname': 'User', 'OrganisationID': 2 },
        //    ]
        //},
        proxy: { 
	        type: 'ajax', 
            url: '/Users/Users'
        },
        autoLoad: { callback: () => onAllStoresLoad(initGUI) }
        //proxy: {
        //    type: 'memory',
        //    reader: {
        //        type: 'json',
        //        root: 'items'
        //    }
        //}
    });

    var jobs: Ext.data.IStore = Ext.create('Ext.data.Store', {
        model: 'Job',
        storeId: 'Jobs',
        //data: {
        //    items: [
        //        { 'ID': 1, 'Name': 'student' },
        //        { 'ID': 2, 'Name': 'coder' },
        //        { 'ID': 3, 'Name': 'slacker' }
        //    ]
        //},
        //proxy: {
        //    type: 'memory',
        //    reader: {
        //        type: 'json',
        //        root: 'items'
        //    }
        //}
        proxy: {
            type: 'ajax',
            url: '/Users/Jobs'
        },
        autoLoad: { callback: () => onAllStoresLoad(initGUI) }
    });

    var userJobs: Ext.data.IStore = Ext.create('Ext.data.Store', <Ext.data.IStore> {
        model: 'UserJob',
        storeId: 'UserJobs',
        //data: {
        //    items: [
        //        { 'ID': 1, 'UserID': 1, 'JobID': 3 },
        //        { 'ID': 2, 'UserID': 1, 'JobID': 2 },
        //        { 'ID': 3, 'UserID': 2, 'JobID': 1 }
        //    ]
        //},
        //proxy: {
        //    type: 'memory',
        //    reader: {
        //        type: 'json',
        //        root: 'items'
        //    }
        //}
        proxy: {
            type: 'ajax',
            url: '/Users/UserJobs'
        },
        autoLoad: { callback: () => onAllStoresLoad(initGUI) }
    });

    //Ext.StoreManager.lookup('organisationStore').load();

    console.log(orgs);

    function getOrgName(value, metadata, record, rowIndex, colIndex, store, view) {
        return orgs.getById(record.get('OrganisationID')).get('Name');
    }

    function findJobs(user) {
        var jobArr = [];
        // get userjobs with specified user-id
        // for each userjob find job by its id & push to job array
        userJobs
            .query( 'UserID', user.getId(), false, false, true )
            .each( item => jobArr.push(jobs.getById(item.get('JobID'))) );
        console.log(jobArr);
        return jobArr;
    }

    function getJobString(value, metadata, record, rowIndex, colIndex, store, view) {
        // get jobs array, map them to job-name array & convert to string
        return findJobs(record).map(job => job.get('Name')).join('<br>');
    }

    //var u = Ext.create('User', { ID: 9, Name: 'foo', Surname: 'barr' });
    //var o5 = Ext.create('Organisation', { ID: 5, Name: 'some 5 org 5' });
    //var o4 = Ext.create('Organisation', { ID: 4, Name: 'some 4 org 4' });
    
    
    ////u.setOrganisation(o5);
    //o4.Users().add(u);
    //console.log(o5);
    //orgs.add(o5);
    //orgs.add(o4);
    
    //console.log(u);
    ////console.log(orgs);
    //users.add(u); 
    //orgs.sync();
    //users.sync();

    function onAllStoresLoad(callback: () => void) {
        var loading = 0;
        Ext.data.StoreManager.each(store => loading += store.isLoading());
        if (!loading) {
            callback();
        }
    }

    function initGUI() {
        var gridPanel: Ext.grid.IGridPanel = Ext.create('Ext.grid.Panel', {
            title: 'Users',
            store: users,
            tbar: [
                {
                    text: 'Insert user',
                    handler: () => {
                        resetToolbarAndButton();
                        tb.add({
                            id: 'orgField',
                            xtype: 'textfield',
                            name: 'Organisation',
                            emptyText: "organization"
                        });
                        tb.add({
                            id: 'addJobButton',
                            xtype: 'button',
                            text: "add job",
                            handler: () => {
                                var fieldNumber = jobPanel.items.getCount() + 1;
                                jobPanel.add({
                                    id: 'jobField' + fieldNumber,
                                    xtype: 'textfield',
                                    name: 'Job',
                                    emptyText: 'job #' + fieldNumber,
                                    margin: 0
                                });
                            }
                        });
                        var jobPanel: Ext.panel.IPanel = Ext.create('Ext.panel.Panel', {
                            id: 'jobPanel'
                        });
                        tb.add(jobPanel);
                        tb.show();
                        button.setText("Insert user");

                        button.setHandler(() => {
                            gridPanel.setLoading(); // as if the view is updating
                            var insertParams = {
                                Name: getInputValueById('nameField'),
                                Surname: getInputValueById('surnameField'),
                                Organisation: getInputValueById('orgField')
                            }
                            var jobPanelSize = jobPanel.items.getCount();
                            var jobs = [];
                            for (var i = 1; i <= jobPanelSize; ++i) {
                                jobs.push(getInputValueById('jobField' + i))
                            }
                            insertParams['Jobs'] = jobs.join(',');
                            Ext.Ajax.request({
                                url: '/Users',
                                params: insertParams,
                                method: 'POST',
                                success: onAjaxSuccess,
                                failure: onAjaxFail
                            });
                            resetToInitialState();
                        });
                    }
                }, {
                    text: 'Delete user',
                    handler: () => {
                        resetToolbarAndButton();
                        tb.show();
                        button.setText("Delete user");
                        button.setHandler(() => {
                            gridPanel.setLoading();
                            Ext.Ajax.request({
                                url: '/Users',
                                params: {
                                    Name: getInputValueById('nameField'),
                                    Surname: getInputValueById('surnameField')
                                },
                                method: 'DELETE',
                                success: onAjaxSuccess,
                                failure: onAjaxFail
                            });
                            resetToInitialState();
                        });
                    }
                }, {
                    text: 'Add job to user',
                    handler: () => jobOperationButtonHandler('add')
                }, {
                    text: 'Remove job from user',
                    handler: () => jobOperationButtonHandler('remove')
                }
            ],
            columns: [
                { text: 'ID', dataIndex: 'ID', width: '10%' },
                { text: 'Full Name', xtype: 'templatecolumn', tpl: '{Name} {Surname}' },
                { text: "Organisation", renderer: getOrgName },
                { text: "Jobs", renderer: getJobString },
                {
                    text: '',
                    xtype: 'actioncolumn',
                    //items: [{
                    //    text: 'X',
                    //    handler: () => alert("deleted user")
                    //}]
                }
            ],
            //width: 500,
            renderTo: Ext.getBody()
        });

        var tb: Ext.toolbar.IToolbar = Ext.create('Ext.toolbar.Toolbar', {
            hidden: true,
            vertical: true,
            width: 150,
            renderTo: Ext.getBody()
        });

        var button: Ext.button.ISplit = Ext.create('Ext.button.Split', {
            id: "actionButton",
            text: 'Action',
            // on button click
            handler: initialButtonHander,
            menu: Ext.create('Ext.menu.Menu', {
                // split menu items
                items: [
                    {
                        text: 'Insert user',
                        handler: () => {
                            resetToolbarAndButton();
                            tb.add({
                                id: 'orgField',
                                xtype: 'textfield',
                                name: 'Organisation',
                                emptyText: "organization"
                            });
                            tb.add({
                                id: 'addJobButton',
                                xtype: 'button',
                                text: "add job",
                                handler: () => {
                                    var fieldNumber = jobPanel.items.getCount() + 1;
                                    jobPanel.add({
                                        id: 'jobField' + fieldNumber,
                                        xtype: 'textfield',
                                        name: 'Job',
                                        emptyText: 'job #' + fieldNumber,
                                        margin: 0
                                    });
                                }
                            });
                            var jobPanel: Ext.panel.IPanel = Ext.create('Ext.panel.Panel', {
                                id: 'jobPanel'
                            });
                            tb.add(jobPanel);
                            tb.show();
                            button.setText("Insert user");

                            button.setHandler(() => {
                                gridPanel.setLoading(); // as if the view is updating
                                var insertParams = {
                                    Name: getInputValueById('nameField'),
                                    Surname: getInputValueById('surnameField'),
                                    Organisation: getInputValueById('orgField')
                                }
                                var jobPanelSize = jobPanel.items.getCount();
                                var jobs = [];
                                for (var i = 1; i <= jobPanelSize; ++i) {
                                    jobs.push(getInputValueById('jobField' + i))
                                }
                                insertParams['Jobs'] = jobs.join(',');
                                Ext.Ajax.request({
                                    url: '/Users',
                                    params: insertParams,
                                    method: 'POST',
                                    success: onAjaxSuccess,
                                    failure: onAjaxFail
                                });
                                resetToInitialState();
                            });
                        }
                    }, {
                        text: 'Delete user',
                        handler: () => {
                            resetToolbarAndButton();
                            tb.show();
                            button.setText("Delete user");
                            button.setHandler(() => {
                                gridPanel.setLoading();
                                Ext.Ajax.request({
                                    url: '/Users',
                                    params: {
                                        Name: getInputValueById('nameField'),
                                        Surname: getInputValueById('surnameField')
                                    },
                                    method: 'DELETE',
                                    success: onAjaxSuccess,
                                    failure: onAjaxFail
                                });
                                resetToInitialState();
                            });
                        }
                    }, {
                        text: 'Add job to user',
                        handler: () => jobOperationButtonHandler('add')
                    }, {
                        text: 'Remove job from user',
                        handler: () => jobOperationButtonHandler('remove')
                    }
                ]
            }),
            renderTo: Ext.getBody()
        });
        resetToolbarAndButton();

        function initialButtonHander() {
            button.showMenu();
            button.setText("choose action");
        }

       function resetToolbarAndButton() {
            tb.hide();
            tb.removeAll();
            tb.add({
                id: 'nameField',
                xtype: 'textfield',
                name: 'Name',
                emptyText: "name"
            });
            tb.add({
                id: 'surnameField',
                xtype: 'textfield',
                name: 'Surname',
                emptyText: "surname"
            });
            button.setHandler(initialButtonHander);
        };

        resetToolbarAndButton();

        function resetToInitialState() {
            resetToolbarAndButton();
            button.setText("Action");
        }

        function jobOperationButtonHandler(action: string) {
            var add: boolean;
            if (action == 'add') add = true;
            else if (action == 'remove') add = false;
            else return;
            resetToolbarAndButton();
            tb.add({
                id: 'jobField',
                xtype: 'textfield',
                name: 'Job',
                emptyText: 'job to ' + action
            });
            tb.show();
            button.setText(add ? 'Proceed' : 'Remove job');
            button.setHandler(() => {
                gridPanel.setLoading();
                Ext.Ajax.request({
                    url: '/Users/Jobs/' + getInputValueById('jobField'),
                    params: {
                        Name: getInputValueById('nameField'),
                        Surname: getInputValueById('surnameField')
                    },
                    method: add ? 'POST' : 'DELETE',
                    success: onAjaxSuccess,
                    failure: onAjaxFail
                });
                resetToInitialState();
            });
        }

        function getInputValueById(id: string) {
            var table = <HTMLTableElement>Ext.get(id).dom;
            table = <HTMLTableElement>table.tBodies[0];
            var row = <HTMLTableRowElement>table.rows[0];
            var cell = <HTMLTableCellElement>row.cells[1];
            var input = <HTMLInputElement>cell.children[0];
            return input.value;
        }

        function onAjaxSuccess(response, options) {
            reloadDataOneConnection();
            gridPanel.setLoading(false);
        }

        function onAjaxFail(response, options) {
            Ext.Msg.alert('Error', 'Data was not delivered to the server', () => gridPanel.setLoading(false));
        }

        /* method 1: connection for each store */
        function reloadData() {
            Ext.data.StoreManager.each((store: Ext.data.IStore) => store.load( () => gridPanel.getView().refresh() ));
        }

        /* method 2: one connection, all stores are updated after success */
        function reloadDataOneConnection() {
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
                    onAllStoresLoad(() => gridPanel.getView().refresh());
                },
                failure: onAjaxFail
            });
        }
        
    }

    addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.keyCode == 13) Ext.get("actionButton").dom.click()
    });

    // testing
    //console.log(u);
    //console.log(u.get('Surname'));
    //o4.Users().add(u);
    //u.getOrganisation(org => console.log(org.get('Name')));
    //console.log(orgs.getById(1).get('Name'));
    //console.log(o5.Users());
});