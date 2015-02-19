Ext.define('Stores.JobStore', {
    extend: 'Ext.data.Store',
    model: 'Models.Job',
    //data: {
    //    items: [
    //        { 'ID': 1, 'Name': 'student' },
    //        { 'ID': 2, 'Name': 'coder' },
    //        { 'ID': 3, 'Name': 'slacker' }
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
            create: '/Users/Jobs',
            read: '/Users/Jobs',
            update: undefined,
            destroy: '/Users/Jobs'
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