Ext.define('Models.Job', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'ID', type: 'int' },
        { name: 'Name', type: 'string' },
    ],
    idProperty: 'ID',
    hasMany: {
        model: 'Models.UserJob',
        name: 'UserJobs',
        primaryKey: 'ID',
        foreignKey: 'JobID',
        associationKey: 'UserJobs'
    },
    //idgen: 'sequential',
    proxy: {
        type: 'ajax',
        api: {
            create: '/Users/Jobs',
            read: '/Users/Jobs',
            update: undefined,
            destroy: '/Users/Jobs'
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