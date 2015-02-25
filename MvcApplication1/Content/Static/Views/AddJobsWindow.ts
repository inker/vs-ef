/// <reference path="../util" />

Ext.define('Views.AddJobsWindow', {
    extend: 'Ext.window.Window',
    width: 200,
    layout: 'fit',
    modal: true,
    buttonAlign: 'left',
    closable: false,
    userId: 0,
    mode: 'add',
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
                var users = Ext.StoreManager.lookup('Users');
                var addJobsWindow = Ext.WindowManager.get('addJobsWindow');
                var user = users.getById(addJobsWindow['userId']);
                console.log(user);
                if (addJobsWindow['mode'] == 'add') {
                    syncAddedJobs(user, addJobsWindow);
                } else if (addJobsWindow['mode'] == 'remove') {
                    syncRemovedJobs(user, addJobsWindow);
                }
                
            }
        }, {
            icon: 'https://cdn3.iconfinder.com/data/icons/musthave/16/Redo.png',
            text: 'Cancel',
            handler: () => Ext.WindowManager.get('addJobsWindow').destroy()
        }
    ]
}); 