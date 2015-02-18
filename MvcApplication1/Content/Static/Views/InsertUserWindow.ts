﻿function getInputValueById2(id: string) {
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
                Ext.Ajax.request({
                    url: '/Users',
                    params: insertParams,
                    method: 'POST',
                    success: util2.onAjaxSuccess,
                    failure: util2.onAjaxFail
                });
                Ext.WindowManager.get('insertUserWindow').destroy();
            }
        }, {
            text: 'Cancel',
            handler: () =>  Ext.WindowManager.get('insertUserWindow').destroy()
        }
    ]
});