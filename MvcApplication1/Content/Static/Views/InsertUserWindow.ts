/// <reference path="../util" />

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
            handler: okButtonHandler
        }, {
            icon: 'https://cdn3.iconfinder.com/data/icons/musthave/16/Redo.png',
            text: 'Cancel',
            handler: () =>  Ext.WindowManager.get('insertUserWindow').destroy()
        }
    ]
});

function okButtonHandler() {
    Ext.WindowManager.get('insertUserWindow').hide();
    var ug: Ext.grid.IPanel = Ext.getCmp('userGrid');
    
    var orgs = Ext.StoreManager.lookup('Organisations');
    var orgName = getInputValueById('orgField');

    var org = findOneByName(orgs, orgName);
    if (org) {
        syncOrgDescendants(org);
    } else {
        org = Ext.create('Models.Organisation', { Name: orgName });
        orgs.add(org);
        syncAndLoad(orgs,() => {
            org = findOneByName(orgs, orgName);
            if (!org) throw new Error("org sucks!");
            console.log('newly created org should be: ');
            console.log(org);
            syncOrgDescendants(org);
        }, "couldn't sync orgs");
    }
}

function syncOrgDescendants(org: Ext.data.IModel) {
    var users = Ext.StoreManager.lookup('Users');

    var userName = getInputValueById('nameField');
    var userSurname = getInputValueById('surnameField');
    var user: Ext.data.IModel = Ext.create('Models.User', {
        Name: userName,
        Surname: userSurname,
        OrganisationID: org.getId()
    });

    users.add(user);

    syncAndLoad(users,() => {
        var index = users.findBy((i: Ext.data.IModel) => i.get('Name') == userName && i.get('Surname') == userSurname);
        user = users.getAt(index);
        var jobs = Ext.StoreManager.lookup('Jobs');
        var userJobs = Ext.StoreManager.lookup('UserJobs');

        var jobNameArr: string[] = [];
        var jobNum = Ext.getCmp('insertUserWindow').jobNum;
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
            syncAndLoad(jobs, () => {
                newJobs.forEach(newJob => {
                    newJob = jobs.findRecord('Name', newJob.get('Name'), 0, false, true, true);
                    var uj = makeNewUserJob(user, newJob);
                    userJobs.add(uj);
                });
                syncAndCloseWindow(userJobs);
            }, "couldn't sync jobs");
        } else {
            syncAndCloseWindow(userJobs);
        }
    }, "couldn't sync users");
}

function findOneByName(store: Ext.data.IStore, name: string) {
    return store.findRecord('Name', name, 0, false, true, true);
}

function syncAndLoad(store: Ext.data.IStore, onSuccess: Function, onFailureMessage: string) {
    store.sync({
        success: () => store.load(onSuccess),
        failure: console.log(onFailureMessage)
    });
}

function makeNewUserJob(user: Ext.data.IModel, job: Ext.data.IModel): Ext.data.IModel {
    return Ext.create('Models.UserJob', {
        UserID: user.getId(),
        JobID: job.getId()
    });
}

function syncAndCloseWindow(store: Ext.data.IStore) {
    syncAndLoad(store,() => {
        store.reload();
        (<Ext.grid.IPanel>Ext.getCmp('userGrid')).getView().refresh();
    }, "couldn't sync userjobs");
    Ext.WindowManager.get('insertUserWindow').destroy();
} 