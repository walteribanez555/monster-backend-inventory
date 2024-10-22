import { DatabaseOperations, executeMysql } from "../utils/database.mjs";
import { buildResponse, validateData, colorLog } from "../utils/helpers.mjs";

const tableName = "outputs";
const idField = "output_id";
const keyField = "output_id";

const queryParams = [
  "id",
  "init",
  "end",
  "product_id",
  "warehouse_id",
  "product_type_id",
];

const model = {
  quantity: "number",
  detail: "string",
};

export async function getOutput({
  id,
  schema,
  init,
  end,
  product_id,
  warehouse_id,
  limit,
  offset,
  product_type_id,
}) {
  let response;

  try {
    const database = new DatabaseOperations("OutputProductDetails", schema);
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

    const queryReponse = await database.read(data);
    response = [undefined, queryReponse];
  } catch (error) {
    colorLog(`Get Output error : ${JSON.stringify(error)} `, "red", "reset");
    // return buildResponse(500, error, "get");
    response = [{ status: 500, message: error }, undefined];
  }
  return response;
}

export async function postOutput({ data, schema }) {
  let response;
  try {
    const database = new DatabaseOperations(tableName, schema);
    const newRegister = validateData(data, model);

    const sql = `select * from products where product_type_id = ${data.product_type_id} and warehouse_id = ${data.warehouse_id}`;
    const product = await executeMysql(sql, schema);

    if (product.length === 0) {
      // return buildResponse(400, { message: "Product not found" }, "post");
      response = [{ status: 400, message: "Product not found" }, undefined];
      return response;
    }

    if (product[0].quantity < data.quantity) {
      // return buildResponse(400, { message: "Not enough quantity in stock" }, "post");
      response = [
        { status: 400, message: "Missing the record id to Update" },
        undefined,
      ];
      return response;
    }

    const sqlUpdate = `update products set quantity = ${
      product[0].quantity - data.quantity
    } where product_id = ${product[0].product_id}`;
    await executeMysql(sqlUpdate, schema);

    newRegister.product_id = product[0].product_id;
    data.product_id = product[0].product_id;
    data.product_type_id = product[0].product_type_id;

    const actualDate = new Date().toISOString();
    newRegister.date_created = actualDate;

    data.date_created = actualDate;

    const queryResponse = await database.create(newRegister, keyField);

    response = [undefined, { queryResponse, keyField, dataResponse: data }];

    // return buildResponse(200, response, "post", keyField, data);
  } catch (err) {
    colorLog(`POST SERVICES ERROR : ${JSON.stringify(err)}`, "red", "reset");
    // return buildResponse(500, err, "post");
    response = [{ status: 500, message: err }, undefined];
  }

  return response;
}

export async function putOutput({ id, data, schema }) {
  let response;

  try {
    const database = new DatabaseOperations(tableName, schema);
    const update = validateData(data, model, "put");

    if (Object.keys(update).length === 0)
      return buildResponse(400, { message: "Missing fields to update" }, "put");

    if (!id) {
      response = [
        { status: 400, message: "Missing the record id to update" },
        undefined,
      ];

      return response;
    }
    // return buildResponse(
    //   400,
    //   { message: "Miising the record id to update" },
    //   "put"
    // );

    const where = {
      [keyField]: id,
    };

    const queryResponse = await database.update(update, where);
    // return buildResponse(200, response, "put");
    response = [undefined, queryResponse];


  } catch (err) {
    colorLog(`Put Output error : ${JSON.stringify(err)}`, "red", "reset");
    // return buildResponse(500, err, "put");
    response = [{status: 500, message: err}, undefined];
  }
  return response;
}

export async function deleteOutput({ id, schema }) {
  let response;
  try {
    const database = new DatabaseOperations(tableName, schema);

    if (!id){
      response = [{status:400, message: 'Missing the record id to delete'}, undefined];
      return response;
    }
      // return buildResponse(400, { message: "Missing the record id to delete" });
    await database.delete(id, keyField);
    response = [undefined, "Record deleted"];
    // return buildResponse(200, { message: "Record deleted" }, "delete");
  } catch (err) {
    colorLog(`Delete Output error : ${JSON.stringify(err)}`, "red", "reset");

    response = [{status:500, message : err}, undefined];
    // return buildResponse(500, err, "delete");
  }

  return response;
}
