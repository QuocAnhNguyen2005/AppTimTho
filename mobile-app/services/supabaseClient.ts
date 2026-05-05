// import { createClient } from '@supabase/supabase-js';

// Khai báo kết nối Supabase
// const supabaseUrl = 'YOUR_SUPABASE_URL';
// const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const mockFetchJobs = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', title: 'Sửa tủ lạnh', status: 'finding' }
      ]);
    }, 1000);
  });
};
