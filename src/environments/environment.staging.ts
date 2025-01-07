// src/environments/environment.staging.ts

export const environment = {
    production: false, // Staging is not the final production environment
    apiUrl: 'hhttps://rawncafe-3d7528568e5c.herokuapp.com/api'  // Replace with your staging API URL
  } as { production: boolean, apiUrl: string};