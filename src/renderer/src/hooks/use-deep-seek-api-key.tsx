import localforage from 'localforage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_KEY_STORAGE_KEY = 'DEEPSEEK_API_KEY';

export const useDeepSeekApiKey = () => {
  const queryClient = useQueryClient();

  const { data: apiKey } = useQuery({
    queryKey: [API_KEY_STORAGE_KEY],
    queryFn: async () => {
      try {
        const value = await localforage.getItem<string>(API_KEY_STORAGE_KEY);
        return value ?? '';
      } catch (err) {
        console.error(err);
        return '';
      }
    },
  });

  const { mutate: setApiKey } = useMutation({
    mutationFn: async (key: string) => {
      try {
        await localforage.setItem(API_KEY_STORAGE_KEY, key);
        return key;
      } catch (err) {
        console.error(err);
        return key;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_KEY_STORAGE_KEY] });
    },
  });

  return { apiKey, setApiKey };
};
