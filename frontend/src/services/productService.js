const API_URL =
  `${import.meta.env.VITE_API_URL}/api/products`;


// ==============================
// AUTH HEADERS
// ==============================

function getAuthHeaders() {

  const token =
    localStorage.getItem(
      "shopzoneToken"
    );

  return {
    "Content-Type": "application/json",

    Authorization:
      `Bearer ${token}`,
  };
}


// ==============================
// GET ALL PRODUCTS
// ==============================

export async function getProducts() {

  const response = await fetch(
    API_URL
  );

  if (!response.ok) {

    throw new Error(
      "Failed to fetch products"
    );
  }

  return response.json();
}


// ==============================
// GET PRODUCT BY ID
// ==============================

export async function getProductById(
  id
) {

  const response = await fetch(
    `${API_URL}/${id}`
  );

  if (!response.ok) {

    throw new Error(
      "Product not found"
    );
  }

  return response.json();
}


// ==============================
// CREATE PRODUCT
// ==============================

export async function createProduct(
  product
) {

  const response = await fetch(
    API_URL,
    {
      method: "POST",

      headers: getAuthHeaders(),

      body: JSON.stringify(product),
    }
  );

  if (!response.ok) {

    throw new Error(
      "Failed to create product"
    );
  }

  return response.json();
}


// ==============================
// UPDATE PRODUCT
// ==============================

export async function updateProduct(
  id,
  product
) {

  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PUT",

      headers: getAuthHeaders(),

      body: JSON.stringify(product),
    }
  );

  if (!response.ok) {

    throw new Error(
      "Failed to update product"
    );
  }

  return response.json();
}


// ==============================
// DELETE PRODUCT
// ==============================

export async function deleteProduct(
  id
) {

  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",

      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {

    throw new Error(
      "Failed to delete product"
    );
  }
}