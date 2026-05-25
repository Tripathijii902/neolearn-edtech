import { create } from 'zustand';

const useThemeStore = create((set) => ({
  isDarkMode: localStorage.getItem('theme') !== 'light',
  
  toggleTheme: () => set((state) => {
    const newTheme = !state.isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return { isDarkMode: !state.isDarkMode };
  }),
  
  initTheme: () => {
    if (localStorage.getItem('theme') === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }
}));

export default useThemeStore;
