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
        url: '/Users/Organisations'
    }
}); 