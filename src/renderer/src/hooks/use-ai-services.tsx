import { DeepSeekApi } from '../services/deep-seek';

export const useAiServices = () => {
  return {
    getSqlJoins: async function (msg, apiKey) {
      if (msg && apiKey) {
        const deepSeek = new DeepSeekApi(apiKey);
        const response = await deepSeek.generateSQL(msg);

        if (response.includes('```sql'))
          return response.replaceAll('```sql', '').replaceAll('```', '');

        return response;
      }

      return '';
    },
  };
};
