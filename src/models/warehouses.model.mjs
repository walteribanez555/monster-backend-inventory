import { DatabaseOperations } from "../utils/database.mjs";
import { buildResponse, validateData, colorLog } from "../utils/helpers.mjs";

const tableName = "warehouses";
const idField = "warehouse_id";
const keyField = "warehouse_id";

const model = {
  name: "string",
  status: "number",
};

export async function getWarehouse({ id, schema }) {
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
    colorLog(`Get Warehouse Error : ${JSON.stringify(err)}`, "red", "reset");
    return buildResponse(500, err, "get");
  }
}

export async function postWarehouse({ data, schema }) {
  try {
    const database = new DatabaseOperations(tableName, schema);

    const newRegister = validateData(data, model);
    if (Object.keys(newRegister).length === 0)
      return buildResponse(400, {
        message: "Missing required fields or not valid",
      });

    const response = await database.create(newRegister, keyField);
    return buildResponse(200, response, "post", keyField, data);
  } catch (err) {
    colorLog(
      `Warehouses services error : ${JSON.stringify(err)}`,
      "red",
      "reset"
    );
    return buildResponse(500, err, "post");
  }
}

export async function putWarehouse({ id, data, schema }) {
  try {
    const database = new DatabaseOperations(tableName, schema);
    const update = validateData(data, model, "put");

    if (Object.keys(update).length === 0)
      return buildResponse(400, { message: "Missing fields to update" }, "put");

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
    colorLog(` PUT WAREHOUSE ERROR  : ${JSON.stringify(err)}`, "red", "reset");
    return buildResponse(500, err, "put");
  }
}

export async function deleteWarehouse({ id, schema }) {
  try {
    const database = new DatabaseOperations(tableName, schema);

    if (!id)
      return buildResponse(400, { message: "Missing the record id to delete" });

    await database.delete(id, keyField);
    return buildResponse(200, { message: "Record Deleted" }, "delete");
  } catch (err) {
    colorLog(`DELETE WAREHOUSE ERROR : ${JSON.stringify(err)}`, "red", "reset");
    return buildResponse(500, err, "delete");
  }
}
