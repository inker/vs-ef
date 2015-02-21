function getInputValueById3(id: string) {
    var table = <HTMLTableElement>Ext.get(id).dom;
    table = <HTMLTableElement>table.tBodies[0];
    var row = <HTMLTableRowElement>table.rows[0];
    var cell = <HTMLTableCellElement>row.cells[1];
    var input = <HTMLInputElement>cell.children[0];
    return input.value;
}

Ext.define('Views.AddJobsWindow', {
    extend: 'Ext.window.Window',
    width: 200,
    layout: 'fit',
    modal: true,
    buttonAlign: 'left',
    closable: false,
    jobNum: 0,
    items: [
        {
            xtype: 'form',
            frame: false,
            border: 0,
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            fieldDefaults: {
                msgTarget: 'side',
                labelWidth: 55
            },
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    padding: 10,
                    layout: 'auto',
                    items: [
                        {
                            id: 'addJobInputButton',
                            itemId: 'addJobInputButton',
                            xtype: 'button',
                            icon: 'https://cdn3.iconfinder.com/data/icons/musthave/16/Add.png',
                            name: 'addJobInputButton',
                            text: 'add job',
                            handler: () => {
                                var jobNum = ++Ext.getCmp('addJobsWindow').jobNum;
                                var panel = Ext.getCmp('newJobPanel');
                                panel.add({
                                    xtype: 'textfield',
                                    id: 'job' + jobNum,
                                    name: 'Job',
                                    emptyText: 'job #' + jobNum,
                                });
                            }
                        }, {
                            id: 'newJobPanel',
                            xtype: 'panel',
                            border: false
                        }
                    ]
                }
            ]
        }
    ],
    buttons: [
        {
            icon: 'https://cdn3.iconfinder.com/data/icons/musthave/16/Check.png',
            text: 'OK',
            handler: () => {
                var jobArr: string[] = [];
                var jobNum = Ext.getCmp('addJobsWindow').jobNum
                for (var i = 1; i <= jobNum; ++i) {
                    jobArr.push(getInputValueById3('job' + i));
                }
                var jobsStr = jobArr.join(',');

                var ug: Ext.grid.IPanel = Ext.getCmp('userGrid');
                var users = Ext.StoreManager.lookup('Users');

                var ajw: Ext.window.IWindow = Ext.getCmp('addJobsWindow');
                var arr = ajw.title.match(/.*?\(id(\d+)\)/i);
                
                if (!arr) console.log('fuck');
                var user = users.getById(parseInt(arr[1]));
                console.log(user);
                var jobs = Ext.StoreManager.lookup('Jobs');
                var userJobs = Ext.StoreManager.lookup('UserJobs');
                console.log(jobArr);
                var jobObjs: Ext.data.IModel[] = [];
                jobArr.forEach(jobName => {
                    var jobCollection = jobs.query('Name', jobName, false, false, true);
                    var job: Ext.data.IModel;
                    if (jobCollection.getCount()) {
                        job = jobCollection.first();
                    } else {
                        // use extjs connections, should sync all stores
                        job = Ext.create('Models.Job', { Name: jobName });
                        jobs.add(job);
                        
                        console.log('added job: ');
                        console.log(job);
                    }
                    jobObjs.push(job);
                    
                });
                jobs.sync({
                    callback: () => {
                        jobObjs.forEach(job => {
                            console.log('adding userjob...');
                            var userJob = Ext.create('Models.UserJob', { UserID: user.getId(), JobID: job.getId() });
                            console.log(userJob);
                            userJobs.add(userJob);
                        });
                        userJobs.sync();
                    }
                });
                

                Ext.WindowManager.get('addJobsWindow').destroy();
            }
        }, {
            icon: 'https://cdn3.iconfinder.com/data/icons/musthave/16/Redo.png',
            text: 'Cancel',
            handler: () => Ext.WindowManager.get('addJobsWindow').destroy()
        }
    ]
}); 