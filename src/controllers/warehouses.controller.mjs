import { deleteWarehouse, getWarehouse, postWarehouse, putWarehouse } from "../models/warehouses.model.mjs";

export async function getWarehouses({id}) {
    return getWarehouse({id , schema : 'redcard'});
}

export async function postWarehouses({data}) {
    return postWarehouse({data , schema: 'redcard'});
}

export async function putWarehouses({id, data}) {
    return putWarehouse({id , data , schema: 'redcard'});
}

export async function deleteWarehouses({id}) {
    return deleteWarehouse({id, schema : 'redcard'});
}
