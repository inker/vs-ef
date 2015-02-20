function getInputValueById2(id: string) {
    var table = <HTMLTableElement>Ext.get(id).dom;
    table = <HTMLTableElement>table.tBodies[0];
    var row = <HTMLTableRowElement>table.rows[0];
    var cell = <HTMLTableCellElement>row.cells[1];
    var input = <HTMLInputElement>cell.children[0];
    return input.value;
}

Ext.define('Views.InsertUserWindow', {
    extend: 'Ext.window.Window',
    title: 'Insert new user',
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
                            xtype: 'textfield',
                            id: 'nameField',
                            itemId: 'nameField',
                            name: 'name',
                            emptyText: 'Name',
                            allowBlank: false,
                            flex: 1
                        }, {
                            xtype: 'textfield',
                            id: 'surnameField',
                            name: 'surname',
                            emptyText: 'Surname',
                            allowBlank: false,
                            flex: 1
                        }, {
                            xtype: 'textfield',
                            id: 'orgField',
                            name: 'org',
                            emptyText: 'Organization',
                            allowBlank: false,
                            flex: 1
                        }, {
                            id: 'addJobInputButton',
                            itemId: 'addJobInputButton',
                            xtype: 'button',
                            icon: 'https://cdn3.iconfinder.com/data/icons/musthave/16/Add.png',
                            name: 'addJobInputButton',
                            text: 'add job',
                            handler: () => {
                                var jobNum = ++Ext.getCmp('insertUserWindow').jobNum;
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
                var insertParams = {
                    Name: getInputValueById2('nameField'),
                    Surname: getInputValueById2('surnameField'),
                    Organisation: getInputValueById2('orgField')
                };
                var jobArr: string[] = [];
                var jobNum = Ext.getCmp('insertUserWindow').jobNum
                for (var i = 1; i <= jobNum; ++i) {
                    jobArr.push(getInputValueById2('job' + i));
                }
                insertParams['Jobs'] = jobArr.join(',');
                //Ext.Ajax.request({
                //    url: '/Users',
                //    params: insertParams,
                //    method: 'POST',
                //    success: util2.onAjaxSuccess,
                //    failure: util2.onAjaxFail
                //});
                var ug: Ext.grid.IPanel = Ext.getCmp('userGrid');
                var users = Ext.StoreManager.lookup('Users');
                var orgs = Ext.StoreManager.lookup('Organisations');
                var orgName = getInputValueById2('orgField');
                var orgCollection = orgs.query('Name', orgName, false, false, true);
                var org = (orgCollection.getCount()) ? orgCollection.first() : Ext.create('Models.Organisation', { Name: orgName });

                orgs.add(org);
                orgs.sync({
                    callback: () => {
                        var user: Ext.data.IModel = Ext.create('Models.User', {
                            Name: getInputValueById2('nameField'),
                            Surname: getInputValueById2('surnameField'),
                            Organisation: org
                        });

                        users.add(user);
                        users.sync({
                            callback: () => {
                                var jobs = Ext.StoreManager.lookup('Jobs');
                                var jobCollection = jobs.query('Name', orgName, false, false, true);
                                var userJobs = Ext.StoreManager.lookup('UserJobs');
                                jobArr.forEach(jobName => {
                                    var jobCollection = jobs.query('Name', jobName, false, false, true);
                                    var job: Ext.data.IModel = (jobCollection.getCount()) ? jobCollection.first() : Ext.create('Models.Job', { Name: jobName });
                                    jobs.add(job);
                                    jobs.sync({
                                        callback: () => {
                                            var userJob = Ext.create('Models.UserJob', { UserID: user.getId(), JobID: job.getId() });
                                            userJobs.add(userJob);
                                            userJobs.sync();
                                        }
                                    });
                                    
                                }); 
                                

                                Ext.WindowManager.get('insertUserWindow').destroy();
                            }
                        });
  
                    }
                });
            }
        }, {
            icon: 'https://cdn3.iconfinder.com/data/icons/musthave/16/Redo.png',
            text: 'Cancel',
            handler: () =>  Ext.WindowManager.get('insertUserWindow').destroy()
        }
    ]
});