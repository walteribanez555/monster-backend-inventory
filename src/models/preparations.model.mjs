import { DatabaseOperations, executeMysql } from "../utils/database.mjs";
import { buildResponse, colorLog, validateData } from "../utils/helpers.mjs";
import { postOutput } from './outputs.model.mjs';



const tableName = "preparations";
const keyField = "preparation_id";

const queryParams = [
  "id",
  "init",
  "end",
  "product_id",
  "warehouse_id",
  "product_type_id",
];

const model = {
  // product_id: "number",
  // provider_id: "number",
  // quantity: "number",
  // detail: "string",
  'product_id': 'number',
  'status' : 'number',
  'description' : 'number',
  'created_at' : 'string',
  
};

export async function getPreparation({
  id,
  init,
  end,
  product_id,
  warehouse_id,
  limit,
  offset,
  product_type_id,
  schema,
}) {
  let response;

  const database = new DatabaseOperations("");

  try {
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
  } catch (err) {
    colorLog(`Get Output error : ${JSON.stringify(err)}`, "red", "reset");
    response = [{ status: 500, message: err }, undefined];
  }

  return response;
}

export async function postPreparation({ data, schema }) {
  let response;

  try{

    const database = new DatabaseOperations(tableName,schema);
    const newRegister = validateData(data, model);


    const items = data.items;


    const sql = `select * from products where warehouse_id = ${data.warehouse_id}`;
    const warehouseProducts = await executeMysql(sql,schema);

    if( Object.keys( newRegister ).length === 0 ) {
      response = [{status: 400, message: 'Missing required fields or not valid data'},undefined];
      return response;
    }



    // const thereIsProducts = items.every( i => warehouseProducts.some( product => product.product_id == i.product_id) );

    const products = items.map( i => i => warehouseProducts.find( product => product.product_id == i.product_id ));


    if(!products.every(p => p)) {
      response = [{status: 400, message: 'Products Not Found'}, undefined];
      return response;
    }


    if( !products.every((p, index)=> p.quantity >=  i[index].quantity)){
      response = [{status: 400, message :'Not Enought Quantity on Warehouse'}, undefined];
      return response;
    }



    const responseQuery = await database.create(newRegister, keyField);

    products.forEach( async (product, index) => {

      const [err, result] = await postOutput({ data : { 
        product_type_id : product.product_type_id,
        quantity : items[index].quantity,
        detail : `PROD-${responseQuery}`
       }, schema  });

      if(err) { 
        throw err;
      } 
    }); 

   
    let response = [undefined, {responseQuery, dataResponse : data, keyField}];

  }catch( err) { 

    colorLog(`POST SERVICES ERROR : ${JSON.stringify(err)}`, "red", "reset");
    response = [{status: 500, message: err}, undefined];

  }

  return response;




}

export async function putPreparation({ id, data, schema }) {}

export async function deletePreparation({ id, schema }) {}
