// src/environments/environment.staging.ts

export const environment = {
    production: false, // Staging is not the final production environment
    apiUrl: 'https://rawn-cafe-backend-631bf37fe97e.herokuapp.com/api'  // Replace with your staging API URL
  } as { production: boolean, apiUrl: string};