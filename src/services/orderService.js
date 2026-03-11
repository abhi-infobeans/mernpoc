// Order Service - handles order-related API calls

const API_BASE_URL = "http://localhost:5000";

export async function createOrder(orderData, token) {
  if (!token) {
    throw new Error("Authentication token required");
  }

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      throw new Error(data.message || `Failed to create order: ${response.status}`);
    } else {
      throw new Error(`Server error: ${response.status}. Orders table may not exist in database.`);
    }
  }

  const data = await response.json();
  return data;
}

export async function getOrders(token) {
  if (!token) {
    throw new Error("Authentication token required");
  }

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      throw new Error(data.message || `Failed to fetch orders: ${response.status}`);
    } else {
      throw new Error(`Server error: ${response.status}. Orders table may not exist in database.`);
    }
  }

  const data = await response.json();
  return data;
}

export async function getOrderById(orderId, token) {
  if (!token) {
    throw new Error("Authentication token required");
  }

  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      throw new Error(data.message || `Failed to fetch order: ${response.status}`);
    } else {
      throw new Error(`Server error: ${response.status}`);
    }
  }

  const data = await response.json();
  return data;
}

export async function updateOrderStatus(orderId, status, token) {
  if (!token) {
    throw new Error("Authentication token required");
  }

  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      throw new Error(data.message || `Failed to update order: ${response.status}`);
    } else {
      throw new Error(`Server error: ${response.status}`);
    }
  }

  const data = await response.json();
  return data;
}
