/// <reference path="./ExtJS.d.ts"/>

import util = require('./util');

Ext.onReady(() => {

    console.log(Ext.ModelManager.getModel('Models.User'));

    var orgs: Ext.data.IStore = Ext.create('Stores.OrganisationStore', {
        autoLoad: { callback: () => util.onAllStoresLoad(initGUI) }
    });

    var users: Ext.data.IStore = Ext.create('Stores.UserStore', {
        autoLoad: { callback: () => util.onAllStoresLoad(initGUI) }
    });

    var jobs: Ext.data.IStore = Ext.create('Stores.JobStore', {
        autoLoad: { callback: () => util.onAllStoresLoad(initGUI) }
    });

    var userJobs: Ext.data.IStore = Ext.create('Stores.UserJobStore', {
        autoLoad: { callback: () => util.onAllStoresLoad(initGUI) }
    }); 

    //Ext.StoreManager.lookup('organisationStore').load();

    //var u = Ext.create('User', { ID: 9, Name: 'foo', Surname: 'barr' });
    //var o5 = Ext.create('Organisation', { ID: 5, Name: 'some 5 org 5' });
    //var o4 = Ext.create('Organisation', { ID: 4, Name: 'some 4 org 4' });
    
    
    ////u.setOrganisation(o5);
    //o4.Users().add(u);
    //console.log(o5);
    //orgs.add(o5);
    //orgs.add(o4);
    
    //console.log(u);
    ////console.log(orgs);
    //users.add(u); 
    //orgs.sync();
    //users.sync();



    function initGUI() {

        var gridPanel: Ext.grid.IGridPanel = Ext.create('Views.UserGrid');
         
        //var tb: Ext.toolbar.IToolbar = Ext.create('Ext.toolbar.Toolbar', {
        //    hidden: true,
        //    vertical: true,
        //    width: 150,
        //    renderTo: Ext.getBody()
        //});

        //var button: Ext.button.ISplit = Ext.create('Ext.button.Split', {
        //    id: "actionButton",
        //    text: 'Action',
        //    // on button click
        //    handler: initialButtonHander,
        //    menu: Ext.create('Ext.menu.Menu', {
        //        // split menu items
        //        items: [
        //            {
        //                text: 'Insert user',
        //                handler: () => {
        //                    resetToolbarAndButton();
        //                    tb.add({
        //                        id: 'orgField',
        //                        xtype: 'textfield',
        //                        name: 'Organisation',
        //                        emptyText: "organization"
        //                    });
        //                    tb.add({
        //                        id: 'addJobButton',
        //                        xtype: 'button',
        //                        text: "add job",
        //                        handler: () => {
        //                            var fieldNumber = jobPanel.items.getCount() + 1;
        //                            jobPanel.add({
        //                                id: 'jobField' + fieldNumber,
        //                                xtype: 'textfield',
        //                                name: 'Job',
        //                                emptyText: 'job #' + fieldNumber,
        //                                margin: 0
        //                            });
        //                        }
        //                    });
        //                    var jobPanel: Ext.panel.IPanel = Ext.create('Ext.panel.Panel', {
        //                        id: 'jobPanel'
        //                    });
        //                    tb.add(jobPanel);
        //                    tb.show();
        //                    button.setText("Insert user");

        //                    button.setHandler(() => {
        //                        gridPanel.setLoading(); // as if the view is updating
        //                        var insertParams = {
        //                            Name: getInputValueById('nameField'),
        //                            Surname: getInputValueById('surnameField'),
        //                            Organisation: getInputValueById('orgField')
        //                        }
        //                        var jobPanelSize = jobPanel.items.getCount();
        //                        var jobs = [];
        //                        for (var i = 1; i <= jobPanelSize; ++i) {
        //                            jobs.push(getInputValueById('jobField' + i))
        //                        }
        //                        insertParams['Jobs'] = jobs.join(',');
        //                        Ext.Ajax.request({
        //                            url: '/Users',
        //                            params: insertParams,
        //                            method: 'POST',
        //                            success: onAjaxSuccess,
        //                            failure: onAjaxFail
        //                        });
        //                        resetToolbarAndButton()
        //                    });
        //                }
        //            }, {
        //                text: 'Delete user',
        //                handler: () => {
        //                    resetToolbarAndButton();
        //                    tb.show();
        //                    button.setText("Delete user");
        //                    button.setHandler(onDeleteUserClick);
        //                }
        //            }, {
        //                text: 'Add job to user',
        //                handler: () => jobOperationButtonHandler('add')
        //            }, {
        //                text: 'Remove job from user',
        //                handler: () => jobOperationButtonHandler('remove')
        //            }
        //        ]
        //    }),
        //    renderTo: Ext.getBody()
        //});
        //resetToolbarAndButton();

        //function initialButtonHander() {
        //    button.showMenu();
        //    button.setText("choose action");
        //}

       //function resetToolbarAndButton() {
       //     tb.hide();
       //     tb.removeAll();
       //     tb.add({
       //         id: 'nameField',
       //         xtype: 'textfield',
       //         name: 'Name',
       //         emptyText: "name"
       //     });
       //     tb.add({
       //         id: 'surnameField',
       //         xtype: 'textfield',
       //         name: 'Surname',
       //         emptyText: "surname"
       //     });
       //     button.setHandler(initialButtonHander);
       //     button.setText("Action");
       // };

        //resetToolbarAndButton();

        //function onDeleteUserClick() {
        //    gridPanel.setLoading();
        //    Ext.Ajax.request({
        //        url: '/Users',
        //        params: {
        //            Name: getInputValueById('nameField'),
        //            Surname: getInputValueById('surnameField')
        //        },
        //        method: 'DELETE',
        //        success: onAjaxSuccess,
        //        failure: onAjaxFail
        //    });
        //    resetToolbarAndButton();
        //}

        //function jobOperationButtonHandler(action: string) {
        //    var add: boolean;
        //    if (action == 'add') add = true;
        //    else if (action == 'remove') add = false;
        //    else return;
        //    resetToolbarAndButton();
        //    tb.add({
        //        id: 'jobField',
        //        xtype: 'textfield',
        //        name: 'Job',
        //        emptyText: 'job to ' + action
        //    });
        //    tb.show();
        //    button.setText(add ? 'Proceed' : 'Remove job');
        //    button.setHandler(() => {
        //        gridPanel.setLoading();
        //        Ext.Ajax.request({
        //            url: '/Users/Jobs/' + getInputValueById('jobField'),
        //            params: {
        //                Name: getInputValueById('nameField'),
        //                Surname: getInputValueById('surnameField')
        //            },
        //            method: add ? 'POST' : 'DELETE',
        //            success: onAjaxSuccess,
        //            failure: onAjaxFail
        //        });
        //        resetToolbarAndButton();
        //    });
        //}

        function getInputValueById(id: string) {
            var table = <HTMLTableElement>Ext.get(id).dom;
            table = <HTMLTableElement>table.tBodies[0];
            var row = <HTMLTableRowElement>table.rows[0];
            var cell = <HTMLTableCellElement>row.cells[1];
            var input = <HTMLInputElement>cell.children[0];
            return input.value;
        }
        
        
    }

    addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.keyCode == 13) Ext.get("actionButton").dom.click()
    });

    // testing
    //console.log(u);
    //console.log(u.get('Surname'));
    //o4.Users().add(u);
    //u.getOrganisation(org => console.log(org.get('Name')));
    //console.log(orgs.getById(1).get('Name'));
    //console.log(o5.Users());
});