Ext.define('Models.User', {
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