import { DatabaseOperations, executeMysql } from "../utils/database.mjs";
import { buildResponse, validateData, colorLog } from "../utils/helpers.mjs";

const tableName = "inputs";
const idField = "input_id";
const keyField = "input_id";

const queryParams = ["id", "init", "end", "product_id", "warehouse_id"];

const model = {
  // product_id: "number",
  provider_id: "number",
  quantity: "number",
  detail: "string",
};

export async function getInput({ id, init, end, product_id , warehouse_id, limit, offset , schema}) {
  try{
    const database = new DatabaseOperations("InputProductDetails", schema);
    const data = {
      where: {
        [keyField]: id,
        [queryParams[3]]: product_id,
        [queryParams[4]]: warehouse_id,
      },
      init,
      end,
      limit,
      offset,
    };
    
    const response = await database.read(data);
    return buildResponse(200, response, 'get');
  }catch( err ){
    colorLog(` GET INPUT ERROR : ${JSON.stringify(err)}`, 'red', 'reset');
    return buildResponse( 500 , err , 'get');
  }


}

export async function postInput({data , schema}) {
  try { 
    const database = new DatabaseOperations(tableName, schema);
    const newRegister = validateData(data, model);

    // Check if the product exists in the products table and warehouse_id
    const sql = `select * from products where product_type_id = ${data.product_type_id} and warehouse_id = ${data.warehouse_id}`;
    const product = await executeMysql(sql, schema);

    // Get the actual date with hour and minutes format string to save on db
    const actualDate = new Date().getTime();
    // const actualDate = new Date().toISOString();

    const gmtMinus4Offset = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

// Subtract the GMT-4 offset from the UTC time
    const gmtMinus4Date = new Date(actualDate - gmtMinus4Offset);
    
    const gmtDateTime = gmtMinus4Date.toISOString();  

    if (product.length === 0) {
      // Create the product if it doesn't exist and the product_id is autoincremented set the product id as product_type_id, get the product_id and set to new Register 
      const sqlInsertProduct = `insert into products (product_id, warehouse_id, price, discount, quantity, date_created, product_type_id) values (null, ${data.warehouse_id}, 0, 0, ${data.quantity}, '${gmtDateTime}', ${data.product_id})`;

      const response = await executeMysql(sqlInsertProduct, schema);
      newRegister.product_id = response.insertId;
    } else {
      newRegister.product_id = product[0].product_id;
      const sqlUpdate = `update products set quantity = ${product[0].quantity + data.quantity} where product_id = ${product[0].product_id}`;
      await executeMysql(sqlUpdate, schema);
    }

    // Insert the input with the quantity
    newRegister.date_created = gmtDateTime;

    const response = await database.create(newRegister, keyField);

    data.date_created = gmtDateTime;
    data.provider_id = newRegister.provider_id;
    data.product_id = newRegister.product_id;

    return buildResponse(200, response, 'post', keyField, data);



  }catch( error) { 
    colorLog(` INPUTS SERVICES ERROR : ${JSON.stringify(error)}`, `red`, 'reset');
  }
}

export async function putInput({id, data ,schema}) {
  try { 
    const database = new DatabaseOperations(tableName , schema);
    const update = validateData(data, model, 'put');

    if(Object.keys( update ).length===0) 
      return buildResponse(400, {message : 'Missing fields to update'}, 'put');

    if(!id) 
      return buildResponse(400, {message : 'Missing the record id to update'}, 'put');

    const where = { 
      [keyField] : id
    }

    const response = await database.update(update, where);
    return buildResponse(200, response, 'put');

  }catch ( error ) { 
    colorLog(`PUT INPUT ERROR : ${JSON.stringify( error )}`, 'red', 'reset');
    return buildResponse(500 , error , 'put');
  }
}

export async function deleteInput({id ,schema}) {
  try { 
    const database = new DatabaseOperations( tableName , schema);

    if(!id) 
      return buildResponse(400, {message : ' Missing the record id to delete'}, 'delete');
    await database.delete(id, keyField);
    return buildResponse(200, {message : 'Record deleted'} , 'delete');
  }catch( error) {
    colorLog(` DELETE INPUT ERROR : ${ JSON.stringify( error ) }`, 'red', 'reset');
    return buildResponse(500, error, 'delete');
  }
}
