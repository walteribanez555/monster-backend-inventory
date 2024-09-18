import {
  deleteProduct,
  getProduct,
  postProduct,
  putProduct,
} from "../models/products.model.mjs";

export async function getProducts({ id,init, end, warehouse_id, limit, offset }) {
  return getProduct({ id, init, end, warehouse_id, limit, offset, schema: "monster" });
}

export async function postProducts({ data }) {
  return postProduct({ data, schema: "monster" });
}

export async function putProducts({ id, data }) {
  return putProduct({ data, id, schema: "monster" });
}

export async function deleteProducts({ id }) {
  return deleteProduct({ id, schema: "monster" });
}
