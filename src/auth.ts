import Keycloak from 'keycloak-js';
import { config } from './config';

const keycloak = new Keycloak({
  url: config.keycloakUrl,
  realm: config.realm,
  clientId: config.clientId,
});

export function initAuth(): Promise<boolean> {
  return keycloak.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
  });
}

export function login(): Promise<void> {
  return keycloak.login({ redirectUri: window.location.href });
}

export async function getToken(): Promise<string | undefined> {
  if (!keycloak.authenticated) {
    return undefined;
  }
  await keycloak.updateToken(30);
  return keycloak.token;
}
