import { DatabaseOperations, executeMysql } from "../utils/database.mjs";
import { buildResponse, validateData, colorLog } from "../utils/helpers.mjs";

const tableName = "inputs";
const idField = "input_id";
const keyField = "input_id";

const model = {
  product_id: "number",
  provider_id: "number",
  quantity: "number",
  date_created: "number",
  detail: "string",
};

export async function getInput({ id , schema}) {
  try{
    const database = new DatabaseOperations(tableName, schema);
    const data = { 
      where : {
        [keyField] : id
      }
    }
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
    const newRegister = validateData( data , model);


    const sql = `select * from products where product_type_id = ${data.product_id}`;
    const product = await executeMysql(sql,schema);

    // product_id : "number",
    // warehouse_id: "number",
    // price: "string",
    // discount: "number",
    // quantity : "number",
    // date_created: "string",
    // product_type_id: "number",

    const actualDate = new Date();

    if(product.length === 0){
      //Create the product if it doesn't exist and the product_id is autoincremented set the product id as product_type_id, get the product_id and set to new Register 
      const sqlInsertProduct = `insert into products (product_id, warehouse_id, price, discount, quantity, date_created, product_type_id) values (null, 1, 0, 0, ${data.quantity}, ${actualDate.getTime()}, ${data.product_id})`;

      const response = await executeMysql(sqlInsertProduct, schema);
      newRegister.product_id = response.insertId;
      
      
    }else { 
      //Update product with the quantity on input
      const sqlUpdate = `update products set quantity = ${product[0].quantity + data.quantity} where product_id = ${data.product_id}`;
      await executeMysql(sqlUpdate, schema);
    }

    //Insert the input with the quantity
    const response = await database.create(newRegister, keyField);

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
