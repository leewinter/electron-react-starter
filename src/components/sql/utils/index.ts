export const parseSqlConnectionString = (connectionString: string) => {
  const config: any = {};

  // Split key-value pairs
  const pairs = connectionString.split(';');
  
  pairs.forEach(pair => {
    const [key, value] = pair.split('=').map(part => part.trim());

    if (!key || !value) return; // Skip empty values

    switch (typeof key === 'string' ? key.toLowerCase() : '') {
      case 'data source':
        config.server = value;
        break;
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
        config.options = { trustServerCertificate: Boolean(value) == true };
        break;
      case 'application name':
        config.options = { ...(config.options || {}), appName: value };
        break;
      case 'multipleactiveresultsets':
        config.options = { ...(config.options || {}), multipleActiveResultSets: Boolean(value) == true };
        break;
    }
  });

  // Determine authentication type
  if (!config.user || !config.password) {
    config.authentication = { type: 'ntlm' }; // Windows Authentication (Integrated Security)
  }

  return config;
};