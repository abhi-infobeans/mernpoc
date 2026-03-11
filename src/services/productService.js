const API_BASE_URL = "http://localhost:5000";

export async function getProducts(token) {
  const response = await fetch(`${API_BASE_URL}/dashboard`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch products");
  }

  return data;
}

export async function searchProducts(searchTerm, token) {
  const query = searchTerm.trim();
  if (!query) {
    return getProducts(token);
  }

  const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to search products");
  }

  return data;
}

export async function getProductById(productId, token) {
  const response = await fetch(`${API_BASE_URL}/product/${productId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch product details");
  }

  return data;
}

export async function deleteProduct(productId, token) {
  const response = await fetch(`${API_BASE_URL}/product/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete product");
  }

  return data;
}
