Ext.define('Models.Organisation', {
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
    },
    idgen: 'sequential',

});  