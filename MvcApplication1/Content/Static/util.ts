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