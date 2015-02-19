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
            writeAllFields: true,
        },
    }
    //proxy: {
    //    type: 'memory',
    //    reader: {
    //        type: 'json',
    //        root: 'items'
    //    }
    //}
});