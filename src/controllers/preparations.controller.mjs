import { getPreparations, postPreparation } from '../models/preparations.model.mjs';
import { buildResponse } from '../utils/helpers.mjs';

export async function getPreparations({
  id,
  init,
  end,
  product_id,
  warehouse_id,
  limit,
  offset,
}) {

  const [err, response] = await getPreparations({
    id,
    init,
    end,
    product_id,
    warehouse_id,
    limit,
    offset,
    schema: "monster",
  });

  if(err) return buildResponse(err.status, err.message , "get");

  return buildResponse(200,response, "get");
}

export async function postPreparations({ data }) {
  const [err, {queryResponse, keyField, dataResponse}] = await postPreparation({
    data,
    schema : "monster",
  });

  if (err) return buildResponse(err.status, err.message, "post");


  return buildResponse(200, queryResponse, )


}

export async function putPreparations({ id, data }) {}

export async function deletePreparations({ id }) {}
