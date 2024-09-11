import { DatabaseOperations } from "../utils/database.mjs";
import { buildResponse, validateData, colorLog } from "../utils/helpers.mjs";

const tableName = "providers";
const idField = "provider_id";
const keyField = "provider_id";

const model = {
  name: "string",
  phone: "string",
  email: "string",
  address: "string",
  status: "string",
};

export async function getProvider({ id, schema }) {
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
    colorLog(`GET PROVIDER ERROR : ${JSON.stringify(err)}`, "red", "reset");
    return buildResponse(500, err, "get");
  }
}

export async function postProvider({ data, schema }) {
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
  } catch (err) {
    colorLog(`Provider service error : ${JSON.stringify(err)}`, "red", "reset");
    return buildResponse(500, err, "post");
  }
}

export async function putProvider({ id, data, schema }) {
  try {
    const database = new DatabaseOperations(tableName, schema);
    const update = validateData(data, model, "put");

    if (Object.keys(update) === 0)
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
    colorLog(`PUT PROVIDER ERROR : ${JSON.stringify(err)}`, "red", "reset");
    return buildResponse(500, err, "put");
  }
}

export async function deleteProvider({ id, schema }) {
  try {
    const database = new DatabaseOperations(tableName, schema);

    if (!id)
      return buildResponse(
        400,
        { message: "Missing the record id to delete" },
        "delete"
      );

    await database.delete(id, keyField);
    return buildResponse(200, { message: "Record deleted" }, "delete");
  } catch (err) {
    colorLog(`Delete provider error : ${JSON.stringify(err)}`, "red", "reset");
    return buildResponse(500, err, "delete");
  }
}
