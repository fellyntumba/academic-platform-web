
// 1. Envoi OTP
export async function envoiOTP(email){

      try {
          const API_URL = 'http://localhost:3000/api/enseignant/send-otp';

          const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
            
          return res;

        } catch (error) {
            console.log(error);
        }
};

// 2. Verification OTP
export async function verificationOTP(email, otp){
    try {
        const API_URL = 'http://localhost:3000/api/enseignant/verify-otp';
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        
        return res;
    } catch (error) {
        console.log(error);
    }
}


