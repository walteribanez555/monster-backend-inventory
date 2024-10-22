import {
  deleteInput,
  getInput,
  postInput,
  putInput,
} from "../models/inputs.model.mjs";
import { buildResponse } from "../utils/helpers.mjs";

export async function getInputs({
  id,
  init,
  end,
  product_id,
  warehouse_id,
  limit,
  offset,
  product_type_id,
}) {
  const [err, response] = await getInput({
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

  if (err) return buildResponse(500, err, "get");

  return buildResponse(200, response, 'get');
}

export async function postInputs({ data }) {
  // return postInput({ data, schema: "monster" });
  const [ err, {queryResponse, keyField, dataResponse}  ] = await postInput({data , schema : "monster"});

  if(err) return  buildResponse(500, err, "get");


  return buildResponse(200, queryResponse,'post', keyField, dataResponse );
}

export async function putInputs({ id, data }) {
  return putInput({ id, data, schema: "monster" });
}

export async function deleteInputs({ id }) {
  return deleteInput({ id, schema: "monster" });
}
