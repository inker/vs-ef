Ext.define('Models.UserJob', {
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