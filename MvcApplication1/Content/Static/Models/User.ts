Ext.define('Models.User', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'ID', type: 'int' },
        { name: 'Name', type: 'string' },
        { name: 'Surname', type: 'string' },
        { name: 'OrganisationID', type: 'int' }
    ],
    idProperty: 'ID',
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
        model: 'Models.UserJob',
        name: 'UserJobs',
        primaryKey: 'ID',
        foreignKey: 'UserID',
        associationKey: 'UserJobs'
    },
    //idgen: 'sequential',
    proxy: {
        type: 'ajax',
        api: {
            create: '/Users',
            read: '/Users',
            update: undefined,
            destroy: '/Users'
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