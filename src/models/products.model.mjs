import { DatabaseOperations } from "../utils/database.mjs";
import { buildResponse, validateData, colorLog } from "../utils/helpers.mjs";

const tableName = "products";
const idField = "product_id";
const keyField = "product_id";

const model = {
  warehouse_id: "number",
  price: "string",
  discount: "number",
  quantity : "number",
  date_created: "string",
  product_type_id: "number",
};

export async function getProduct({ id, schema }) {
  try {
    const database = new DatabaseOperations(tableName, schema);
    const data = {
      where: {
        [keyField]: id,
      },
    };

    const response = await database.read(data);
    return buildResponse(200, response, "get");
  } catch (err) {
    colorLog(`Get Producst error : ${JSON.stringify(err)}`, "red", "reset");
    return buildResponse(500, err, "get");
  }
}

export async function postProduct({ data, schema }) {
  try {
    const database = new DatabaseOperations(tableName, schema);
    const newRegister = validateData(data, model);

    if (Object.keys(newRegister).length === 0)
      return buildResponse(
        400,
        { message: "Missing required fields or not valid" },
        "post"
      );

    const response = await database.create(newRegister, keyField);

    return buildResponse(200, response, "post", keyField, data);
  } catch (error) {
    colorLog(
      `Product service error : ${JSON.stringify(error)}`,
      "red",
      "reset"
    );
    return buildResponse(500, error, "post");
  }
}

export async function putProduct({ id, data, schema }) {
  try {
    const database = new DatabaseOperations(tableName, schema);
    const update = validateData(data, model, "put");
    if (Object.keys(update).length === 0)
      return buildResponse(400, { message: "Missing Fields to update" }, "put");

    if (!id)
      return buildResponse(
        400,
        { message: "Missing the record id to update" },
        "put"
      );

    const where = {
      [keyField]: id,
    };
    const response = await database.update(update, where);
    return buildResponse(200, response, "put");
  } catch (err) {
    colorLog(` PUT PRODUCT ERROR : ${JSON.stringify(err)}`, "red", "reset");
    return buildResponse(500, err, "put");
  }
}

export async function deleteProduct({ id, schema }) {
  try {
    const database = new DatabaseOperations(tableName, schema);

    if (!id)
      return buildResponse(
        400,
        { message: "Missing the record id to delete" },
        "delete"
      );

    await database.delete(id, keyField);
    return buildResponse(200, { message: "Record Deleted" }, "delete");
  } catch (err) {
    colorLog(`Delete Product error : ${JSON.stringify(err)}`, "red", "reset");
    return buildResponse(500, err, "delete");
  }
}
