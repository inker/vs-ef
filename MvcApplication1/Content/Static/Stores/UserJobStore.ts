Ext.define('Stores.UserJobStore', <Ext.data.IStore> {
    extend: 'Ext.data.Store',
    model: 'Models.UserJob',
    //data: {
    //    items: [
    //        { 'ID': 1, 'UserID': 1, 'JobID': 3 },
    //        { 'ID': 2, 'UserID': 1, 'JobID': 2 },
    //        { 'ID': 3, 'UserID': 2, 'JobID': 1 }
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
            create: '/Users/UserJobs',
            read: '/Users/UserJobs',
            update: undefined,
            destroy: '/Users/UserJobs'
        },
        actionMethods: {
            create: 'POST',
            read: 'GET',
            update: 'POST',
            destroy: 'DELETE'
        }
    }
});