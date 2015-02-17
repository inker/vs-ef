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
                            name: 'name',
                            emptyText: 'Name',
                            allowBlank: false,
                            flex: 1
                        },
                        {
                            xtype: 'textfield',
                            id: 'surnameField',
                            name: 'surname',
                            emptyText: 'Surname',
                            allowBlank: false,
                            flex: 1
                        },
                        {
                            xtype: 'textfield',
                            id: 'orgField',
                            name: 'org',
                            emptyText: 'Organization',
                            allowBlank: false,
                            flex: 1
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
                this.hide();
            }
        }, {
            text: 'Cancel',
            handler: () => {
                this.hide();
            }
        }
    ]
});