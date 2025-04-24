export const isValidEmail = (email: string): boolean => {
    // More comprehensive email validation regex
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };
  
  export const isValidPassword = (password: string): boolean => {
    // Password must be at least 8 characters long
    if (password.length < 8) return false;
    
    return true;
  };
  