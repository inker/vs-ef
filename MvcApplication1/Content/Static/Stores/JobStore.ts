Ext.define('Stores.JobStore', {
    extend: 'Ext.data.Store',
    model: 'Models.Job',
    storeId: 'Jobs',
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
        url: '/Users/Jobs'
    }
    
}); 