Ext.define('Stores.OrganisationStore', {
    extend: 'Ext.data.Store',
    model: 'Models.Organisation',
    //data: {
    //    items: [
    //        { 'ID': 1, 'Name': 'ITMO' },
    //        { 'ID': 2, 'Name': 'Some organization' },
    //        { 'ID': 3, 'Name': 'Another organization' }
    //    ]
    //},
    //proxy: {
    //    type: 'memory',
    //    reader: {
    //        type: 'json',
    //        root: 'items'
    //    }
    //}
    proxy: {
        type: 'ajax',
        api: {
            create: '/Users/Organisations',
            read: '/Users/Organisations',
            update: undefined,
            destroy: '/Users/Organisations'
        },
        actionMethods: {
            create: 'POST',
            read: 'GET',
            update: 'POST',
            destroy: 'DELETE'
        }
    }
}); 