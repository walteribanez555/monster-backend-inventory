import { deleteOutput, getOutput, postOutput, putOutput } from "../models/outputs.model.mjs";



export async function getOutputs({ id,init, end,product_id,warehouse_id, limit, offset }) {
    return getOutput({id,init, end, product_id, warehouse_id, limit , offset, schema : 'monster'}); 

}

export async function postOutputs({ data }) {
    return postOutput({data, schema : 'monster'});

}

export async function putOutputs({ id, data}){
    return putOutput({ id, data , schema : 'monster'});

}

export async function deleteOutputs({ id }){
    return deleteOutput({id , schema : 'monster'})
    
}