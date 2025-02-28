import { config } from 'mssql';

interface NtlmAuthentication {
  type: 'ntlm';
  options: {
    userName: string;
    password: string;
    domain: string;
  };
}

interface SqlConfig extends config {
  server: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  options?: {
    trustServerCertificate?: boolean;
    appName?: string;
    multipleActiveResultSets?: boolean;
  };
  authentication?: NtlmAuthentication;
  validateConfig: () => boolean;
}

export const parseSqlConnectionString = (connectionString: string): SqlConfig => {
  const config: SqlConfig = {
    server: '',
    validateConfig: (): boolean => {
      if (!config.server) {
        throw new Error('Server is undefined in the SQL connection configuration.');
      }

      return true;
    },
  };

  // Split key-value pairs
  const pairs = connectionString.split(';');

  pairs.forEach((pair: string) => {
    const [key, value] = pair.split('=').map((part: string) => part.trim());

    if (!key || !value) return; // Skip empty values

    switch (typeof key === 'string' ? key.toLowerCase() : '') {
      case 'data source': {
        // Check if a port is specified
        const [server, port] = value.split(',');
        config.server = server.trim();
        if (port) {
          config.port = parseInt(port.trim(), 10);
        }
        break;
      }
      case 'initial catalog':
        config.database = value;
        break;
      case 'user id':
        config.user = value;
        break;
      case 'password':
        config.password = value;
        break;
      case 'trustservercertificate':
        config.options = {
          ...(config.options || {}),
          trustServerCertificate: value.toLowerCase() === 'true',
        };
        break;
      case 'application name':
        config.options = { ...(config.options || {}), appName: value };
        break;
      case 'multipleactiveresultsets':
        config.options = {
          ...(config.options || {}),
          multipleActiveResultSets: value.toLowerCase() === 'true',
        };
        break;
    }
  });

  // Determine authentication type
  if (!config.user || !config.password) {
    config.authentication = {
      type: 'ntlm',
      options: {
        userName: '',
        password: '',
        domain: '',
      },
    }; // Windows Authentication (Integrated Security)
  }

  return config;
};
