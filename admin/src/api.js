const BASE = '';

function authHeader(token) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export async function login(username, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Λάθος στοιχεία σύνδεσης');
  return res.json(); // { token }
}

export async function getPlaces() {
  const res = await fetch(`${BASE}/api/places`);
  if (!res.ok) throw new Error('Failed to fetch places');
  return res.json();
}

export async function getPlace(id) {
  const res = await fetch(`${BASE}/api/places/${id}`);
  if (!res.ok) throw new Error('Failed to fetch place');
  return res.json();
}

export async function createPlace(token, data) {
  const res = await fetch(`${BASE}/api/places`, {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to create place');
  return res.json();
}

export async function updatePlace(token, id, data) {
  const res = await fetch(`${BASE}/api/places/${id}`, {
    method: 'PUT',
    headers: authHeader(token),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to update place');
  return res.json();
}

export async function deletePlace(token, id) {
  const res = await fetch(`${BASE}/api/places/${id}`, {
    method: 'DELETE',
    headers: authHeader(token)
  });
  if (!res.ok) throw new Error('Failed to delete place');
}

export async function createTradition(token, placeId, data) {
  const res = await fetch(`${BASE}/api/places/${placeId}/traditions`, {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to create tradition');
  return res.json();
}

export async function updateTradition(token, placeId, tid, data) {
  const res = await fetch(`${BASE}/api/places/${placeId}/traditions/${tid}`, {
    method: 'PUT',
    headers: authHeader(token),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to update tradition');
  return res.json();
}

export async function uploadImage(token, file) {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${BASE}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form
  });
  if (!res.ok) throw new Error('Αποτυχία ανεβάσματος εικόνας');
  return res.json(); // { url }
}

export async function deleteTradition(token, placeId, tid) {
  const res = await fetch(`${BASE}/api/places/${placeId}/traditions/${tid}`, {
    method: 'DELETE',
    headers: authHeader(token)
  });
  if (!res.ok) throw new Error('Failed to delete tradition');
  return res.json();
}
