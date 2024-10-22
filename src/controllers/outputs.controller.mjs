import { putInput } from "../models/inputs.model.mjs";
import {
  deleteOutput,
  getOutput,
  postOutput,
  putOutput,
} from "../models/outputs.model.mjs";
import { buildResponse } from "../utils/helpers.mjs";

export async function getOutputs({
  id,
  init,
  end,
  product_id,
  warehouse_id,
  limit,
  offset,
  product_type_id,
}) {
  // return getOutput({id,init, end, product_id, warehouse_id, limit , offset, product_type_id, schema : 'monster'});

  const [err, response] = await getOutput({
    id,
    init,
    end,
    product_id,
    warehouse_id,
    limit,
    offset,
    product_type_id,
    schema: "monster",
  });

  if (err) return buildResponse(err.status, err.message, "get");

  return buildResponse(200, response, "get");
}

export async function postOutputs({ data }) {
  //   return postOutput({ data, schema: "monster" });
  const [err, { queryResponse, keyField, dataResponse }] = await postOutput({
    data,
    schema: "monster",
  });

  if (err) return buildResponse(err.status, err.message, "post");

  return buildResponse(200, queryResponse, "post", keyField, dataResponse);
}

export async function putOutputs({ id, data }) {
  //   return putOutput({ id, data, schema: "monster" });
  const [err, result] = await putInput({ id, data, schema: "monster" });

  if (err) return buildResponse(err.status, err.message, "put");

  return buildResponse(200, result, "put");
}

export async function deleteOutputs({ id }) {
  //   return deleteOutput({ id, schema: "monster" });
  const [err, result] = await deleteOutput({ id, schema: "monster" });

  if (err) return buildResponse(err.status, err.message, "delete");
  return buildResponse(200, result, "delete");
}
