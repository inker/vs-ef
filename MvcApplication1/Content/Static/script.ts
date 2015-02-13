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
        data: {
            items: [
                { 'ID': 1, 'Name': 'ITMO' },
                { 'ID': 2, 'Name': 'Some organization' },
                { 'ID': 3, 'Name': 'Another organization' }
            ]
        },
        proxy: {
            type: 'memory',
            reader: {
                type: 'json',
                root: 'items'
            }
        }
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
            url: '/Users/' // later to be changed
	    }
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
        data: {
            items: [
                { 'ID': 1, 'Name': 'student' },
                { 'ID': 2, 'Name': 'coder' },
                { 'ID': 3, 'Name': 'slacker' }
            ]
        },
        proxy: {
            type: 'memory',
            reader: {
                type: 'json',
                root: 'items'
            }
        }
    });

    Ext.create('Ext.data.Store', <Ext.data.IStore> {
        model: 'UserJob',
        storeId: 'userJobStore',
        data: {
            items: [
                { 'ID': 1, 'UserID': 1, 'JobID': 3 },
                { 'ID': 2, 'UserID': 1, 'JobID': 2 },
                { 'ID': 3, 'UserID': 2, 'JobID': 1 }
            ]
        },
        proxy: {
            type: 'memory',
            reader: {
                type: 'json',
                root: 'items'
            }
        }
    });

    //Ext.StoreManager.lookup('organisationStore').load();

    var orgs = Ext.StoreManager.lookup('organisationStore');
    var jobs = Ext.StoreManager.lookup('jobStore');
    var userJobs = Ext.StoreManager.lookup('userJobStore');
    var users = Ext.StoreManager.lookup('userStore');
    debugger
    users.load()
    orgs.sync();
    Ext.StoreManager.lookup('userStore').sync();
    orgs.sync();

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

    var u = Ext.create('User', { ID: 9, Name: 'foo', Surname: 'barr' });
    var o5 = Ext.create('Organisation', { ID: 5, Name: 'some 5 org 5' });
    var o4 = Ext.create('Organisation', { ID: 4, Name: 'some 4 org 4' });
    
    
    //u.setOrganisation(o5);
    o4.Users().add(u);
    console.log(o5);
    orgs.add(o5);
    orgs.add(o4);
    
    console.log(u);
    //console.log(orgs);
    users.add(u); 
    orgs.sync();
    users.sync();
    
    var gridPanel: Ext.grid.IGridPanel = Ext.create('Ext.grid.Panel', {
        title: 'Users',
        store: Ext.data.StoreManager.lookup('userStore'),
        columns: [
	        { text: 'ID', dataIndex: 'ID', width: '10%' },
	        { text: 'Full Name', xtype: 'templatecolumn', tpl: '{Name} {Surname}'},
            { text: "Organisation", renderer: getOrgName },
            { text: "Jobs", renderer: getJobString },
            { text: 'Org', renderer: (value, metadata, record, rowIndex, colIndex, store, view) => record.getOrganisation().get('Name') }
	    ],
	    height: 200,
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
                            emptyText: "user's organization"
                        });
                        tb.add({
                            id: 'addJobButton',
                            xtype: 'button',
                            text: "add job",
                            handler: () => {
                                var fieldNumber = tb.items.getCount() - 3;
                                tb.add({
                                    id: 'job' + fieldNumber,
                                    xtype: 'textfield',
                                    name: 'Job',
                                    emptyText: 'job #' + fieldNumber
                                });
                            }
                        });
                        tb.show();
                        button.setText("Insert user");
                        button.setHandler(() => {
                            // add insertion to db
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
                            // add deletion from db
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
                            // add job addition
                            resetToInitialState();
                            alert("job supposed to be added to user");
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
                            // add job removal
                            resetToInitialState();
                            alert("job supposed to be removed from user");
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
            xtype: 'textfield',
            name: 'Name',
            emptyText: "user's name"
        });
        tb.add({
            xtype: 'textfield',
            name: 'Surname',
            emptyText: "user's surname"
        });
        button.setHandler(initialButtonHander);
    };

    function resetToInitialState() {
        resetToolbar();
        button.setText("Action");
    }

    resetToolbar();

    // testing
    //console.log(u);
    //console.log(u.get('Surname'));
    //o4.Users().add(u);
    //u.getOrganisation(org => console.log(org.get('Name')));
    console.log(orgs.getById(1).get('Name'));
    console.log(o5.Users());
});