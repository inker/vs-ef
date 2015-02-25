function getInputValueById(id: string) {
    var table = <HTMLTableElement>Ext.get(id).dom;
    table = <HTMLTableElement>table.tBodies[0];
    var row = <HTMLTableRowElement>table.rows[0];
    var cell = <HTMLTableCellElement>row.cells[1];
    var input = <HTMLInputElement>cell.children[0];
    return input.value;
}

function onAjaxSuccess(response, options) {
    reloadDataOneConnection();
    Ext.getCmp('userGrid').setLoading(false);
}

function onAjaxFail(response, options) {
    Ext.Msg.alert('Error', 'Data was not delivered to the server',() => Ext.getCmp('userGrid').setLoading(false));
}

/* method 1: connection for each store */
function reloadData() {
    Ext.data.StoreManager.each((store: Ext.data.IStore) => store.load(() => Ext.getCmp('userGrid').getView().refresh()));
}

/* method 2: one connection, all stores are updated after success */
function reloadDataOneConnection() {
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

function syncAddedJobs(user: Ext.data.IModel, window: Ext.IComponent) {
    var jobs = Ext.StoreManager.lookup('Jobs');
    var userJobs = Ext.StoreManager.lookup('UserJobs');

    var jobNameArr: string[] = [];
    var jobNum: number = window['jobNum'];
    for (var i = 1; i <= jobNum; ++i) {
        jobNameArr.push(getInputValueById('job' + i));
    }
    jobNameArr.forEach(jobName => {
        var job = jobs.findRecord('Name', jobName, 0, false, true, true);
        if (job) {
            var uj = makeNewUserJob(user, job);
            userJobs.add(uj);
        } else {
            job = Ext.create('Models.Job', { Name: jobName });
            jobs.add(job);
        }
    });

    var newJobs = jobs.getNewRecords();
    if (newJobs.length > 0) {
        syncAndLoad(jobs,() => {
            newJobs.forEach(newJob => {
                newJob = jobs.findRecord('Name', newJob.get('Name'), 0, false, true, true);
                var uj = makeNewUserJob(user, newJob);
                userJobs.add(uj);
            });
            syncAndCloseWindow(userJobs, window);
        });
    } else {
        syncAndCloseWindow(userJobs, window);
    }
}

function syncAndLoad(store: Ext.data.IStore, onSuccess: Function) {
    store.sync({
        success: () => store.load(onSuccess),
        failure: () => Ext.Msg.alert('Error', 'Data was not delivered to the server from ' + store.storeId, () => Ext.getCmp('userGrid').setLoading(false))
    });
}

function makeNewUserJob(user: Ext.data.IModel, job: Ext.data.IModel): Ext.data.IModel {
    return Ext.create('Models.UserJob', {
        UserID: user.getId(),
        JobID: job.getId()
    });
}

function syncAndCloseWindow(store: Ext.data.IStore, window: Ext.IComponent) {
    syncAndLoad(store,() => {
        //store.reload();
        (<Ext.grid.IPanel>Ext.getCmp('userGrid')).getView().refresh();
    });
    window.destroy();
}