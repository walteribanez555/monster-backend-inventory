import {
  deleteProduct,
  getProduct,
  postProduct,
  putProduct,
} from "../models/products.model.mjs";

export async function getProducts({ id }) {
  return getProduct({ id, schema: "monster" });
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
