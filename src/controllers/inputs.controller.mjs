import {
  deleteInput,
  getInput,
  postInput,
  putInput,
} from "../models/inputs.model.mjs";

export async function getInputs({ id }) {
  return getInput({ id, schema: "redcard" });
}

export async function postInputs({ data }) {
  return postInput({ data, schema: "redcard" });
}

export async function putInputs({ id, data }) {
  return putInput({ id, data, schema: "redcard" });
}

export async function deleteInputs({ id }) {
  return deleteInput({ id, schema: "redcard" });
}
