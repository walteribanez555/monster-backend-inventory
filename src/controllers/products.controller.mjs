import {
  deleteProduct,
  getProduct,
  postProduct,
  putProduct,
} from "../models/products.model.mjs";
import { buildResponse } from "../utils/helpers.mjs";

export async function getProducts({
  id,
  init,
  end,
  warehouse_id,
  limit,
  offset,
}) {
  // return getProduct({ id, init, end, warehouse_id, limit, offset, schema: "monster" });
  const [err, response] = await getProduct({
    id,
    init,
    end,
    warehouse_id,
    limit,
    offset,
    schema: "monster",
  });

  if (err) return buildResponse(err.status, err.message, "get");

  return buildResponse(200, response, "get");
}

export async function postProducts({ data }) {
  // return postProduct({ data, schema: "monster" });
  const [err, { queryResponse, keyField, dataResponse }] = await postProduct({
    data,
    schema: "monster",
  });

  if (err) return buildResponse(err.status, err.message, "post");

  return buildResponse(200, queryResponse, "post", keyField, dataResponse);
}

export async function putProducts({ id, data }) {
  // return putProduct({ data, id, schema: "monster" });
  const [err, result] = await putProduct({ id, data, schema: "monster" });

  if (err) return buildResponse(err.status, err.message, "put");
  return buildResponse(200, result, "put");
}

export async function deleteProducts({ id }) {
  // return deleteProduct({ id, schema: "monster" });
  const [ err, result ] = await deleteProduct({id, schema:'monster'});

  if(err) return buildResponse(err.status, err.message, "delete");

  return buildResponse(200, result, 'delete');
}
