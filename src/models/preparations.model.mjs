import { DatabaseOperations, executeMysql } from "../utils/database.mjs";
import { buildResponse, colorLog, validateData } from "../utils/helpers.mjs";
import { postOutput } from './outputs.model.mjs';
import { postInput } from './inputs.model.mjs'



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
  // 'product_id': 'number',
  'status' : 'number',
  'description' : 'number',
  'created_at' : 'string',
  'product_type_id' : 'number',
  
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

  const database = new DatabaseOperations(tableName, schema);

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

    if( Object.keys( newRegister ).length === 0 ) {
      response = [{status: 400, message: 'Missing required fields or not valid data'},undefined];
      return response;
    }



    const items = data.items;


    const sql = `select * from products where warehouse_id = ${data.warehouse_id}`;
    const warehouseProducts = await executeMysql(sql,schema);


    
    console.log({warehouseProducts});
    



    // const thereIsProducts = items.every( i => warehouseProducts.some( product => product.product_id == i.product_id) );

    const products = items.map(  i => warehouseProducts.find( product => product.product_id == i.product_id ));


    console.log({products});


    if(!products.every(p => p)) {
      response = [{status: 400, message: 'Products Not Found'}, undefined];
      return response;
    }


    if( !products.every((p, index)=> p.quantity >=  items[index].quantity)){
      response = [{status: 400, message :'Not Enought Quantity on Warehouse'}, undefined];
      return response;
    }



    const responseQuery = await database.create(newRegister, keyField);

    console.log({responseQuery});


    products.forEach( async (product, index) => {

      const [err, result] = await postOutput({ data : { 
        product_type_id : product.product_type_id,
        quantity : items[index].quantity,
        detail : `PROD-${responseQuery}`
       }, schema  });

      if(err) { 
        console.log(err);
        throw err;
      } 
    }); 



    const [err, result] = await postInput({
      data : {
        provider_id: 5,
        quantity: data.quantity,
        detail: `PROD-${responseQuery}`,
       },
      schema
    });



    if(err){
      response = [{status: err.status, message: err}, undefined];
      return response;
    }



 
   
    let response = [undefined, {responseQuery, dataResponse : data, keyField}];

  }catch( err) { 

    colorLog(`POST SERVICES ERROR : ${JSON.stringify(err)}`, "red", "reset");
    response = [{status: 500, message: err}, undefined];

  }

  return response;




}

export async function putPreparation({ id, data, schema }) {}

export async function deletePreparation({ id, schema }) {}
