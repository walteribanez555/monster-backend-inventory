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

  if (err) return buildResponse(err.status, err.message, "get");

  return buildResponse(200, response, 'get');
}

export async function postInputs({ data }) {
  // return postInput({ data, schema: "monster" });
  const [ err, {queryResponseCreate, keyField, dataResponse}  ] = await postInput({data , schema : "monster"});

  if(err) return  buildResponse(err.status, err.message, "post");

  return buildResponse(200, queryResponseCreate,'post', keyField, dataResponse );
}

export async function putInputs({ id, data }) {
  // return putInput({ id, data, schema: "monster" });
  const [ err, result ] = await putInput({id, data ,schema: "monster"});

  if(err) return buildResponse(err.status, err.message, "put");

  return buildResponse(200, result, 'put');
}

export async function deleteInputs({ id }) {
  // return deleteInput({ id, schema: "monster" });
  const [ err, result ] = await deleteInput({id, schema :"monster"});

  if(err) return buildResponse(err.status, err.message, "delete");

  return buildResponse(200, result,'delete');

}
