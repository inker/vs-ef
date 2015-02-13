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



    Ext.create('Ext.data.Store', {
        model: 'Organisation',
        storeId: 'organisationStore',
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
        autoLoad: { callback: checkLoading }
    });

    Ext.create('Ext.data.Store', {
        model: 'User',
        storeId: 'userStore',
        //data: {
        //    'items': [
        //
        //        { 'ID': 1, 'Name': 'Anton', 'Surname': 'Veselyev', 'OrganisationID': 1 },
        //        { 'ID': 2, 'Name': 'Random', 'Surname': 'User', 'OrganisationID': 2 },
        //    ]
        //},
        proxy: {
	        type: 'ajax',
            url: '/Users'
        },
        autoLoad: { callback: checkLoading }
        //proxy: {
        //    type: 'memory',
        //    reader: {
        //        type: 'json',
        //        root: 'items'
        //    }
        //}
    });

    Ext.create('Ext.data.Store', {
        model: 'Job',
        storeId: 'jobStore',
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
        autoLoad: { callback: checkLoading }
    });

    Ext.create('Ext.data.Store', <Ext.data.IStore> {
        model: 'UserJob',
        storeId: 'userJobStore',
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
        autoLoad: { callback: checkLoading }
    });

    //Ext.StoreManager.lookup('organisationStore').load();

    var orgs = Ext.StoreManager.lookup('organisationStore');
    var jobs = Ext.StoreManager.lookup('jobStore');
    var userJobs = Ext.StoreManager.lookup('userJobStore');
    var users = Ext.StoreManager.lookup('userStore');
    users.sync();
    orgs.sync();
    jobs.sync();
    userJobs.sync();
    console.log(orgs);
    //orgs.sync();
    //Ext.StoreManager.lookup('userStore').sync();
    //orgs.sync();

    function getOrgName(value, metadata, record, rowIndex, colIndex, store, view) {
        return orgs.getById(record.get('OrganisationID')).get('Name');
    }

    function findJobs(user) {
        var jobArr = [];
        // get userjobs with specified user-id
        // for each userjob find job by its id & push to job array
        userJobs.query('UserID', user.getId()).each(item => jobArr.push(jobs.getById(item.get('JobID'))));
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

    function checkLoading() {
        var loading = 0;
        Ext.data.StoreManager.each(store => loading += store.isLoading());
        if (!loading) {
            initGUI();
        }
    }

    function initGUI() {
        var gridPanel: Ext.grid.IGridPanel = Ext.create('Ext.grid.Panel', {
            title: 'Users',
            store: Ext.data.StoreManager.lookup('userStore'),
            columns: [
                { text: 'ID', dataIndex: 'ID', width: '10%' },
                { text: 'Full Name', xtype: 'templatecolumn', tpl: '{Name} {Surname}' },
                { text: "Organisation", renderer: getOrgName },
                { text: "Jobs", renderer: getJobString },
                { text: 'Org', renderer: (value, metadata, record, rowIndex, colIndex, store, view) => record.getOrganisation().get('Name') }
            ],
            width: 500,
            renderTo: Ext.getBody()
        });

        var tb: Ext.toolbar.IToolbar = Ext.create('Ext.toolbar.Toolbar', {
            hidden: true,
            vertical: true,
            width: 150,

            renderTo: Ext.getBody()
        });

        var button: Ext.button.ISplit = Ext.create('Ext.button.Split', {
            text: 'Action',
            handler: initialButtonHander,
            menu: Ext.create('Ext.menu.Menu', {
                items: [
                    {
                        text: 'Insert user',
                        handler: () => {
                            resetToolbar();
                            tb.add({
                                id: 'org',
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
                                        id: 'job' + fieldNumber,
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
                                    Name: (<HTMLInputElement>document.querySelector("[placeholder=name]")).value,
                                    Surname: (<HTMLInputElement>document.querySelector("[placeholder=surname]")).value,
                                    Organisation: (<HTMLInputElement>document.querySelector("[placeholder=organization]")).value
                                }
                                var jobPanelSize = jobPanel.items.getCount();
                                var jobs = [];
                                for (var i = 1; i <= jobPanelSize; ++i) {
                                    jobs.push((<HTMLInputElement>document.querySelector("[placeholder='job #" + i + "']")).value)
                                }
                                insertParams['Jobs'] = jobs.join(',');
                                Ext.Ajax.request({
                                    url: '/Users',
                                    params: insertParams,
                                    method: 'POST',
                                    success: (response, options) => users.load({ callback: () => users.sync() })
                                });
                                resetToInitialState();
                            });
                        }
                    }, {
                        text: 'Delete user',
                        handler: () => {
                            resetToolbar();
                            tb.show();
                            button.setText("Delete user");
                            button.setHandler(() => {
                                gridPanel.setLoading();
                                Ext.Ajax.request({
                                    url: '/Users',
                                    params: {
                                        Name: (<HTMLInputElement>document.querySelector("[placeholder=name]")).value,
                                        Surname: (<HTMLInputElement>document.querySelector("[placeholder=surname]")).value
                                    },
                                    method: 'DELETE',
                                    success: (response, options) => users.load({ callback: () => users.sync() })

                                });
                                resetToInitialState();
                            });
                        }
                    }, {
                        text: 'Add job to user',
                        handler: () => {
                            resetToolbar();
                            tb.add({
                                id: 'job',
                                xtype: 'textfield',
                                name: 'Job',
                                emptyText: "job to add"
                            });
                            tb.show();
                            button.setText("Proceed");
                            button.setHandler(() => {
                                gridPanel.setLoading();
                                Ext.Ajax.request({
                                    url: '/Users/Jobs/' + (<HTMLInputElement>document.querySelector("[placeholder='job to add']")).value,
                                    params: {
                                        Name: (<HTMLInputElement>document.querySelector("[placeholder=name]")).value,
                                        Surname: (<HTMLInputElement>document.querySelector("[placeholder=surname]")).value
                                    },
                                    method: 'POST',
                                    success: (response, options) => {
                                        Ext.data.StoreManager.each(store => {
                                            store.load({
                                                callback: () => {
                                                    store.sync();
                                                    gridPanel.getView().refresh();
                                                }
                                            });
                                        });
                                        
                                    }
                                });
                                resetToInitialState();
                            });

                        }
                    }, {
                        text: 'Remove job from user',
                        handler: () => {
                            resetToolbar();
                            tb.add({
                                id: 'job',
                                xtype: 'textfield',
                                name: 'Job',
                                emptyText: "job to remove"
                            });
                            tb.show();
                            button.setText("Remove job");
                            button.setHandler(() => {
                                gridPanel.setLoading();
                                Ext.Ajax.request({
                                    url: '/Users/Jobs/' + (<HTMLInputElement>document.querySelector("[placeholder='job to remove']")).value,
                                    params: {
                                        Name: (<HTMLInputElement>document.querySelector("[placeholder=name]")).value,
                                        Surname: (<HTMLInputElement>document.querySelector("[placeholder=surname]")).value
                                    },
                                    method: 'DELETE',
                                    success: (response, options) => {
                                        Ext.data.StoreManager.each(store => {
                                            store.load({
                                                callback: () => {
                                                    store.sync();
                                                    gridPanel.getView().refresh();
                                                }
                                            });
                                        });

                                    }
                                });
                                resetToInitialState();
                            });

                        }
                    }
                ]
            }),
            renderTo: Ext.getBody()
        });

        var panel = Ext.create('Ext.panel.Panel', {
            bodyPadding: 5,  // Don't want content to crunch against the borders
            title: 'Filters',
            items: [gridPanel, tb, button],
            bbar: Ext.create('Ext.ux.StatusBar', {
                id: 'my-status',

                // defaults to use when the status is cleared:
                defaultText: 'Default status text',
                defaultIconCls: 'default-icon',

                // values to set initially:
                text: 'Ready',
                iconCls: 'ready-icon',

                // any standard Toolbar items:
                items: [{
                    text: 'A Button'
                }, '-', 'Plain Text']
            }),
            renderTo: Ext.getBody()
        });

        function initialButtonHander() {
            button.showMenu();
            button.setText("choose action");
        }

       function resetToolbar() {
            tb.hide();
            tb.removeAll();
            tb.add({
                id: 'name',
                xtype: 'textfield',
                name: 'Name',
                emptyText: "name"
            });
            tb.add({
                id: 'surname',
                xtype: 'textfield',
                name: 'Surname',
                emptyText: "surname"
            });
            button.setHandler(initialButtonHander);
        };

        function resetToInitialState() {
            resetToolbar();
            button.setText("Action");
        }

        resetToolbar();
    }

    // testing
    //console.log(u);
    //console.log(u.get('Surname'));
    //o4.Users().add(u);
    //u.getOrganisation(org => console.log(org.get('Name')));
    //console.log(orgs.getById(1).get('Name'));
    //console.log(o5.Users());
});