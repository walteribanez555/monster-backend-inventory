import { deleteWarehouse, getWarehouse, postWarehouse, putWarehouse } from "../models/warehouses.model.mjs";

export async function getWarehouses({id}) {
    return getWarehouse({id , schema : 'monster'});
}

export async function postWarehouses({data}) {
    return postWarehouse({data , schema: 'monster'});
}

export async function putWarehouses({id, data}) {
    return putWarehouse({id , data , schema: 'monster'});
}

export async function deleteWarehouses({id}) {
    return deleteWarehouse({id, schema : 'monster'});
}
