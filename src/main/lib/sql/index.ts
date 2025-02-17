export const parseSqlConnectionString = (connectionString: string): any => {
  const config: any = {};

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
    config.authentication = { type: 'ntlm' }; // Windows Authentication (Integrated Security)
  }

  return config;
};
