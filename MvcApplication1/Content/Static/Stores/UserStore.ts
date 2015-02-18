Ext.define('Stores.UserStore', {
    extend: 'Ext.data.Store',
    model: 'Models.User',
    //data: {
    //    'items': [
    //
    //        { 'ID': 1, 'Name': 'Anton', 'Surname': 'Veselyev', 'OrganisationID': 1 },
    //        { 'ID': 2, 'Name': 'Random', 'Surname': 'User', 'OrganisationID': 2 },
    //    ]
    //},
    proxy: { 
        type: 'ajax',
        url: '/Users/Users'
    }
    //proxy: {
    //    type: 'memory',
    //    reader: {
    //        type: 'json',
    //        root: 'items'
    //    }
    //}
});