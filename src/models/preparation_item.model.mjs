import { DatabaseOperations, executeMysql } from "../utils/database.mjs";
import { buildResponse, colorLog, validateData } from "../utils/helpers.mjs";

const tableName = "preparation_item";
const keyField = "preparation_item_id";

const queryParams = ["preparation_id"];

const model = {
  // product_id: "number",
  product_id: "number",
  quantity: "number",
};

export async function getPreparationItem({ id, schema }) {
  let response;

  const database = new DatabaseOperations(tableName, schema);

  try {
    const data = {
      where: {
        [queryParams[0]]: id,
      },
    };

    const queryResponse = await database.read(data);
    response = [undefined, queryResponse];
  } catch (err) {
    colorLog(
      `Get Preparation Item error : ${JSON.stringify(err)}`,
      "red",
      "reset"
    );
    response = [{ status: 500, message: err }, undefined];
  }

  return response;
}

export async function postPreparationItem({ data, schema }) {
  let response;

  try {
    const database = new DatabaseOperations(tableName, schema);
    const newRegister = validateData(data, model);

    if (Object.keys(newRegister).length === 0) {
      response = [
        { status: 400, message: "Missing required fields or not valid" },
        undefined,
      ];
      return response;
    }

    const queryResponse = await database.create(newRegister, keyField);

    response = [undefined, { queryResponse, keyField, data }];
  } catch (err) {
    colorLog(
      `POST PREPARATION_ITEM ERROR : ${JSON.stringify(err)}`,
      "red",
      "reset"
    );
    response = [
      { status: 500, message: ` GET INPUT ERROR : ${JSON.stringify(error)}` },
      undefined,
    ];
  }
  return response;
}

export async function putPreparationItem({ id, data, schema }) {}

export async function deletePreparationItem({ id, schema }) {}
