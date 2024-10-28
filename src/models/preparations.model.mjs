import { DatabaseOperations, executeMysql } from "../utils/database.mjs";
import { buildResponse, colorLog, dateNow, validateData } from "../utils/helpers.mjs";
import { postOutput } from './outputs.model.mjs';
import { postInput } from './inputs.model.mjs'
import { postProduct } from "./products.model.mjs";



const tableName = "preparations";
const keyField = "preparation_id";

const queryParams = [
  "id",
  "init",
  "end",
  "warehouse_id",
  "product_type_id",
  "type",
];

const model = {
  // product_id: "number",
  // provider_id: "number",
  // quantity: "number",
  // detail: "string",
  // 'product_id': 'number',
  'status' : 'number',
  'description' : 'number',
  'date_created' : 'string',
  'product_type_id' : 'number',
  'warehouse_id' : 'number',
  'quantity' : 'number',
  
};

export async function getPreparation({
  id,
  init,
  end,
  limit,
  offset,
  warehouse_id,
  product_type_id,
  type,
  schema,
}) {
  let response;

  console.log(type, "Tipo");

  const database = new DatabaseOperations("view_preparations_details", schema);

  try {
    const data = {
      where: {
        [keyField]: id,
        [queryParams[3]]: warehouse_id,
        [queryParams[4]]: product_type_id,
        [queryParams[5]]: type,
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

    const products = items.map(  i => warehouseProducts.find( product => product.product_type_id == i.product_type_id ));




    if(!products.every(p => p)) {
      response = [{status: 400, message: 'Products Not Found'}, undefined];
      return response;
    }


    if( !products.every((p, index)=> p.quantity >=  items[index].quantity)){
      response = [{status: 400, message :'Not Enought Quantity on Warehouse'}, undefined];
      return response;
    }




    const selectedProductType = warehouseProducts.find( p => p.product_type_id == data.product_type_id);
    console.log("Item",{selectedProductType})

    if(!selectedProductType){
      // const model = {
      //   warehouse_id: "number",
      //   price: "string",
      //   discount: "number",
      //   quantity : "number",
      //   date_created: "string",
      //   product_type_id: "number",
      // };


      const [err , result] = await postProduct({
        warehouse_id : data.warehouse_id,
        price : 0,
        discount : 0,
        quantity : 0,
        date_created : dateNow(),
        product_type_id  : data.product_type_id,
      }, "monster");

      if(err){
        throw err;
      }
    }




    const responseQuery = await database.create(newRegister, keyField);

    


    products.forEach( async (product, index) => {

      const [err, result] = await postOutput({ data : { 
        product_type_id : product.product_type_id,
        quantity : items[index].quantity,
        detail : `PROD-${responseQuery.insertId}`,
        warehouse_id: data.warehouse_id,
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
        detail: `PROD-${responseQuery.insertId}`,
        warehouse_id: data.warehouse_id,
        product_type_id : data.product_type_id,
       },
      schema
    });



    if(err){
      response = [{status: err.status, message: err}, undefined];
      return response;
    }



 
   
    response = [undefined, {responseQuery, dataResponse : {...data, type: data.product_type_id}, keyField}];

  }catch( err) { 

    colorLog(`POST SERVICES ERROR : ${JSON.stringify(err)}`, "red", "reset");
    response = [{status: 500, message: err}, undefined];

  }

  return response;




}

export async function putPreparation({ id, data, schema }) {}

export async function deletePreparation({ id, schema }) {}
