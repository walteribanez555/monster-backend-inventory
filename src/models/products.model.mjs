import { DatabaseOperations } from "../utils/database.mjs";
import { buildResponse, validateData, colorLog } from "../utils/helpers.mjs";

const tableName = "products";
const idField = "product_id";
const keyField = "product_id";

const queryParams = ["id","init", "end", "warehouse_id"];

const model = {
  warehouse_id: "number",
  price: "string",
  discount: "number",
  quantity : "number",
  date_created: "string",
  product_type_id: "number",
};

export async function getProduct({ id,init, end, warehouse_id, limit, offset, schema }) {
  let response;
  try {
    const database = new DatabaseOperations(tableName, schema);
    const data = {
      where: {
        [keyField]: id,
        [queryParams[3]]: warehouse_id,
      },
      init,
      end,
      limit,
      offset
    };

    const queryResponse = await database.read(data);
    response = [undefined, {queryResponse ,data}];
    // return buildResponse(200, response, "get");
  } catch (err) {
    colorLog(`Get Producst error : ${JSON.stringify(err)}`, "red", "reset");
    response = [{status: 500, message : err}, undefined];
    // return buildResponse(500, err, "get");
  }
  return response;
}

export async function postProduct({ data, schema }) {
  let response;
  try {
    const database = new DatabaseOperations(tableName, schema);
    const newRegister = validateData(data, model);

    if (Object.keys(newRegister).length === 0){
      response = [{status: 400, message: 'Missing required fields or not valid'}, undefined];
      return response;
    }
      

    const queryResponse = await database.create(newRegister, keyField);

    // return buildResponse(200, response, "post", keyField, data);
    response = [undefined, {queryResponse, keyField, data}];
  } catch (error) {
    colorLog(
      `Product service error : ${JSON.stringify(error)}`,
      "red",
      "reset"
    );
    response = [{status:500, message : error}, undefined];
    // return buildResponse(500, error, "post");
  }
  return response;
}

export async function putProduct({ id, data, schema }) {
  let response;
  try {
    const database = new DatabaseOperations(tableName, schema);
    const update = validateData(data, model, "put");
    if (Object.keys(update).length === 0){
      response = [{status: 400, message: "Missing Fields to Update"}, undefined];
      return response;
    }

    if (!id){
      response = [{status:400, message : "Missing the record id to update"}, undefined];
      return response;
    }


    const where = {
      [keyField]: id,
    };
    const queryResponse = await database.update(update, where);
    response = [undefined, queryResponse, "put"];
    // return buildResponse(200, response, "put");
  } catch (err) {
    colorLog(` PUT PRODUCT ERROR : ${JSON.stringify(err)}`, "red", "reset");
    // return buildResponse(500, err, "put");
    response =[{status:500, message : err}, undefined];
  }
  return response;
}

export async function deleteProduct({ id, schema }) {
  let response;
  try {
    const database = new DatabaseOperations(tableName, schema);

    if (!id){
      response = [{status:400, message : "Missing the record id to delete"}, undefined];
      return response;
    }

    await database.delete(id, keyField);
    response = [undefined, "Record Deleted"];
  } catch (err) {
    colorLog(`Delete Product error : ${JSON.stringify(err)}`, "red", "reset");
    response = [{status:500, message : err}, undefined];
  }
  return response;
}
