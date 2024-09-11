import { DatabaseOperations } from "../utils/database.mjs";
import { buildResponse, validateData, colorLog } from "../utils/helpers.mjs";

const tableName = "product_type";
const idField = "product_type_id";
const keyField = "product_type_id";

const model = {
  name: "string",
  status: "string",
  categories: "string",
  type: "number",
};

export async function getProductType({id, schema}) {
  try { 

    const database = new DatabaseOperations(tableName , schema);
    const data = { 
      where : { 
        [keyField] : id
      }
    }
    const response = await database.read(data);
    return buildResponse(200, response , 'get');

  }catch( err ) { 
    colorLog( `Get Product Type error : ${JSON.stringify( err )}`,'red' , 'reset');
    return buildResponse(500, err , 'get');

  }


}

export async function postProductType({ data ,schema}) {
  try{ 
    const database = new DatabaseOperations( tableName , schema);
    const newRegister = validateData( data , model);
    if( Object.keys( newRegister ).length === 0 ) 
      return buildResponse( 400, {message : 'Miising required fields or not valid'}, 'post');

    const response  = await database.create(newRegister , keyField);
    return buildResponse ( 200 ,response , 'post' , keyField , data);
  }catch( err ) { 
    colorLog( `PRODUCT TYPES ERROR : ${JSON.stringify( err )}`, 'red' , 'reset');
    return buildResponse( 500, err , 'post');
  }


}

export async function putProductType({ id , data , schema}) {
  try { 
    const database  = new DatabaseOperations(tableName, schema);
    const update = validateData( data , model , 'put');
    
    if( Object.keys( update ).length === 0 ) 
      return buildResponse(400 , {message : 'Missing fields to update'}, 'put');


    if(!id)
        return buildResponse(400 , {message : 'Missing the record id to update'} , 'put');

    const where = { 
      [keyField] : id
    }

    const response = await database.update( update , where);
    return buildResponse( 200 , response , 'put');

  }catch ( error ) { 
    colorLog(`PUT ProductType error : ${JSON.stringify( error )}`, 'red' , 'reset');
    return buildResponse( 500, err , 'put');
  }

}

export async function deleteProductType({ id, schema}) {
  try { 
    const database = new DatabaseOperations( tableName , schema);

    if(!id) 
      return buildResponse(400, {message : 'Missing the record id to delete'}, 'delete');


    await data.delete(id , keyField);
    return buildResponse(200, { message : 'Record deleted'}, 'delete');
  }catch ( err ) { 
     colorLog( `Delete ProductType error :  ${JSON.stringify(err)}`, 'red' , 'reset');
     return buildResponse( 500 , err , 'delete');
  }



}
