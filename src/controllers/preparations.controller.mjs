import { getPreparation, postPreparation } from '../models/preparations.model.mjs';
import { buildResponse } from '../utils/helpers.mjs';

export async function getPreparations({
  id,
  init,
  end,
  product_type_id,
  warehouse_id,
  type,
  limit,
  offset,
}) {

  const [err, response] = await getPreparation({
    id,
    init,
    end,
    warehouse_id,
    product_type_id,
    type,
    limit,
    offset,
    schema: "monster",
  });

  if(err) return buildResponse(err.status, err , "get");

  return buildResponse(200,response, "get");
}

export async function postPreparations({ data }) {
  const [err, {responseQuery, keyField, dataResponse}] = await postPreparation({
    data,
    schema : "monster",
  });

  console.log({err, others : {responseQuery, keyField, dataResponse}})

  if (err) return buildResponse(err.status, err, "post");


  return buildResponse(200, responseQuery,'post', keyField, dataResponse );


}

export async function putPreparations({ id, data }) {}

export async function deletePreparations({ id }) {}
