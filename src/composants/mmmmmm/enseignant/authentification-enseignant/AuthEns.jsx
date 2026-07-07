import {  useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { createPortal } from "react-dom";
import { useDispatch } from 'react-redux';
import { setEnseignant } from '../../../enseignantSlice';
import AuthErreur from './AuthErreur';
import { envoiOTP, verificationOTP } from '../services/AuthentificationEnseign';
import '../../../styles-pages/enseignant/Authentification/AuthEns.css'

 

function AuthEns() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [otp, setOtp]     = useState('');
  const [step, setStep]   = useState(1);

  const [erreur, setErreur] = useState('');
  const [showErreur, setShowErreur] = useState(false);

  const [showValidation, setShowValidation] = useState(
    {
      email:false,
      otp:false
    } 
  );
    // 1. Envoi OTP
  const handleSendEmail = async(e) => {
        e.preventDefault();
        try {
          const result = await envoiOTP(email);
            if (result.ok) {
              setShowValidation(state=>({...state, email :false}));
              setShowValidation(state=>({...state, otp :false}));
              console.log('OTP envoyé à votre adresse email.');
              setStep(2);
            } else {
              setShowValidation(state=>({...state, email :true}));
              setShowValidation(state=>({...state, otp :true}));
              setErreur('ERREUR: Email non trouvé.');
              setShowErreur(true);
              // console.log('Erreur lors de l’envoi.');
            }

          } catch (error) {
              setShowValidation(state=>({...state, email :true}));
              setShowValidation(state=>({...state, otp :true}));
              setErreur('Erreur réseau.');
              setShowErreur(true);
              // console.log('Erreur réseau.');
          }
  };
        
  // 2. Verification OTP
  const handleVerifyOtp = async (e) => {
          e.preventDefault();
          try {
            const result = await verificationOTP(email, otp);       
              if (result.ok) {
                const data = await result.json();
                console.log(data.id_enseignant);
                dispatch(setEnseignant(data.id_enseignant))
                setShowValidation(state=>({...state, email :false}));
                setShowValidation(state=>({...state, otp :false}));
                navigate('/enseignant');

              } else {
                setShowValidation(state=>({...state, email :true}));
                setShowValidation(state=>({...state, otp :true}));
                setErreur('OTP invalide ou expiré.');
                setShowErreur(true);
                // console.log('Erreur lors de la verification.');
              }

          } catch (error) {
              setShowValidation(state=>({...state, email :true}));
              setShowValidation(state=>({...state, otp :true}));
              setErreur('Erreur réseau.');
              setShowErreur(true);
              // console.log('Erreur réseau.');
            }

  };
  

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Connexion à l’espace enseignant</h2>
        <form onSubmit={step === 1 ? handleSendEmail : handleVerifyOtp}>
              <input className={showValidation.email ? " input-adm-erreur" : "input-adm-valid"} 
              name='email' type="mail" placeholder="Entrer l' email" value={email} required 
              onChange={(e) => setEmail(e.target.value)} disabled ={step ===2}/>

            {step === 2 && (
              <input className={showValidation.otp ? " input-adm-erreur" : "input-adm-valid"}
              name='email' type="text" placeholder="Entrer l' OTP réçu dans le mail." value={otp} required 
              onChange={(e) => setOtp(e.target.value)} />
            )}

              <button type="submit">{step === 1 ? 'Se connecter' : `Envoyer l'OTP`}</button>
              
        </form>
        {/* <div className="footer-auth-enseign">
          <p><a href="#">Mot de passe oublié ?</a></p>
        </div> */}
      </div>
      {showErreur!='' && createPortal(< AuthErreur erreur={erreur} setShowErreur={()=> setShowErreur(false)}/>, document.body)}
    </div>
  )
}
export default AuthEns


