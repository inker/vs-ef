Ext.define('Models.UserJob', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'ID', type: 'int' },
        { name: 'UserID', type: 'int' },
        { name: 'JobID', type: 'int' }
    ],
    idProperty: 'ID',
    //idgen: 'sequential',
    proxy: {
        type: 'ajax',
        api: {
            create: '/Users/UserJobs',
            read: '/Users/UserJobs',
            update: undefined,
            destroy: '/Users/UserJobs'
        },
        actionMethods: {
            create: 'POST',
            read: 'GET',
            update: 'POST',
            destroy: 'DELETE'
        },
        writer: {
            type: 'json',
            allowSingle: false,
            writeAllFields: true,
        },
    }
});