import {
  deleteInput,
  getInput,
  postInput,
  putInput,
} from "../models/inputs.model.mjs";

export async function getInputs({ id, init, end, product_id, warehouse_id }) {
  return getInput({ id, init, end, product_id,warehouse_id,limit, offset , schema: "monster" });
}

export async function postInputs({ data }) {
  return postInput({ data, schema: "monster" });
}

export async function putInputs({ id, data }) {
  return putInput({ id, data, schema: "monster" });
}

export async function deleteInputs({ id }) {
  return deleteInput({ id, schema: "monster" });
}
