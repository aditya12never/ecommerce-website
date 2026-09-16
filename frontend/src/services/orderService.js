const API_URL =
  `${import.meta.env.VITE_API_URL}/api/orders`;


// ==========================================
// AUTH HEADERS
// ==========================================

function getAuthHeaders() {
  const token =
    localStorage.getItem("shopzoneToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}


// ==========================================
// READ ERROR MESSAGE
// ==========================================

async function getErrorMessage(response) {

  try {
    const data = await response.json();

    if (data?.message) {
      return data.message;
    }

    if (data?.error) {
      return data.error;
    }

    if (typeof data === "string") {
      return data;
    }

  } catch {
    // Response may not contain JSON
  }

  return `Request failed with status ${response.status}`;
}


// ==========================================
// GET ALL ORDERS
// ADMIN
// ==========================================

export async function getOrders() {

  const response = await fetch(
    API_URL,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response)
    );
  }

  return response.json();
}


// ==========================================
// GET MY ORDERS
// USER / ADMIN
// ==========================================

export async function getMyOrders() {

  const response = await fetch(
    `${API_URL}/my-orders`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response)
    );
  }

  return response.json();
}


// ==========================================
// GET ORDER BY ID
// ==========================================

export async function getOrderById(id) {

  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response)
    );
  }

  return response.json();
}


// ==========================================
// CREATE ORDER
// ==========================================

export async function createOrder(order) {

  const response = await fetch(
    API_URL,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(order),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response)
    );
  }

  return response.json();
}


// ==========================================
// UPDATE ORDER STATUS
// ADMIN
// ==========================================

export async function updateOrderStatus(
  id,
  status
) {

  const response = await fetch(
    `${API_URL}/${id}/status`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        status,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response)
    );
  }

  return response.json();
}


// ==========================================
// CANCEL ORDER
// USER / OWNER
// ==========================================

export async function cancelOrder(id) {

  const response = await fetch(
    `${API_URL}/${id}/cancel`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response)
    );
  }

  return response.json();
}


// ==========================================
// DELETE ORDER
// ==========================================

export async function deleteOrder(id) {

  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response)
    );
  }
}