type dataType = {
  valid: string;
}

export const validateOTP = async (email: string, token: string) => {
  try {
    const response = await fetch('/api/verify-2fa-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, token }),
    });

    if (!response.ok) {
      throw new Error('Failed to validate OTP');
    }

    const data = await response.json() as dataType;

    if (data.valid) {
      console.log('OTP is valid');
      return true;
    } else {
      console.log('Invalid OTP');
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};
