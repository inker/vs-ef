/// <reference path="./ExtJS.d.ts"/>

Ext.onReady(function () {

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
        belongsTo: { 
            model: 'Organisation',
            name: 'Organisation',
            //getterName: 'getOrganisation',
            //setterName: 'setOrganisation',
            instanceName: 'Organisation',
            primaryKey: 'ID',
            foreignKey: 'OrganisationID',
            associationKey: 'OrganisationID', 
            //foreignStore: 'organisationStore'
        },
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
        //hasMany: {
        //    model: 'User',
        //    name: 'Users',
        //    primaryKey: 'ID',
        //    foreignKey: 'OrganisationID',
        //}
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
        data: {
            'items': [

                { 'ID': 1, 'Name': 'Anton', 'Surname': 'Veselyev', 'OrganisationID': 1 },
                { 'ID': 2, 'Name': 'Random', 'Surname': 'User', 'OrganisationID': 2 },
            ]
        },
        /*proxy: {
	        type: 'ajax',
	        url: 'someurl.json' // later to be changed
	    }*/
        proxy: {
            type: 'memory',
            reader: {
                type: 'json',
                root: 'items'
            }
        }
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

    Ext.create('Ext.data.Store', {
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
        return findJobs(record).map(j => j.get('Name')).join(', ');
    }

    
    Ext.create('Ext.grid.Panel', {
        title: 'Users',
        store: Ext.data.StoreManager.lookup('userStore'),
        columns: [
	        { text: 'ID', dataIndex: 'ID', width: '10%' },
	        { text: 'Full Name', xtype: 'templatecolumn', tpl: '{Name} {Surname}' },
            { text: "Organisation", renderer: getOrgName },
            { text: "Jobs", renderer: getJobString }
	    ],
	    height: 200,
	    width: 500,
	    renderTo: Ext.getBody()
    });

    // testing

    var User = Ext.ModelManager.get('User');
    var Organisation = Ext.ModelManager.get('Organisation');

    var o = new Organisation({ ID: 4, Name: 'some org' });
    var u = new User({ ID: 5, Name: 'foo', Surname: 'bar', OrganisationID: 4 });
    console.log(u.get('Surname'));
    
    u.setOrganisation(o);
    u.getOrganisation(function (org) {
        console.log( org.get('Name') );
    });
    console.log(Ext.StoreManager.lookup('organisationStore').getById(1).get('Name'));
    console.log(userJobs.getById(1));
});