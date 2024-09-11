import { deleteProductType, getProductType, postProductType, putProductType } from "../models/products_type.model.mjs";



export async function getProductTypes({id}){
    return getProductType({id , schema : 'redcard'});
}

export async function postProductTypes({data}) {
    return postProductType({data , schema : 'redcard'});
}

export async function deleteProductTypes({ id }) {
    return deleteProductType({id , schema : 'redcard'});
}

export async function putProducTypes({id, data}) { 
    return putProductType({ id , data , schema: 'redcard'});
}