export function onAjaxSuccess(response, options) {
    reloadDataOneConnection();
    Ext.getCmp('userGrid').setLoading(false);
}

export function onAjaxFail(response, options) {
    Ext.Msg.alert('Error', 'Data was not delivered to the server',() => Ext.getCmp('userGrid').setLoading(false));
}

/* method 1: connection for each store */
export function reloadData() {
    Ext.data.StoreManager.each((store: Ext.data.IStore) => store.load(() => Ext.getCmp('userGrid').getView().refresh()));
}

/* method 2: one connection, all stores are updated after success */
export function reloadDataOneConnection() {
    Ext.Ajax.request({
        url: '/Users',
        method: 'GET',
        success: res => {
            var data = JSON.parse(res.responseText);
            Ext.data.StoreManager.eachKey((key: string, store: Ext.data.IStore) => {
                if (key != 'ext-empty-store') {
                    store.loadData(data[key]);
                }
            });
            onAllStoresLoad(() => Ext.getCmp('userGrid').getView().refresh());
        },
        failure: onAjaxFail
    });
}

export function onAllStoresLoad(callback: () => void) {
    var loading = 0;
    Ext.data.StoreManager.each(store => loading += store.isLoading());
    if (!loading) {
        callback();
    }
}

export function getOrgName(value, metadata, record, rowIndex, colIndex, store, view) {
    return Ext.StoreManager.lookup('orgStore').getById(record.get('OrganisationID')).get('Name');
}

export function findJobs(user) {
    var jobArr = [];
    var jobs = Ext.StoreManager.lookup('Jobs');
    // get userjobs with specified user-id
    // for each userjob find job by its id & push to job array
    Ext.StoreManager.lookup('UserJobs')
        .query('UserID', user.getId(), false, false, true)
        .each(item => jobArr.push(jobs.getById(item.get('JobID'))));
    console.log(jobArr);
    return jobArr;
}

export function getJobString(value, metadata, record, rowIndex, colIndex, store, view) {
    // get jobs array, map them to job-name array & convert to string
    return findJobs(record).map(job => job.get('Name')).join('<br>');
}