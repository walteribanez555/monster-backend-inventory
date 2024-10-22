import { DatabaseOperations, executeMysql } from "../utils/database.mjs";
import { buildResponse, validateData, colorLog } from "../utils/helpers.mjs";

const tableName = "inputs";
const keyField = "input_id";

const queryParams = ["id", "init", "end", "product_id", "warehouse_id", "product_type_id"];

const model = {
  // product_id: "number",
  provider_id: "number",
  quantity: "number",
  detail: "string",
};

export async function getInput({ id, init, end, product_id , warehouse_id, limit, offset , product_type_id , schema}) {
  let response;
  
  try{
    const database = new DatabaseOperations("InputProductDetails", schema);
    const data = {
      where: {
        [keyField]: id,
        [queryParams[3]]: product_id,
        [queryParams[4]]: warehouse_id,
        [queryParams[5]]: product_type_id,
      },
      init,
      end,
      limit,
      offset,
    };
    
    const queryResponse = await database.read(data);

    response = [undefined, queryResponse]; 

    return response;
  }catch( error ){
    colorLog(` GET INPUT ERROR : ${JSON.stringify(error)}`, 'red', 'reset');

    response = [{status : 500, message : ` GET INPUT ERROR : ${JSON.stringify(error)}`}, undefined];
  }

  return response;


}

export async function postInput({data , schema}) {

  let response;
try {
  const database = new DatabaseOperations(tableName, schema);
  const newRegister = validateData(data, model);

  // Check if the product exists in the products table and warehouse_id
  const sql = `select * from products where product_type_id = ${data.product_type_id} and warehouse_id = ${data.warehouse_id}`;
  const product = await executeMysql(sql, schema);

  // Get the actual date with hour and minutes format string to save on db
  const actualDate = new Date().toISOString();

  if (product.length === 0) {
    // Create the product if it doesn't exist and set the product_id
    const sqlInsertProduct = `insert into products (product_id, warehouse_id, price, discount, quantity, date_created, product_type_id)
      values (null, ${data.warehouse_id}, 0, 0, ${data.quantity}, '${actualDate}', ${data.product_type_id})`;

    const queryResponse = await executeMysql(sqlInsertProduct, schema);
    console.log('Insert Query Response:', queryResponse);

    // Check if insertId is available
    if (queryResponse && queryResponse.insertId) {
      newRegister.product_id = queryResponse.insertId;
    } else {
      throw new Error('Product insertion failed, insertId not found.');
    }
  } else {
    newRegister.product_id = product[0].product_id;
    const updatedQuantity = parseFloat(product[0].quantity) + parseFloat(data.quantity);
    const sqlUpdate = `update products set quantity = ${updatedQuantity} where product_id = ${product[0].product_id}`;
    await executeMysql(sqlUpdate, schema);
  }

  // Insert the input with the quantity
  newRegister.date_created = actualDate;

  const queryResponseCreate = await database.create(newRegister, keyField);

  data.date_created = actualDate;
  data.provider_id = newRegister.provider_id;
  data.product_id = newRegister.product_id;

  response = [undefined, { queryResponseCreate, keyField, dataResponse: data }];

} catch (error) {
  colorLog(`INPUTS SERVICES ERROR: ${JSON.stringify(error)}`, `red`, 'reset');
  response = [{ status: 500 ,   message : `INPUTS SERVICES ERROR: ${JSON.stringify(error)}`}, undefined];
}

return response;

}

export async function putInput({id, data ,schema}) {
  let response;
  try { 
    const database = new DatabaseOperations(tableName , schema);
    const update = validateData(data, model, 'put');

    if(Object.keys( update ).length===0) {
      response = [{status : 400, message : 'Missing Fields to Update'}, undefined];
      return response;
    }
      // return buildResponse(400, {message : 'Missing fields to update'}, 'put');
      

    if(!id) {
      response = [{status : 400, message : 'Missing the record id to Update'}, undefined];
      return response;
    }
    
      // return buildResponse(400, {message : 'Missing the record id to update'}, 'put');


    const where = { 
      [keyField] : id
    }

    const queryResponse = await database.update(update, where);
    // return buildResponse(200, response, 'put');
    response = [undefined, queryResponse];
    

  }catch ( error ) { 
    colorLog(`PUT INPUT ERROR : ${JSON.stringify( error )}`, 'red', 'reset');
    // return buildResponse(500 , error , 'put');
    response = [{status : 500, message: `PUT INPUT ERROR : ${JSON.stringify( error )}`}, undefined];
  }
  

  return response;
}

export async function deleteInput({id ,schema}) {

  let response;
  try { 
    const database = new DatabaseOperations( tableName , schema);

    if(!id) {
      response = [{ status : 400, message : 'Missing the record id to delete'}, undefined];
      return response;
    }
      // return buildResponse(400, {message : ' Missing the record id to delete'}, 'delete');
    await database.delete(id, keyField);
    // return buildResponse(200, {message : 'Record deleted'} , 'delete');
    response = [undefined, 'Record deleted'];
  }catch( error) {
    colorLog(` DELETE INPUT ERROR : ${ JSON.stringify( error ) }`, 'red', 'reset');
    // return buildResponse(500, error, 'delete');
    response = [{status: 500, message : ` DELETE INPUT ERROR : ${ JSON.stringify( error ) }`}, undefined];
  }
  return response;
}
