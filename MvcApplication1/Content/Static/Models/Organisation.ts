Ext.define('Models.Organisation', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'ID', type: 'int' },
        { name: 'Name', type: 'string' },
    ],
    idProperty: 'ID',
    hasMany: {
        model: 'Models.User',
        name: 'Users',
        primaryKey: 'ID',
        foreignKey: 'OrganisationID',
        associationKey: 'Users'
    },
    //idgen: 'sequential',
    proxy: {
        type: 'ajax',
        api: {
            create: '/Users/Organisations',
            read: '/Users/Organisations',
            update: '/Users/Organisations',
            destroy: '/Users/Organisations'
        },
        actionMethods: {
            create: 'POST',
            read: 'GET',
            update: 'PUT',
            destroy: 'DELETE'
        },
        writer: {
            type: 'json',
            allowSingle: false,
            writeAllFields: true,
        },
    }
});  