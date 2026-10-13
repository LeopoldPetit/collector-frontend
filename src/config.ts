export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  keycloakUrl: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: 'collector-shop',
  clientId: 'collector-frontend',
};
