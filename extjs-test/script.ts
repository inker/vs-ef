/// <reference path="./ExtJS.d.ts"/>

Ext.onReady(function () {
	//debugger;
	Ext.create('Ext.data.Store', {
	    storeId:'simpsonsStore',
	    fields:['name', 'email', 'phone'],
	    data: { 'items':[
	        { 'name': 'Lisa',  "email":"lisa@simpsons.com",  "phone":"555-111-1224"  },
	        { 'name': 'Bart',  "email":"bart@simpsons.com",  "phone":"555-222-1234" },
	        { 'name': 'Homer', "email":"home@simpsons.com",  "phone":"555-222-1244"  },
	        { 'name': 'Marge', "email":"marge@simpsons.com", "phone":"555-222-1254"  }
	    ]},
	    proxy: {
	        type: 'memory',
	        reader: {
	            type: 'json',
	            root: 'items'
	        }
	    }
	});

	Ext.create('Ext.grid.Panel', {
	    title: 'Simpsons',
	    store: Ext.data.StoreManager.lookup('simpsonsStore'),
	    columns: [
	        { text: 'Name',  dataIndex: 'name' },
	        { text: 'Email', dataIndex: 'email', flex: 1 },
	        { text: 'Phone', dataIndex: 'phone' }
	    ],
	    height: 200,
	    width: 400,
	    renderTo: Ext.getBody()
	});

	Ext.define('User', {
	    extend: 'Ext.data.Model',
	    fields: [
            { name: 'ID', type: 'int' },
            { name: 'Name', type: 'string' },
            { name: 'Surname', type: 'string' },
            { name: 'OrganisationID', type: 'int' }
	    ],
	    validations: [
            { type: 'presence', field: 'ID' }
	    ],
        belongsTo: { model: 'Organisation' }

	});

	Ext.define('Job', {
	    extend: 'Ext.data.Model',
	    fields: [
            { name: 'ID', type: 'int' },
            { name: 'Name', type: 'string' },
	    ],
	    validations: [
            { type: 'presence', field: 'ID' }
	    ]
	});

	Ext.define('UserJob', {
	    extend: 'Ext.data.Model',
	    fields: [
            { name: 'ID', type: 'int' },
            { name: 'UserID', type: 'int' },
            { name: 'JobID', type: 'int' }
	    ],
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
	    validations: [
            { type: 'presence', field: 'ID' }
	    ],
	    hasMany: { model: 'User', name: 'users' }
	});

	Ext.create('Ext.data.Store', {
        model: 'User',
	    storeId: 'usersStore',
	    data: {
	        'items': [
                { 'name': 'Lisa', "email": "lisa@simpsons.com", "phone": "555-111-1224" },
                { 'name': 'Bart', "email": "bart@simpsons.com", "phone": "555-222-1234" },
                { 'name': 'Homer', "email": "home@simpsons.com", "phone": "555-222-1244" },
                { 'name': 'Marge', "email": "marge@simpsons.com", "phone": "555-222-1254" }
	        ]
	    },
	    proxy: {
	        type: 'ajax',
	        url: 'someurl.json' // later to be changed
	    }
	});

});