import { DatabaseOperations } from "../utils/database.mjs";
import { buildResponse, validateData, colorLog } from "../utils/helpers.mjs";

const tableName = "outputs";
const idField = "output_id";
const keyField = "output_id";

const model = {
  product_id: "number",
  quantity: "number",
  date_created: "number",
  detail: "string",
};

export async function getOutput({ id, schema }) {
  try {
    const database = new DatabaseOperations(tableName, schema);
    const data = {
      where: {
        [keyField]: id,
      },
    };

    const response = await database.read(data);
    return buildResponse(200, response, "get");
  } catch (error) {
    colorLog(`Get Output error : ${JSON.stringify(error)} `, "red", "reset");
    return buildResponse(500, error, "get");
  }
}

export async function postOutput({ data, schema }) {
  try {
    const database = new DatabaseOperations(tableName, schema);
    const newRegister = validateData(data, model);
    if (Object.keys(newRegister).length === 0)
      return buildResponse(
        400,
        { message: "Miising required fields or not valid" },
        "post"
      );
    const response = await database.create(newRegister, keyField);
    return buildResponse(200, response, "post", keyField, data);
  } catch (err) {
    colorLog(`POST SERVICES ERROR : ${JSON.stringify(err)}`, "red", "reset");
    return buildResponse(500, err, "post");
  }
}

export async function putOutput({ id, data, schema }) {
  try {
    const database = new DatabaseOperations(tableName, schema);
    const update = validateData(data, model, "put");

    if (Object.keys(update).length === 0)
      return buildResponse(400, { message: "Missing fields to update" }, "put");

    if (!id)
      return buildResponse(
        400,
        { message: "Miising the record id to update" },
        "put"
      );

    const where = {
      [keyField]: id,
    };

    const response = await database.update(update, where);
    return buildResponse(200, response, "put");
  } catch (err) {
    colorLog(`Put Output error : ${JSON.stringify(err)}`, "red", "reset");
    return buildResponse(500, err, "put");
  }
}

export async function deleteOutput({ id, schema }) {
  try {
    const database = new DatabaseOperations(tableName, schema);

    if (!id)
      return buildResponse(400, { message: "Missing the record id to delete" });
    await database.delete(id, keyField);
    return buildResponse(200, { message: "Record deleted" }, "delete");
  } catch (err) {
    colorLog(`Delete Output error : ${JSON.stringify(err)}`, "red", "reset");

    return buildResponse(500, err, "delete");
  }
}
