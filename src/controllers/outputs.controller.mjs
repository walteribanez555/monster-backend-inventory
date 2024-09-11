import { deleteOutput, getOutput, postOutput, putOutput } from "../models/outputs.model.mjs";



export async function getOutputs({ id }) {
    return getOutput({id, schema : 'redcard'}); 

}

export async function postOutputs({ data }) {
    return postOutput({data, schema : 'redcard'});

}

export async function putOutputs({ id, data}){
    return putOutput({ id, data , schema : 'redcard'});

}

export async function deleteOutputs({ id }){
    return deleteOutput({id , schema : 'redcard'})
    
}